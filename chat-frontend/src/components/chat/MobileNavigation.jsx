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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {/* Enhanced Menu Button */}
        <button
          onClick={handleOpenSidebar}
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 haptic-feedback touch-target active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Menu</span>
        </button>

        {/* Enhanced Search Users */}
        <button
          onClick={handleSearchUsers}
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 haptic-feedback touch-target active:scale-95"
          aria-label="Search users"
        >
          <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Search</span>
        </button>

        {/* Enhanced Recent Chats */}
        <button
          onClick={handleRecentChats}
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 haptic-feedback touch-target active:scale-95"
          aria-label="Recent chats"
        >
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Chats</span>
        </button>

        {/* Enhanced Current Chat Indicator */}
        {selectedUser && (
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-800">
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
