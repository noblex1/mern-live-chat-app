import { useState, useEffect } from 'react';
import { Pin, X, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime } from '../../lib/utils';

const PinnedMessages = ({ selectedUser, onClose, onUnpinMessage }) => {
  const { authUser } = useAuthStore();
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedUser?._id) {
      fetchPinnedMessages();
    }
  }, [selectedUser?._id]);

  const fetchPinnedMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${selectedUser._id}/pinned`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setPinnedMessages(data.data || []);
      } else {
        console.error('Failed to fetch pinned messages');
      }
    } catch (error) {
      console.error('Error fetching pinned messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpin = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}/pin`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove from local state
        setPinnedMessages(prev => prev.filter(msg => msg._id !== messageId));
        // Call parent callback if provided
        if (onUnpinMessage) {
          onUnpinMessage(messageId);
        }
      }
    } catch (error) {
      console.error('Error unpinning message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Pin className="w-5 h-5 text-yellow-500" />
            Pinned Messages
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pinnedMessages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Pin className="w-5 h-5 text-yellow-500" />
            Pinned Messages
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No pinned messages yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Pin important messages to find them easily
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Pin className="w-5 h-5 text-yellow-500" />
          Pinned Messages ({pinnedMessages.length})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-3">
        {pinnedMessages.map((message) => {
          const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
          const isSent = String(senderId) === String(authUser?.id);
          
          return (
            <div
              key={message._id}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-yellow-400"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={
                        isSent
                          ? authUser?.avatar || '/avatar.png'
                          : (typeof message.senderId === 'object' ? message.senderId.avatar : selectedUser?.avatar) || '/avatar.png'
                      }
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {isSent ? 'You' : (typeof message.senderId === 'object' ? message.senderId.username : selectedUser?.username)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatMessageTime(message.pinnedAt || message.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {message.text}
                  </p>
                  
                  {message.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={message.imageUrl}
                        alt="Attachment"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleUnpin(message._id)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Unpin message"
                >
                  <Pin className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PinnedMessages; 