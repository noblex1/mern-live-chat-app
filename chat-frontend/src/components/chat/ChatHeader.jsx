import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { X, Phone, Video, MoreVertical } from 'lucide-react';
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

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar - Clickable */}
          <div 
            className="relative cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfileClick}
          >
            <img
              src={selectedUser?.avatar || '/avatar.png'}
              alt={selectedUser?.username || 'User'}
              className="w-10 h-10 object-cover rounded-full"
            />
            {selectedUser?._id && (selectedUser.isOnline || onlineUsers.includes(selectedUser._id)) && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
            )}
          </div>

          {/* User Info - Also Clickable */}
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfileClick}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">{selectedUser?.username || 'User'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedUser?._id && (selectedUser.isOnline || onlineUsers.includes(selectedUser._id)) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
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