import { useEffect, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { ChevronLeft, Menu, Search, User } from 'lucide-react';

const MobileNavigation = ({ onMenuClick, onSearchClick, onProfileClick }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    setShowBackButton(!!selectedUser);
  }, [selectedUser]);

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-white/95 dark:bg-gray-800/95 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <button
              onClick={handleBackClick}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
              aria-label="Back to conversations"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          ) : (
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          
          {selectedUser && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedUser.avatar || '/avatar.png'}
                  alt={selectedUser.username}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {selectedUser.username}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedUser.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {selectedUser && (
            <>
              <button
                onClick={onSearchClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
                aria-label="Search messages"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <button
                onClick={onProfileClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
                aria-label="View profile"
              >
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
