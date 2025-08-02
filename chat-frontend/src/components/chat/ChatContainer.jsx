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
  const { authUser: _authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [pinnedMessagesCount, setPinnedMessagesCount] = useState(0);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      fetchPinnedMessagesCount();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchPinnedMessagesCount = async () => {
    try {
      const pinnedMessages = await getPinnedMessages(selectedUser._id);
      setPinnedMessagesCount(pinnedMessages.length);
    } catch (error) {
      console.error('Failed to fetch pinned messages count:', error);
    }
  };

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
      {pinnedMessagesCount > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
          <button
            onClick={() => setShowPinnedMessages(true)}
            className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors w-full justify-center"
          >
            <Pin className="w-4 h-4" />
            <span>{pinnedMessagesCount} pinned message{pinnedMessagesCount !== 1 ? 's' : ''}</span>
            <span className="text-xs opacity-75">(click to view)</span>
          </button>
        </div>
      )}
      {showPinnedMessages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <PinnedMessages
            selectedUser={selectedUser}
            onClose={() => setShowPinnedMessages(false)}
            onUnpinMessage={handleUnpinMessage}
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <Message
              key={message._id}
              message={message}
              onMessageUpdate={handleMessageUpdate}
              onMessageDelete={handleMessageDelete}
              onMessagePin={handleMessagePin}
            />
          ))}
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
          <div ref={messageEndRef} />
        </div>
      </div>
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
