import { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Pin, MoreVertical, Check, X, Clock, CheckCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const Message = ({ message, onMessageUpdate, onMessageDelete, onMessagePin, isFirstInGroup = false, isLastInGroup = false }) => {
  const { authUser } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || '');
  const [isLoading, setIsLoading] = useState(false);
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

  // Message status component
  const MessageStatus = () => {
    if (!isSent) return null;
    
    return (
      <div className="flex items-center gap-1 ml-2">
        {message.isRead ? (
          <CheckCheck className="w-3 h-3 text-blue-100" />
        ) : message.isDelivered ? (
          <CheckCheck className="w-3 h-3 text-gray-400" />
        ) : (
          <Clock className="w-3 h-3 text-gray-400" />
        )}
      </div>
    );
  };

  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`flex gap-2 max-w-[85%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar - Only show for first message in group */}
        {isFirstInGroup && (
          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden flex-shrink-0">
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
        <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} relative group max-w-full`}>
          {/* Time and Edit Indicator - Only show for last message in group */}
          {isLastInGroup && (
            <div className={`text-xs text-gray-500 dark:text-gray-400 mb-1 ${isSent ? 'text-right' : 'text-left'} flex items-center gap-1`}>
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
            className={`message-bubble px-4 py-2.5 text-sm shadow-sm relative ${
              isSent
                ? 'message-bubble-sent'
                : 'message-bubble-received'
            } ${message.isPinned ? 'ring-2 ring-yellow-400 dark:ring-yellow-500 shadow-lg' : ''}`}
          >
            {/* Pin Indicator */}
            {message.isPinned && (
              <div className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Pin className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Image */}
            {message.imageUrl && (
              <div className="mb-2">
                <img
                  src={message.imageUrl}
                  alt="Attachment"
                  className="max-w-full rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ maxHeight: '200px' }}
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
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="p-1 hover:bg-white/20 rounded transition-colors haptic-feedback touch-target"
                    aria-label="Cancel edit"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
            )}
          </div>

          {/* Message Actions Menu - Only show for last message in group */}
          {isLastInGroup && !isEditing && (
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative" ref={menuRef}>
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
                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 mobile-shadow-lg">
                    <div className="py-1">
                      {/* Edit Option - Only for sender */}
                      {isSent && (
                        <button
                          onClick={handleEdit}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left haptic-feedback transition-colors"
                          disabled={isLoading}
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      )}

                      {/* Pin/Unpin Option */}
                      <button
                        onClick={handlePin}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left haptic-feedback transition-colors"
                        disabled={isLoading}
                      >
                        <Pin className={`w-3 h-3 ${message.isPinned ? 'text-yellow-500' : ''}`} />
                        {isLoading ? 'Updating...' : (message.isPinned ? 'Unpin' : 'Pin')}
                      </button>

                      {/* Delete Option - Only for sender */}
                      {isSent && (
                        <button
                          onClick={handleDelete}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left haptic-feedback transition-colors"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      )}
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