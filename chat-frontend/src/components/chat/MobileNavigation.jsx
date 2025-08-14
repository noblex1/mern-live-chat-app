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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {/* Menu Button */}
        <button
          onClick={handleOpenSidebar}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors haptic-feedback touch-target"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Menu</span>
        </button>

        {/* Search Users */}
        <button
          onClick={handleSearchUsers}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors haptic-feedback touch-target"
          aria-label="Search users"
        >
          <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Search</span>
        </button>

        {/* Recent Chats */}
        <button
          onClick={handleRecentChats}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors haptic-feedback touch-target"
          aria-label="Recent chats"
        >
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Chats</span>
        </button>

        {/* Current Chat Indicator */}
        {selectedUser && (
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {selectedUser.username.length > 8 ? selectedUser.username.substring(0, 8) + '...' : selectedUser.username}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
