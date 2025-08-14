import { useEffect, useState, useCallback } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Users, Search, MessageCircle, X, Filter, Clock, MoreVertical } from 'lucide-react';
import { formatMessageTime } from '../../lib/utils';

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
    onlineUsers,
    sidebarOpen,
    setSidebarOpen,
    searchTerm,
    setSearchTerm
  } = useChatStore();
  
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // recent, name, online
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  useEffect(() => {
    // Load conversations (users with chat history) by default
    getConversations();
  }, [getConversations]);

  // Handle search input changes with enhanced debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers(searchTerm);
        // Add to search history
        if (!searchHistory.includes(searchTerm.trim())) {
          setSearchHistory(prev => [searchTerm.trim(), ...prev.slice(0, 4)]);
        }
        setShowSearchSuggestions(false);
      } else {
        // When search is cleared, reload conversations
        getConversations();
        setShowSearchSuggestions(true);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchUsers, getConversations, searchHistory]);

  // Determine which users to show with enhanced filtering and sorting
  const displayUsers = searchTerm.trim() ? searchResults : users;
  
  const filteredUsers = displayUsers.filter((user) => {
    const matchesOnlineFilter = showOnlineOnly ? (user.isOnline || onlineUsers.includes(user._id)) : true;
    return matchesOnlineFilter;
  });

  // Enhanced sorting
  const sortedUsers = useCallback(() => {
    return [...filteredUsers].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.username.localeCompare(b.username);
        case 'online':
          const aOnline = a.isOnline || onlineUsers.includes(a._id);
          const bOnline = b.isOnline || onlineUsers.includes(b._id);
          if (aOnline && !bOnline) return -1;
          if (!aOnline && bOnline) return 1;
          return a.username.localeCompare(b.username);
        case 'recent':
        default:
          // Sort by last message time if available, otherwise by username
          return a.lastMessageTime ? new Date(b.lastMessageTime) - new Date(a.lastMessageTime) : a.username.localeCompare(b.username);
      }
    });
  }, [filteredUsers, sortBy, onlineUsers]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Close sidebar on mobile after selecting user
    setSidebarOpen(false);
    // Clear search when selecting a user
    setSearchTerm('');
  };

  const handleSearchSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSearchSuggestions(false);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Mobile Drawer */}
      <div className="mobile-drawer">
        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="mobile-drawer-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Drawer Content */}
        <div className={`mobile-drawer-content ${sidebarOpen ? 'mobile-drawer-open' : 'mobile-drawer-closed'}`}>
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {searchTerm.trim() ? (
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="font-semibold text-gray-900 dark:text-white text-lg">
                  {searchTerm.trim() ? 'Search' : 'Chats'}
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Enhanced Search Input */}
            <div className="mt-4 relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  className="input pl-10 pr-10 text-sm py-2.5 w-full rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                  placeholder={searchTerm.trim() ? "Search users..." : "Search chats..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  aria-label="Search"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </button>
                )}
              </div>

              {/* Search Suggestions */}
              {showSearchSuggestions && searchHistory.length > 0 && !searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Recent searches</span>
                      <button
                        onClick={clearSearchHistory}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    {searchHistory.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2"
                      >
                        <Clock className="w-3 h-3" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Filters */}
            <div className="mt-3 space-y-2">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* Filter Options */}
              {showFilters && (
                <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {/* Online Filter */}
                  <div className="flex items-center justify-between">
                    <label className="cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Online only</span>
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-500">({onlineUsers.length - 1})</span>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="recent">Recent</option>
                      <option value="name">Name</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Users List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="py-2">
              {isSearching && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm">Searching...</p>
                </div>
              )}
              
              {!isSearching && sortedUsers().map((user) => (
                <ConversationItem
                  key={user._id}
                  user={user}
                  isSelected={selectedUser?._id === user._id}
                  onSelect={handleUserSelect}
                  onlineUsers={onlineUsers}
                />
              ))}

              {!isSearching && sortedUsers().length === 0 && (
                <EmptyState
                  searchTerm={searchTerm}
                  showOnlineOnly={showOnlineOnly}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Enhanced */}
      <aside className="hidden lg:block w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-5 flex-shrink-0">
          <div className="flex items-center gap-2">
            {searchTerm.trim() ? (
              <Search className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
            <span className="font-semibold text-gray-900 dark:text-white text-lg">
              {searchTerm.trim() ? 'Search Results' : 'Recent Chats'}
            </span>
          </div>

          {/* Enhanced Search */}
          <div className="mt-4 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="input pl-10 pr-10 text-sm py-2.5 w-full rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Search all users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                aria-label="Search users"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>

            {/* Search Suggestions for Desktop */}
            {showSearchSuggestions && searchHistory.length > 0 && !searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Recent searches</span>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  {searchHistory.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2"
                    >
                      <Clock className="w-3 h-3" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Filters for Desktop */}
          <div className="mt-3 space-y-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {showFilters && (
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
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

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Users List for Desktop */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="py-3">
            {isSearching && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm">Searching...</p>
              </div>
            )}
            
            {!isSearching && sortedUsers().map((user) => (
              <ConversationItem
                key={user._id}
                user={user}
                isSelected={selectedUser?._id === user._id}
                onSelect={handleUserSelect}
                onlineUsers={onlineUsers}
              />
            ))}

            {!isSearching && sortedUsers().length === 0 && (
              <EmptyState
                searchTerm={searchTerm}
                showOnlineOnly={showOnlineOnly}
              />
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button - Removed in favor of bottom navigation */}
    </>
  );
};

// Enhanced Conversation Item Component
const ConversationItem = ({ user, isSelected, onSelect, onlineUsers }) => {
  const [showOptions, setShowOptions] = useState(false);

  const isOnline = user.isOnline || onlineUsers.includes(user._id);

  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(user)}
        className={`w-full p-3 flex items-center gap-3 rounded-xl mx-2 mb-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 haptic-feedback touch-target ${
          isSelected ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' : ''
        }`}
      >
        <div className="relative">
          <img
            src={user.avatar || '/avatar.png'}
            alt={user.username}
            className="w-12 h-12 object-cover rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-medium truncate text-gray-900 dark:text-white">{user.username}</div>
            {user.lastMessageTime && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {formatMessageTime(user.lastMessageTime)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 min-w-0">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Unread message count */}
            {user.unreadCount > 0 && (
              <span className="unread-badge text-xs">
                {user.unreadCount > 99 ? '99+' : user.unreadCount}
              </span>
            )}
          </div>

          {/* Last message preview */}
          {user.lastMessage && (
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.lastMessage.senderId === user._id ? '' : 'You: '}
              {user.lastMessage.text || '📷 Image'}
            </div>
          )}
        </div>
      </button>

      {/* Options Menu */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

// Enhanced Empty State Component
const EmptyState = ({ searchTerm, showOnlineOnly }) => {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 py-12 px-4">
      {searchTerm.trim() ? (
        <>
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="font-medium">No users found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </>
      ) : showOnlineOnly ? (
        <>
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="font-medium">No online users</p>
          <p className="text-sm mt-1">Try removing the online filter</p>
        </>
      ) : (
        <>
          <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="font-medium">No recent chats</p>
          <p className="text-sm mt-1">Search for users to start a conversation</p>
        </>
      )}
    </div>
  );
};

// Skeleton loader component
const SidebarSkeleton = () => {
  return (
    <aside className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 p-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="mt-4">
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="py-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full p-3 flex items-center gap-3 mx-2 mb-1">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1">
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