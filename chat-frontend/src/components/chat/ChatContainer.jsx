import { useChatStore } from '../../store/useChatStore';
import { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime } from '../../lib/utils';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      console.log('🔄 Loading messages for user:', selectedUser._id);
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      console.log('📜 Scrolling to bottom, messages count:', messages.length);
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto min-h-0">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <ChatHeader />

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          {messages.map((message) => {
            // Handle both populated and unpopulated senderId
            const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
            const isSent = String(senderId) === String(authUser?._id);
            return (
              <div
                key={message._id}
                className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-2 max-w-xs lg:max-w-md ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar - only show for received messages on left, sent messages on right */}
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex-shrink-0">
                    <img
                      src={
                        isSent
                          ? authUser?.avatar || '/avatar.png'
                          : (typeof message.senderId === 'object' ? message.senderId.avatar : selectedUser?.avatar) || '/avatar.png'
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

          {/* Typing Indicator */}
          {typingUsers[selectedUser?._id] && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex-shrink-0">
                  <img
                    src={selectedUser?.avatar || '/avatar.png'}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {typingUsers[selectedUser._id]}
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-2 text-sm shadow rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* End of messages */}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Fixed Input */}
      <MessageInput />
    </div>
  );
};

const MessageSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      {[...Array(6)].map((_, i) => {
        const isSent = i % 2 === 1;
        return (
          <div key={i} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`flex gap-2 max-w-xs lg:max-w-md ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
              <div className="flex flex-col">
                <div className={`w-12 h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2 ${isSent ? 'ml-auto' : ''}`} />
                <div
                  className={`w-32 h-8 rounded-2xl animate-pulse ${
                    isSent ? 'bg-blue-200 dark:bg-blue-700' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatContainer;
