import { useChatStore } from '../../store/useChatStore';
import { ArrowLeft, Phone, Video, MoreVertical, User, Search } from 'lucide-react';
import { useState } from 'react';
import ProfileModal from './ProfileModal';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, onlineUsers, getUserProfile, clearProfileDetails } = useChatStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileClick = async () => {
    if (selectedUser) {
      setIsProfileModalOpen(true);
      // Fetch detailed profile information from backend
      await getUserProfile(selectedUser._id);
    }
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    // Clear profile details when modal is closed
    clearProfileDetails();
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  const isOnline = selectedUser?._id && (selectedUser.isOnline || onlineUsers.includes(selectedUser._id));

  return (
    <>
      <div className="mobile-header">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section - Back Button & User Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Back Button - Mobile Only */}
            <button
              onClick={handleBackClick}
              className="lg:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Avatar - Clickable */}
            <div 
              className="relative cursor-pointer hover:opacity-80 transition-opacity haptic-feedback"
              onClick={handleProfileClick}
            >
              <img
                src={selectedUser?.avatar || '/avatar.png'}
                alt={selectedUser?.username || 'User'}
                className="avatar w-10 h-10"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
              )}
            </div>

            {/* User Info - Also Clickable */}
            <div 
              className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base">
                {selectedUser?.username || 'User'}
              </h3>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {isOnline ? 'Online' : 'Offline'}
                </p>
                {/* Typing indicator could go here */}
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Search Button - Mobile Only */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
              aria-label="Search messages"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Profile Button - Mobile Only */}
            <button 
              onClick={handleProfileClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
              aria-label="View profile"
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Call Buttons - Hidden on very small screens */}
            <button 
              className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
              aria-label="Voice call"
            >
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
              aria-label="Video call"
            >
              <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* More Options */}
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        user={selectedUser}
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />
    </>
  );
};

export default ChatHeader;