import { useEffect, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Users, Search, MessageCircle } from 'lucide-react';

const Sidebar = () => {
  const { 
    getConversations,
    users, 
    searchUsers, 
    searchResults, 
    selectedUser, 
    setSelectedUser, 
    isUsersLoading, 
    isSearching,
    onlineUsers
  } = useChatStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load conversations (users with chat history) by default
    getConversations();
  }, [getConversations]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle search input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers(searchTerm);
      } else {
        // When search is cleared, reload conversations
        getConversations();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchUsers, getConversations]);

  // Determine which users to show
  const displayUsers = searchTerm.trim() ? searchResults : users;
  
  const filteredUsers = displayUsers.filter((user) => {
    const matchesOnlineFilter = showOnlineOnly ? (user.isOnline || onlineUsers.includes(user._id)) : true;
    return matchesOnlineFilter;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open sidebar menu"
        onClick={() => setSidebarOpen(true)}
      >
        <Users className="w-7 h-7" />
      </button>
      {/* Sidebar overlay for mobile */}
      <div
        className={`lg:hidden fixed inset-0 top-16 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${sidebarOpen ? 'block' : 'hidden'}`}
        aria-hidden={!sidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed lg:static top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-full w-full max-w-xs sm:max-w-sm lg:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl transition-transform duration-300 z-[60] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        aria-label="Sidebar"
        style={{ touchAction: sidebarOpen ? 'none' : 'auto', overflowY: sidebarOpen ? 'auto' : 'unset' }}
      >
        {/* Header - Fixed */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-5 flex-shrink-0">
          <div className="flex items-center gap-2">
            {searchTerm.trim() ? (
              <Search className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
            <span className="font-semibold text-gray-900 dark:text-white hidden sm:inline-block lg:block text-base sm:text-lg">
              {searchTerm.trim() ? 'Search Results' : 'Recent Chats'}
            </span>
          </div>

        {/* Search */}
        <div className="mt-4 block lg:block">
          {/* Mobile search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="input pl-10 text-sm sm:text-base py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search all users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search users"
            />
          </div>
        </div>

        {/* Online Filter - only show for conversations */}
        {!searchTerm.trim() && (
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Show online only</span>
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-500">({onlineUsers.length - 1} online)</span>
          </div>
        )}
        
        {/* Info text for conversations */}
        {!searchTerm.trim() && (
          <div className="mt-2 hidden lg:block">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing users you've chatted with
            </p>
          </div>
        )}
      </div>

      {/* Users List - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="py-3">
          {/* Show search results or conversations */}
          {searchTerm.trim() ? (
            // Search results
            <>
              {isSearching && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm">Searching...</p>
                </div>
              )}
              
              {!isSearching && filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedUser?._id === user._id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.avatar || '/avatar.png'}
                      alt={user.username}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full"
                    />
                    {(user.isOnline || onlineUsers.includes(user._id)) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
                    )}
                  </div>

                  {/* User info - only visible on larger screens */}
                  <div className="hidden sm:block text-left min-w-0 flex-1">
                    <div className="font-medium truncate text-gray-900 dark:text-white">{user.username}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {(user.isOnline || onlineUsers.includes(user._id)) ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </button>
              ))}

              {!isSearching && filteredUsers.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p>No users found</p>
                </div>
              )}
            </>
          ) : (
            // Conversations
            <>
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedUser?._id === user._id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.avatar || '/avatar.png'}
                      alt={user.username}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full"
                    />
                    {(user.isOnline || onlineUsers.includes(user._id)) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
                    )}
                  </div>

                  {/* User info - only visible on larger screens */}
                  <div className="hidden sm:block text-left min-w-0 flex-1">
                    <div className="font-medium truncate text-gray-900 dark:text-white">{user.username}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {(user.isOnline || onlineUsers.includes(user._id)) ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </button>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p>No recent chats</p>
                  <p className="text-sm mt-2">Search for users to start a conversation</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
        {/* ...existing sidebar content... */}
      </aside>
    </>
  );
};

// Skeleton loader component
const SidebarSkeleton = () => {
  return (
    <aside className="w-20 lg:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Mobile skeleton: just a placeholder, no close button logic */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse hidden lg:block" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="py-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full p-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto lg:mx-0" />
              <div className="hidden lg:block flex-1">
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;