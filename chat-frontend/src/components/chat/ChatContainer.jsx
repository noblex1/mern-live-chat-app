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
  const [showMessageOptions, setShowMessageOptions] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  const handleMessageReaction = async (messageId, reaction) => {
    // TODO: Implement message reactions
    console.log('Reacting to message:', messageId, 'with:', reaction);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-gray-800 chat-container">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto min-h-0 message-list message-list-with-padding">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-gray-800 chat-container">
      <ChatHeader />
      
      {/* Pinned Messages Banner */}
      {pinnedMessagesCount > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
          <button
            onClick={() => setShowPinnedMessages(true)}
            className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 transition-all duration-200 w-full justify-center active:scale-95 min-h-[44px] rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
          >
            <BsPinAngleFill className="w-4 h-4" />
            <span>{pinnedMessagesCount} pinned message{pinnedMessagesCount !== 1 ? 's' : ''}</span>
            <span className="text-xs opacity-75">(tap to view)</span>
          </button>
        </div>
      )}

      {/* Pinned Messages Modal */}
      {showPinnedMessages && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <PinnedMessages
            selectedUser={selectedUser}
            onClose={() => setShowPinnedMessages(false)}
            onUnpinMessage={handleUnpinMessage}
          />
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto min-h-0 message-list message-list-with-padding" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
        {/* Mobile Message List */}
        <div className="lg:hidden">
          <MobileMessageList
            messages={messages}
            onMessageUpdate={handleMessageUpdate}
            onMessageDelete={handleMessageDelete}
            onMessagePin={handleMessagePin}
            onMessageReaction={handleMessageReaction}
            typingUsers={typingUsers}
            selectedUser={selectedUser}
            showMessageOptions={showMessageOptions}
            setShowMessageOptions={setShowMessageOptions}
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
          />
        </div>
        
        {/* Desktop Message List */}
        <div className="hidden lg:block">
          <DesktopMessageList
            messages={messages}
            onMessageUpdate={handleMessageUpdate}
            onMessageDelete={handleMessageDelete}
            onMessagePin={handleMessagePin}
            onMessageReaction={handleMessageReaction}
            typingUsers={typingUsers}
            selectedUser={selectedUser}
            showMessageOptions={showMessageOptions}
            setShowMessageOptions={setShowMessageOptions}
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
          />
        </div>
      </div>
      
      {/* Message Input - Show for both mobile and desktop */}
      <MessageInput />
    </div>
  );
};

// Enhanced Desktop Message List Component
const DesktopMessageList = ({ 
  messages, 
  onMessageUpdate, 
  onMessageDelete, 
  onMessagePin, 
  onMessageReaction,
  typingUsers, 
  selectedUser,
  showMessageOptions,
  setShowMessageOptions,
  selectedMessage,
  setSelectedMessage
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
    <div className="p-4 space-y-2 pb-20">
      {messageGroups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="message-group">
          {group.map((message) => (
            <Message
              key={message._id}
              message={message}
              onMessageUpdate={onMessageUpdate}
              onMessageDelete={onMessageDelete}
              onMessagePin={onMessagePin}
              onMessageReaction={onMessageReaction}
              isFirstInGroup={message.isFirstInGroup}
              isLastInGroup={message.isLastInGroup}
              showMessageOptions={showMessageOptions}
              setShowMessageOptions={setShowMessageOptions}
              selectedMessage={selectedMessage}
              setSelectedMessage={setSelectedMessage}
            />
          ))}
        </div>
      ))}
      
      {/* Enhanced Typing Indicator */}
      {typingUsers[selectedUser?._id] && (
        <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300 mb-4">
          <div className="flex gap-2 max-w-[75%]">
            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex-shrink-0 mt-1">
              <img
                src={selectedUser?.avatar || '/avatar.png'}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                {typingUsers[selectedUser._id]}
              </div>
              <div className="message-bubble-received px-3 py-2 text-sm shadow-sm">
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

// Enhanced Message Skeleton Component
const MessageSkeleton = () => {
  return (
    <div className="p-4 space-y-2 pb-32">
      {[...Array(6)].map((_, i) => {
        const isSent = i % 2 === 1;
        return (
          <div key={i} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`flex gap-2 max-w-[75%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0 mt-1" />
              <div className="flex flex-col space-y-1">
                <div className={`w-12 h-2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse ${isSent ? 'ml-auto' : ''}`} />
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
