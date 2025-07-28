import { X, Mail, Calendar, MapPin, User, Heart } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

const ProfileModal = ({ user, isOpen, onClose }) => {
  const { profileDetails, isProfileLoading } = useChatStore();

  if (!isOpen || !user) return null;

  // Use fetched profile details if available, otherwise fall back to basic user info
  const displayUser = profileDetails || user;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {isProfileLoading ? (
            // Loading state
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading profile details...</p>
            </div>
          ) : (
            <>
              {/* Avatar and Basic Info */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={displayUser.avatar || '/avatar.png'}
                    alt={displayUser.username}
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                  />
                  {displayUser.isOnline && (
                    <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {displayUser.username}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {displayUser.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                {displayUser.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{displayUser.email}</p>
                    </div>
                  </div>
                )}

                {displayUser.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(displayUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {displayUser.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-900 dark:text-white">{displayUser.location}</p>
                    </div>
                  </div>
                )}

                {displayUser.city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                      <p className="text-gray-900 dark:text-white">{displayUser.city}</p>
                    </div>
                  </div>
                )}

                {displayUser.relationshipStatus && (
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Relationship Status</p>
                      <p className="text-gray-900 dark:text-white">{displayUser.relationshipStatus}</p>
                    </div>
                  </div>
                )}

                {displayUser.dateOfBirth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(displayUser.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {displayUser.bio && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Bio</p>
                    <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                      {displayUser.bio}
                    </p>
                  </div>
                )}

                {/* Show message if no additional details are available */}
                {!displayUser.email && !displayUser.location && !displayUser.city && 
                 !displayUser.relationshipStatus && !displayUser.dateOfBirth && !displayUser.bio && (
                  <div className="text-center py-4">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No additional profile information available
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Message
                </button>
                <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Block
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal; 