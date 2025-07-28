import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime } from '../../lib/utils';

const ChatTest = () => {
  const { authUser } = useAuthStore();

  // Sample messages for testing
  const testMessages = [
    {
      _id: '1',
      text: 'Hey Toyy! Sup',
      senderId: authUser?._id || 'current-user',
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      imageUrl: null
    },
    {
      _id: '2',
      text: "I'm good Tate!",
      senderId: 'other-user',
      createdAt: new Date(Date.now() - 3540000), // 59 minutes ago
      imageUrl: null
    },
    {
      _id: '3',
      text: 'Ur end',
      senderId: 'other-user',
      createdAt: new Date(Date.now() - 3540000), // 59 minutes ago
      imageUrl: null
    },
    {
      _id: '4',
      text: '',
      senderId: authUser?._id || 'current-user',
      createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    }
  ];

  const selectedUser = {
    _id: 'other-user',
    username: 'toyy',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    isOnline: false
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedUser.avatar}
              alt={selectedUser.username}
              className="w-10 h-10 object-cover rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{selectedUser.username}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Offline</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          {testMessages.map((message) => {
            const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
            const isSent = String(senderId) === String(authUser?._id || 'current-user');
            
            return (
              <div
                key={message._id}
                className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-2 max-w-xs lg:max-w-md ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex-shrink-0">
                    <img
                      src={
                        isSent
                          ? (authUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face')
                          : selectedUser.avatar
                      }
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Message Content */}
                  <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                    {/* Time */}
                    <div className={`text-xs text-gray-500 dark:text-gray-400 mb-1 ${isSent ? 'text-right' : 'text-left'}`}>
                      {formatMessageTime(message.createdAt)}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-2 text-sm shadow max-w-xs lg:max-w-md break-words ${
                        isSent
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                      }`}
                    >
                      {message.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={message.imageUrl}
                            alt="Attachment"
                            className="max-w-full rounded-lg object-cover"
                            style={{ maxHeight: '200px' }}
                            loading="lazy"
                          />
                        </div>
                      )}
                      {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            📎
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            😊
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            ✈️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTest; 