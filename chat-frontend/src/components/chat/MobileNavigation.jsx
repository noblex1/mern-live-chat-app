import { Users, MessageCircle, Search, Menu } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

const MobileNavigation = () => {
  const { selectedUser, setSidebarOpen, setSearchTerm } = useChatStore();

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const handleSearchUsers = () => {
    setSidebarOpen(true);
    setTimeout(() => {
      setSearchTerm('');
      const searchInput = document.querySelector('input[placeholder*="Search"]');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  const handleRecentChats = () => {
    setSidebarOpen(true);
    setSearchTerm('');
  };

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-container">
        {/* Enhanced Menu Button */}
        <button
          onClick={handleOpenSidebar}
          className="mobile-nav-button"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Menu</span>
        </button>

        {/* Enhanced Search Users */}
        <button
          onClick={handleSearchUsers}
          className="mobile-nav-button"
          aria-label="Search users"
        >
          <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Search</span>
        </button>

        {/* Enhanced Recent Chats */}
        <button
          onClick={handleRecentChats}
          className="mobile-nav-button"
          aria-label="Recent chats"
        >
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Chats</span>
        </button>

        {/* Enhanced Current Chat Indicator */}
        {selectedUser && (
          <div className="mobile-nav-button mobile-nav-button-active">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[60px]">
              {selectedUser.username.length > 8 ? selectedUser.username.substring(0, 8) + '...' : selectedUser.username}
            </span>
          </div>
        )}
      </div>
      
      {/* Enhanced visual separator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full -mt-2 opacity-60" />
    </div>
  );
};

export default MobileNavigation;
