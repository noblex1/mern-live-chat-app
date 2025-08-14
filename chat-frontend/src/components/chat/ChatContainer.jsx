import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useChatStore } from '../../store/useChatStore';

import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import PinnedMessages from './PinnedMessages';
import MobileMessageList from './MobileMessageList';
import Message from './Message';

import { BsPinAngleFill } from 'react-icons/bs';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUsers,
    editMessage,
    deleteMessage,
    pinMessage,
    getPinnedMessages,
  } = useChatStore();

  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [pinnedMessagesCount, setPinnedMessagesCount] = useState(0);

  const fetchPinnedMessagesCount = useCallback(async () => {
    try {
      const pinnedMessages = await getPinnedMessages(selectedUser._id);
      setPinnedMessagesCount(pinnedMessages.length);
    } catch (error) {
      console.error('Failed to fetch pinned messages count:', error);
    }
  }, [selectedUser?._id, getPinnedMessages]);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      fetchPinnedMessagesCount();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages, fetchPinnedMessagesCount]);

  const handleMessageUpdate = async (messageId, newText) => {
    try {
      await editMessage(messageId, newText);
    } catch (error) {
      throw error;
    }
  };

  const handleMessageDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);
      await fetchPinnedMessagesCount();
    } catch (error) {
      throw error;
    }
  };

  const handleMessagePin = async (messageId) => {
    try {
      await pinMessage(messageId);
      await fetchPinnedMessagesCount();
    } catch (error) {
      throw error;
    }
  };

  const handleUnpinMessage = async (messageId) => {
    try {
      await pinMessage(messageId);
      await fetchPinnedMessagesCount();
    } catch (error) {
      console.error('Failed to unpin message:', error);
    }
  };

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
      <ChatHeader />
      
      {/* Pinned Messages Banner */}
      {pinnedMessagesCount > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
          <button
            onClick={() => setShowPinnedMessages(true)}
            className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors w-full justify-center haptic-feedback touch-target"
          >
            <BsPinAngleFill className="w-4 h-4" />
            <span>{pinnedMessagesCount} pinned message{pinnedMessagesCount !== 1 ? 's' : ''}</span>
            <span className="text-xs opacity-75">(tap to view)</span>
          </button>
        </div>
      )}

      {/* Pinned Messages Modal */}
      {showPinnedMessages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <PinnedMessages
            selectedUser={selectedUser}
            onClose={() => setShowPinnedMessages(false)}
            onUnpinMessage={handleUnpinMessage}
          />
        </div>
      )}

      {/* Mobile Message List */}
      <div className="lg:hidden">
        <MobileMessageList
          messages={messages}
          onMessageUpdate={handleMessageUpdate}
          onMessageDelete={handleMessageDelete}
          onMessagePin={handleMessagePin}
          typingUsers={typingUsers}
          selectedUser={selectedUser}
        />
      </div>

      {/* Desktop Message List */}
      <div className="hidden lg:block flex-1 overflow-y-auto min-h-0">
        <DesktopMessageList
          messages={messages}
          onMessageUpdate={handleMessageUpdate}
          onMessageDelete={handleMessageDelete}
          onMessagePin={handleMessagePin}
          typingUsers={typingUsers}
          selectedUser={selectedUser}
        />
      </div>
      
      <MessageInput />
    </div>
  );
};

// Desktop Message List Component
const DesktopMessageList = ({ 
  messages, 
  onMessageUpdate, 
  onMessageDelete, 
  onMessagePin, 
  typingUsers, 
  selectedUser 
}) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Group messages by sender and time proximity
  const groupMessages = (messages) => {
    if (!messages || messages.length === 0) return [];

    const groups = [];
    let currentGroup = [];
    let currentSender = null;
    let lastMessageTime = null;

    messages.forEach((message, index) => {
      const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
      const messageTime = new Date(message.createdAt).getTime();
      
      // Check if this message should start a new group
      const timeDiff = lastMessageTime ? messageTime - lastMessageTime : 0;
      const shouldStartNewGroup = 
        senderId !== currentSender || 
        timeDiff > 5 * 60 * 1000; // 5 minutes

      if (shouldStartNewGroup && currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
      }

      const nextMessage = messages[index + 1];
      const nextSenderId = nextMessage ? (typeof nextMessage.senderId === 'object' ? nextMessage.senderId._id : nextMessage.senderId) : null;
      const nextMessageTime = nextMessage ? new Date(nextMessage.createdAt).getTime() : null;
      const timeDiffToNext = nextMessageTime ? nextMessageTime - messageTime : 0;

      currentGroup.push({
        ...message,
        isFirstInGroup: currentGroup.length === 0,
        isLastInGroup: index === messages.length - 1 || 
          (nextSenderId !== senderId || timeDiffToNext > 5 * 60 * 1000)
      });

      currentSender = senderId;
      lastMessageTime = messageTime;
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const messageGroups = groupMessages(messages);

  return (
    <div className="p-4 space-y-2">
      {messageGroups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="space-y-1">
          {group.map((message) => (
            <Message
              key={message._id}
              message={message}
              onMessageUpdate={onMessageUpdate}
              onMessageDelete={onMessageDelete}
              onMessagePin={onMessagePin}
              isFirstInGroup={message.isFirstInGroup}
              isLastInGroup={message.isLastInGroup}
            />
          ))}
        </div>
      ))}
      
      {/* Typing Indicator */}
      {typingUsers[selectedUser?._id] && (
        <div className="flex justify-start">
          <div className="flex gap-2 max-w-[85%]">
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
              <div className="message-bubble-received px-4 py-2 text-sm shadow-sm">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot" style={{ animationDelay: '0.1s' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messageEndRef} />
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
              className={`flex gap-2 max-w-[85%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
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
