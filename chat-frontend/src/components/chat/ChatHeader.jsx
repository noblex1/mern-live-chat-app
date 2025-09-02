import { useChatStore } from '../../store/useChatStore';
import { ArrowLeft, Phone, Video, MoreVertical, User, Search, Volume2, VolumeX, Archive, Trash2, Star } from 'lucide-react';
import { useState } from 'react';
import ProfileModal from './ProfileModal';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, onlineUsers, getUserProfile, clearProfileDetails, typingUsers } = useChatStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  const handleCall = (type) => {
    // TODO: Implement call functionality
    console.log(`${type} call to ${selectedUser?.username}`);
  };

  const handleMoreAction = (action) => {
    switch (action) {
      case 'mute':
        setIsMuted(!isMuted);
        break;
      case 'star':
        // TODO: Implement star conversation
        break;
      case 'archive':
        // TODO: Implement archive conversation
        break;
      case 'delete':
        // TODO: Implement delete conversation
        break;
      default:
        break;
    }
    setShowMoreOptions(false);
  };

  const isOnline = selectedUser?._id && (selectedUser.isOnline || onlineUsers.includes(selectedUser._id));
  const isTyping = typingUsers[selectedUser?._id];

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Enhanced Left Section - Back Button & User Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Enhanced Back Button - Mobile Only */}
            <button
              onClick={handleBackClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 haptic-feedback touch-target"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Enhanced Avatar - Clickable */}
            <div 
              className="relative cursor-pointer hover:opacity-80 transition-opacity haptic-feedback"
              onClick={handleProfileClick}
            >
              <img
                src={selectedUser?.avatar || '/avatar.png'}
                alt={selectedUser?.username || 'User'}
                className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-lg object-cover"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800 animate-pulse" />
              )}
            </div>

            {/* Enhanced User Info - Also Clickable */}
            <div 
              className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                {selectedUser?.username || 'User'}
              </h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {isTyping ? (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">typing...</span>
                  ) : isOnline ? (
                    'online'
                  ) : (
                    'offline'
                  )}
                </p>
                {isMuted && (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Right Section - Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Enhanced Search Button */}
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 haptic-feedback touch-target"
              aria-label="Search messages"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Enhanced Mute Button */}
            <button 
              onClick={() => handleMoreAction('mute')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 haptic-feedback touch-target"
              aria-label={isMuted ? "Unmute conversation" : "Mute conversation"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Enhanced Call Buttons */}
            <button 
              onClick={() => handleCall('voice')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 haptic-feedback touch-target"
              aria-label="Voice call"
            >
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              onClick={() => handleCall('video')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 haptic-feedback touch-target"
              aria-label="Video call"
            >
              <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Enhanced More Options */}
            <div className="relative">
              <button 
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 haptic-feedback touch-target"
                aria-label="More options"
              >
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* More Options Dropdown */}
              {showMoreOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => handleMoreAction('star')}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      Star conversation
                    </button>
                    <button
                      onClick={() => handleMoreAction('archive')}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      Archive conversation
                    </button>
                    <button
                      onClick={() => handleMoreAction('delete')}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete conversation
                    </button>
                  </div>
                </div>
              )}
            </div>
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