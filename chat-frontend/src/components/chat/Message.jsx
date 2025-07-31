import { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Pin, MoreVertical, Check, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const Message = ({ message, onMessageUpdate, onMessageDelete, onMessagePin }) => {
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

  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-xs lg:max-w-md ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
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

        {/* Message Content */}
        <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} relative group`}>
          {/* Time and Edit Indicator */}
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
          </div>

          {/* Message Bubble */}
          <div
            className={`rounded-2xl px-4 py-2 text-sm shadow max-w-xs lg:max-w-md break-words relative ${
              isSent
                ? 'bg-blue-600 text-white rounded-br-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
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
                  className="max-w-full rounded-lg object-cover"
                  style={{ maxHeight: '200px' }}
                  loading="lazy"
                />
              </div>
            )}

            {/* Text Content */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  ref={editInputRef}
                  type="text"
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
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  disabled={isLoading}
                />
                <div className="flex gap-1">
                  <button
                    onClick={handleSaveEdit}
                    disabled={isLoading}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            )}
          </div>

          {/* Message Actions Menu */}
          {!isEditing && (
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    isSent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                  }`}
                  disabled={isLoading}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      {/* Edit Option - Only for sender */}
                      {isSent && (
                        <button
                          onClick={handleEdit}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                          disabled={isLoading}
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      )}

                      {/* Pin/Unpin Option */}
                      <button
                        onClick={handlePin}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        disabled={isLoading}
                      >
                        <Pin className={`w-3 h-3 ${message.isPinned ? 'text-yellow-500' : ''}`} />
                        {isLoading ? 'Updating...' : (message.isPinned ? 'Unpin' : 'Pin')}
                      </button>

                      {/* Delete Option - Only for sender */}
                      {isSent && (
                        <button
                          onClick={handleDelete}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
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