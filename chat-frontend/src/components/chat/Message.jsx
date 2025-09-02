import { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Pin, MoreVertical, Check, X, CheckCheck, Smile, Reply } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const Message = ({ 
  message, 
  onMessageUpdate, 
  onMessageDelete, 
  onMessagePin, 
  onMessageReaction,
  isFirstInGroup = false, 
  isLastInGroup = false
}) => {
  const { authUser } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const menuRef = useRef(null);
  const editInputRef = useRef(null);

  // Handle sender identification
  const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
  const isSent = String(senderId) === String(authUser?.id);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus edit input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setEditText(message.text || '');
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    if (editText.trim() === message.text) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onMessageUpdate(message._id, editText.trim());
      setIsEditing(false);
      toast.success('Message updated successfully');
    } catch (error) {
      toast.error('Failed to update message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(message.text || '');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setIsLoading(true);
      try {
        await onMessageDelete(message._id);
        toast.success('Message deleted successfully');
      } catch (error) {
        toast.error('Failed to delete message');
      } finally {
        setIsLoading(false);
      }
    }
    setShowMenu(false);
  };

  const handlePin = async () => {
    setIsLoading(true);
    try {
      await onMessagePin(message._id);
      toast.success(message.isPinned ? 'Message unpinned' : 'Message pinned');
    } catch (error) {
      toast.error('Failed to pin message');
    } finally {
      setIsLoading(false);
    }
    setShowMenu(false);
  };

  const handleReaction = async (reaction) => {
    try {
      await onMessageReaction(message._id, reaction);
      setShowReactions(false);
    } catch (error) {
      toast.error('Failed to add reaction');
    }
  };

  // Message status component with WhatsApp-style indicators
  const MessageStatus = () => {
    if (!isSent) return null;
    
    return (
      <div className="flex items-center gap-0.5 ml-2">
        {message.isRead ? (
          <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
        ) : message.isDelivered ? (
          <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <Check className="w-3.5 h-3.5 text-gray-400" />
        )}
      </div>
    );
  };

  // Quick reactions
  const quickReactions = [
    { emoji: '❤️', reaction: 'heart' },
    { emoji: '👍', reaction: 'thumbsup' },
    { emoji: '😊', reaction: 'smile' },
    { emoji: '👏', reaction: 'clap' },
    { emoji: '🎉', reaction: 'party' },
    { emoji: '🔥', reaction: 'fire' }
  ];

  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} mb-1 group`}>
      <div className={`flex gap-2 max-w-[75%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar - Only show for first message in group */}
        {isFirstInGroup && (
          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex-shrink-0 mt-1 message-avatar">
            <img
              src={
                isSent
                  ? authUser?.avatar || '/avatar.png'
                  : (typeof message.senderId === 'object' ? message.senderId.avatar : message.senderId?.avatar) || '/avatar.png'
              }
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} relative max-w-full`}>
          {/* Time and Edit Indicator - Only show for last message in group */}
          {isLastInGroup && (
            <div className={`text-xs text-gray-500 dark:text-gray-400 mb-1 ${isSent ? 'text-right' : 'text-left'} flex items-center gap-2 message-time`}>
              {formatMessageTime(message.createdAt)}
              {message.isEdited && (
                <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>
              )}
              {message.isPinned && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                  <Pin className="w-3 h-3" />
                  pinned
                </span>
              )}
              <MessageStatus />
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`relative group/message ${
              isSent
                ? 'message-bubble-sent'
                : 'message-bubble-received'
            } ${message.isPinned ? 'ring-2 ring-yellow-400 dark:ring-yellow-500 shadow-lg' : ''}`}
          >
            {/* Pin Indicator */}
            {message.isPinned && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Pin className="w-2.5 h-2.5 text-white" />
              </div>
            )}

            {/* Image */}
            {message.imageUrl && (
              <div className="mb-2">
                <img
                  src={message.imageUrl}
                  alt="Attachment"
                  className="max-w-full rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                  style={{ maxHeight: '300px' }}
                  loading="lazy"
                  onClick={() => {
                    // TODO: Implement image viewer modal
                    window.open(message.imageUrl, '_blank');
                  }}
                />
              </div>
            )}

            {/* Text Content */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <textarea
                  ref={editInputRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveEdit();
                    }
                    if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-sm resize-none"
                  disabled={isLoading}
                  rows={1}
                />
                <div className="flex gap-1">
                  <button
                    onClick={handleSaveEdit}
                    disabled={isLoading}
                    className="p-1 hover:bg-white/20 rounded transition-colors haptic-feedback touch-target"
                    aria-label="Save edit"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="p-1 hover:bg-white/20 rounded transition-colors haptic-feedback touch-target"
                    aria-label="Cancel edit"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
            )}

            {/* Message Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction, index) => (
                  <div
                    key={index}
                    className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm border border-gray-200 dark:border-gray-700 message-reaction"
                  >
                    <span>{reaction.emoji}</span>
                    <span className="text-gray-600 dark:text-gray-400">{reaction.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Actions - Only show for last message in group */}
          {isLastInGroup && !isEditing && (
            <div className="absolute top-0 right-0 opacity-0 group-hover/message:opacity-100 transition-all duration-200">
              <div className="relative" ref={menuRef}>
                {/* Quick Reactions */}
                <div className="flex items-center gap-1 mb-2">
                  {quickReactions.slice(0, 3).map((reaction, index) => (
                    <button
                      key={index}
                      onClick={() => handleReaction(reaction.reaction)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target text-lg"
                      aria-label={`React with ${reaction.reaction}`}
                    >
                      {reaction.emoji}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowReactions(!showReactions)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target"
                    aria-label="More reactions"
                  >
                    <Smile className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* More Options Button */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 haptic-feedback touch-target ${
                    isSent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                  }`}
                  disabled={isLoading}
                  aria-label="Message options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 message-options-menu">
                    <div className="py-2">
                      {/* Reply Option */}
                      <button
                        onClick={() => {
                          // TODO: Implement reply functionality
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left haptic-feedback transition-colors message-action-button"
                      >
                        <Reply className="w-4 h-4" />
                        Reply
                      </button>

                      {/* Edit Option - Only for sender */}
                      {isSent && (
                        <button
                          onClick={handleEdit}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left haptic-feedback transition-colors message-action-button"
                          disabled={isLoading}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      )}

                      {/* Pin/Unpin Option */}
                      <button
                        onClick={handlePin}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left haptic-feedback transition-colors message-action-button"
                        disabled={isLoading}
                      >
                        <Pin className={`w-4 h-4 ${message.isPinned ? 'text-yellow-500' : ''}`} />
                        {isLoading ? 'Updating...' : (message.isPinned ? 'Unpin' : 'Pin')}
                      </button>

                      {/* Delete Option - Only for sender */}
                      {isSent && (
                        <button
                          onClick={handleDelete}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left haptic-feedback transition-colors message-action-button"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Reactions Menu */}
                {showReactions && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-2">
                    <div className="grid grid-cols-3 gap-2">
                      {quickReactions.map((reaction, index) => (
                        <button
                          key={index}
                          onClick={() => handleReaction(reaction.reaction)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 haptic-feedback touch-target text-xl"
                          aria-label={`React with ${reaction.reaction}`}
                        >
                          {reaction.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message; 