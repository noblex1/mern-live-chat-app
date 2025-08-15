import { Users, MessageCircle, Search, Menu } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

const MobileNavigation = () => {
  const { selectedUser, setSidebarOpen, setSearchTerm, getConversations } = useChatStore();

  const handleOpenSidebar = () => {
    try {
      setSidebarOpen(true);
    } catch (error) {
      console.error('Error opening sidebar:', error);
    }
  };

  const handleSearchUsers = () => {
    try {
      setSidebarOpen(true);
      
      setTimeout(() => {
        setSearchTerm('');
        
        // Try multiple selectors for better reliability
        const searchInput = document.getElementById('sidebar-search-input') || 
                           document.querySelector('input[data-testid="sidebar-search-input"]') ||
                           document.querySelector('input[placeholder*="Search"]');
        
        if (searchInput) {
          searchInput.focus();
        } else {
          // Retry after a longer delay
          setTimeout(() => {
            const retrySearchInput = document.getElementById('sidebar-search-input') || 
                                   document.querySelector('input[data-testid="sidebar-search-input"]') ||
                                   document.querySelector('input[placeholder*="Search"]');
            if (retrySearchInput) {
              retrySearchInput.focus();
            }
          }, 300);
        }
      }, 200);
    } catch (error) {
      console.error('Error in handleSearchUsers:', error);
    }
  };

  const handleRecentChats = () => {
    try {
      setSidebarOpen(true);
      setSearchTerm('');
      
      // Load conversations to ensure they're available
      setTimeout(() => {
        getConversations();
      }, 100);
    } catch (error) {
      console.error('Error in handleRecentChats:', error);
    }
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
      <div className="nav-indicator" />
    </div>
  );
};

export default MobileNavigation;
