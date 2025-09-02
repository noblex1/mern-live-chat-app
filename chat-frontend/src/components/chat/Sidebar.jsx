import { useEffect, useState, useCallback } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Users, Search, MessageCircle, X, Filter, Clock, MoreVertical, Star, Archive, Trash2 } from 'lucide-react';
import { formatMessageTime } from '../../lib/utils';
import toast from 'react-hot-toast';

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
  const [showUserOptions, setShowUserOptions] = useState(null);

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
    setShowUserOptions(null);
  };

  const handleSearchSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSearchSuggestions(false);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const handleUserAction = (action, user) => {
    switch (action) {
      case 'star':
        toast.success(`${user.username} starred`);
        break;
      case 'archive':
        toast.success(`${user.username} archived`);
        break;
      case 'delete':
        toast.success(`${user.username} conversation deleted`);
        break;
      default:
        break;
    }
    setShowUserOptions(null);
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Mobile Drawer */}
      <div className="lg:hidden">
        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Drawer Content */}
        <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out z-[60] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`} style={{ width: 'min(320px, 85vw)', paddingTop: '4rem' }}>
          <SidebarContent 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showSearchSuggestions={showSearchSuggestions}
            setShowSearchSuggestions={setShowSearchSuggestions}
            searchHistory={searchHistory}
            handleSearchSuggestionClick={handleSearchSuggestionClick}
            clearSearchHistory={clearSearchHistory}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            showOnlineOnly={showOnlineOnly}
            setShowOnlineOnly={setShowOnlineOnly}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onlineUsers={onlineUsers}
            isSearching={isSearching}
            sortedUsers={sortedUsers}
            selectedUser={selectedUser}
            handleUserSelect={handleUserSelect}
            showUserOptions={showUserOptions}
            setShowUserOptions={setShowUserOptions}
            handleUserAction={handleUserAction}
            isMobile={true}
            onClose={() => setSidebarOpen(false)}
            filteredUsers={filteredUsers}
          />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 xl:w-96 border-r border-gray-200 dark:border-gray-800 flex-col h-full bg-white dark:bg-gray-900 flex pt-16">
        <SidebarContent 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSearchSuggestions={showSearchSuggestions}
          setShowSearchSuggestions={setShowSearchSuggestions}
          searchHistory={searchHistory}
          handleSearchSuggestionClick={handleSearchSuggestionClick}
          clearSearchHistory={clearSearchHistory}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          showOnlineOnly={showOnlineOnly}
          setShowOnlineOnly={setShowOnlineOnly}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onlineUsers={onlineUsers}
          isSearching={isSearching}
          sortedUsers={sortedUsers}
          selectedUser={selectedUser}
          handleUserSelect={handleUserSelect}
          showUserOptions={showUserOptions}
          setShowUserOptions={setShowUserOptions}
          handleUserAction={handleUserAction}
          isMobile={false}
          filteredUsers={filteredUsers}
        />
      </aside>
    </>
  );
};

// Enhanced Sidebar Content Component
const SidebarContent = ({
  searchTerm,
  setSearchTerm,
  showSearchSuggestions,
  setShowSearchSuggestions,
  searchHistory,
  handleSearchSuggestionClick,
  clearSearchHistory,
  showFilters,
  setShowFilters,
  showOnlineOnly,
  setShowOnlineOnly,
  sortBy,
  setSortBy,
  onlineUsers,
  isSearching,
  sortedUsers,
  selectedUser,
  handleUserSelect,
  showUserOptions,
  setShowUserOptions,
  handleUserAction,
  isMobile,
  onClose,
  filteredUsers
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-lg">
                {searchTerm.trim() ? 'Search Results' : 'Recent Chats'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {sortedUsers().length} {searchTerm.trim() ? 'results' : 'conversations'}
              </p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 haptic-feedback touch-target"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Enhanced Search Bar */}
        <div className="relative mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-12 py-3.5 text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
              placeholder={searchTerm.trim() ? "Search users..." : "Search chats..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSearchSuggestions(true)}
              aria-label="Search"
              style={{ fontSize: '16px' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center min-h-[44px] min-w-[44px]"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          {/* Enhanced Search Suggestions */}
          {showSearchSuggestions && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recent Searches</span>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    aria-label="Clear search history"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSuggestionClick(suggestion)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 w-full text-left rounded-xl"
                    >
                      <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate text-sm">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Filter Controls */}
        <div className="flex items-center justify-between px-1 py-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 ${
                showFilters 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle filters"
            >
              <Filter className="w-3 h-3" />
              <span>Filters</span>
              {(showOnlineOnly || sortBy !== 'recent') && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {filteredUsers.length} {searchTerm.trim() ? 'results' : 'chats'}
            </span>
            {onlineUsers.length > 1 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {onlineUsers.length - 1} online
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Filters */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {/* Online Filter */}
              <div className="flex items-center justify-between">
                <label className="cursor-pointer flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showOnlineOnly}
                      onChange={(e) => setShowOnlineOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    {showOnlineOnly && (
                      <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Online only</span>
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {onlineUsers.length - 1}
                </span>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                >
                  <option value="recent">Recent</option>
                  <option value="name">Name</option>
                  <option value="online">Online</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Users List */}
      <div className="flex-1 overflow-y-auto min-h-0 sidebar-scrollable custom-scrollbar">
        <div className="py-2">
          {isSearching && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <div className="relative">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin mx-auto absolute top-2 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <p className="text-sm font-medium">Searching...</p>
            </div>
          )}
          
          {!isSearching && sortedUsers().map((user) => (
            <ConversationItem
              key={user._id}
              user={user}
              isSelected={selectedUser?._id === user._id}
              onSelect={handleUserSelect}
              onlineUsers={onlineUsers}
              showOptions={showUserOptions === user._id}
              onToggleOptions={() => setShowUserOptions(showUserOptions === user._id ? null : user._id)}
              onAction={handleUserAction}
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
  );
};

// Enhanced Conversation Item Component
const ConversationItem = ({ user, isSelected, onSelect, onlineUsers, showOptions, onToggleOptions, onAction }) => {
  const isOnline = user.isOnline || onlineUsers.includes(user._id);

  return (
    <div className="relative group mx-2 mb-2">
      <button
        onClick={() => onSelect(user)}
        className={`w-full p-4 flex items-center gap-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 haptic-feedback touch-target ${
          isSelected ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 ring-2 ring-blue-500 shadow-lg' : ''
        }`}
      >
        <div className="relative">
          <div className="relative">
            <img
              src={user.avatar || '/avatar.png'}
              alt={user.username}
              className="w-12 h-12 object-cover rounded-2xl border-2 border-white dark:border-gray-700 shadow-lg"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800 animate-pulse" />
            )}
          </div>
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold truncate text-gray-900 dark:text-white">{user.username}</div>
            {user.lastMessageTime && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                {formatMessageTime(user.lastMessageTime)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Unread message count */}
            {user.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full shadow-sm">
                {user.unreadCount > 99 ? '99+' : user.unreadCount}
              </span>
            )}
          </div>

          {/* Last message preview */}
          {user.lastMessage && (
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.lastMessage.senderId === user._id ? '' : 'You: '}
              {user.lastMessage.text || '📷 Image'}
            </div>
          )}
        </div>

        {/* Options Menu */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleOptions();
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </button>

      {/* Enhanced Options Menu */}
      {showOptions && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 min-w-[160px]">
          <div className="p-2 space-y-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction('star', user);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <Star className="w-4 h-4" />
              <span>Star</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction('archive', user);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <Archive className="w-4 h-4" />
              <span>Archive</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction('delete', user);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Empty State Component
const EmptyState = ({ searchTerm, showOnlineOnly }) => {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400 py-16 px-4">
      {searchTerm.trim() ? (
        <>
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <p className="font-semibold text-lg mb-2">No users found</p>
          <p className="text-sm">Try a different search term</p>
        </>
      ) : showOnlineOnly ? (
        <>
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <p className="font-semibold text-lg mb-2">No online users</p>
          <p className="text-sm">Try removing the online filter</p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <p className="font-semibold text-lg mb-2">No recent chats</p>
          <p className="text-sm">Search for users to start a conversation</p>
        </>
      )}
    </div>
  );
};

// Enhanced Skeleton loader component
const SidebarSkeleton = () => {
  return (
    <aside className="hidden lg:block w-80 xl:w-96 border-r border-gray-200 dark:border-gray-800 flex-col h-full bg-white dark:bg-gray-900 flex pt-16">
      <div className="border-b border-gray-200 dark:border-gray-700 p-5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="py-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full p-4 flex items-center gap-4 mx-2 mb-2">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;