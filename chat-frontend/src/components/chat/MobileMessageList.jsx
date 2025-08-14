import { useEffect, useRef, useState, useCallback } from 'react';
import Message from './Message';
import { RefreshCw } from 'lucide-react';

const MobileMessageList = ({ 
  messages, 
  onMessageUpdate, 
  onMessageDelete, 
  onMessagePin, 
  typingUsers, 
  selectedUser 
}) => {
  const messageListRef = useRef(null);
  const messageEndRef = useRef(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current && messages && !isScrolledUp) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isScrolledUp]);

  // Handle scroll position detection
  const handleScroll = useCallback(() => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsScrolledUp(!isNearBottom);
    }
  }, []);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.addEventListener('scroll', handleScroll);
      return () => messageList.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Enhanced Pull to refresh functionality
  const handleTouchStart = useCallback(() => {
    if (messageListRef.current && messageListRef.current.scrollTop === 0) {
      setIsPulling(true);
      setPullDistance(0);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (isPulling && messageListRef.current && messageListRef.current.scrollTop === 0) {
      const touch = e.touches[0];
      const distance = Math.max(0, touch.clientY - (e.targetTouches[0]?.clientY || 0));
      setPullDistance(Math.min(distance * 0.5, 80));
    }
  }, [isPulling]);

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && pullDistance > 40) {
      setIsRefreshing(true);
      // Trigger refresh
      try {
        // TODO: Implement message refresh logic
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        setIsRefreshing(false);
      }
    }
    setIsPulling(false);
    setPullDistance(0);
  }, [isPulling, pullDistance]);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.addEventListener('touchstart', handleTouchStart, { passive: true });
      messageList.addEventListener('touchmove', handleTouchMove, { passive: true });
      messageList.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        messageList.removeEventListener('touchstart', handleTouchStart);
        messageList.removeEventListener('touchmove', handleTouchMove);
        messageList.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Enhanced Group messages by sender and time proximity
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
    <div className="chat-messages-responsive" ref={messageListRef}>
      {/* Enhanced Pull to refresh indicator */}
      {isPulling && (
        <div 
          className="flex items-center justify-center py-4 text-sm text-gray-500 dark:text-gray-400 transition-all duration-200"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </div>
      )}

      <div className="chat-messages-content">
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
        
        {/* Enhanced Typing Indicator */}
        {typingUsers[selectedUser?._id] && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex gap-2 sm:gap-3 max-w-[85%]">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex-shrink-0">
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
                <div className="message-bubble-received px-3 py-2 sm:px-4 sm:py-2.5 text-sm shadow-sm">
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

      {/* Enhanced New Message Indicator */}
      {isScrolledUp && messages && messages.length > 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={() => {
              messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              setIsScrolledUp(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors haptic-feedback touch-target mobile-shadow-lg"
            aria-label="Scroll to latest message"
          >
            <span className="text-sm font-medium">New message</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileMessageList;
