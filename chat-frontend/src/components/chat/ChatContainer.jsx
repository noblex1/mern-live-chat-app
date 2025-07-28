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
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
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
            const isSent = senderId === authUser?._id;
            console.log('Message debug:', {
              messageId: message._id,
              messageSenderId: message.senderId,
              senderIdAfterProcessing: senderId,
              authUserId: authUser?._id,
              isSent,
              messageText: message.text
            });
            return (
              <div
                key={message._id}
                className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-2 max-w-xs lg:max-w-md ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex-shrink-0">
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
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {formatMessageTime(message.createdAt)}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-xl px-4 py-2 text-sm shadow ${
                        isSent
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      {message.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={message.imageUrl}
                            alt="Attachment"
                            className="max-w-full max-h-64 rounded-lg object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      {message.text && <p className={message.imageUrl ? 'mt-2' : ''}>{message.text}</p>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div
            className={`flex gap-2 max-w-xs lg:max-w-md ${
              i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
            <div className="flex flex-col">
              <div className="w-12 h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div
                className={`w-32 h-8 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse ${
                  i % 2 === 0 ? '' : 'ml-auto'
                }`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;
