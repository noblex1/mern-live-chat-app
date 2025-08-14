import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);
  const { sendMessage, startTyping, stopTyping } = useChatStore();

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max 5 lines
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Typing indicator
  useEffect(() => {
    let typingTimeout;
    
    if (text.trim()) {
      startTyping();
      typingTimeout = setTimeout(() => {
        stopTyping();
      }, 1000);
    } else {
      stopTyping();
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [text, startTyping, stopTyping]);

  // Adjust textarea height when text changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Store the file for upload
      setSelectedFile(file);
    } else {
      toast.error('Please select an image file');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEmojiClick = (emojiObject) => {
    setText(prevText => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
    // Focus back to textarea after emoji selection
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (!showEmojiPicker) {
      // Close keyboard on mobile when opening emoji picker
      textareaRef.current?.blur();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !selectedFile) return;
    if (isSending) return;

    setIsSending(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('text', text.trim());
      formData.append('receiverId', useChatStore.getState().selectedUser._id);
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await sendMessage(formData);

      // Clear form
      setText('');
      setImagePreview(null);
      setSelectedFile(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px';
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleVoiceRecord = () => {
    // TODO: Implement voice recording
    toast.info('Voice recording coming soon!');
  };

  return (
    <div className="mobile-footer">
      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors haptic-feedback touch-target"
                aria-label="Remove image"
              >
                <span className="text-white text-xs">×</span>
              </button>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Image ready to send</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chat-input-container">
        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Attachment Button */}
        <button
          type="button"
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach image"
        >
          <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Text Input Container */}
        <div className="flex-1 relative min-w-0">
          <textarea
            ref={textareaRef}
            className="chat-input-textarea"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isSending}
          />
          
          {/* Emoji Button */}
          <button
            type="button"
            className="absolute right-3 bottom-3 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 haptic-feedback touch-target flex-shrink-0"
            aria-label="Add emoji"
            onClick={toggleEmojiPicker}
          >
            <Smile className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute bottom-full right-0 mb-2 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg mobile-shadow-lg"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={280}
                height={350}
                searchDisabled={false}
                skinTonesDisabled={true}
                lazyLoadEmojis={true}
                theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                searchPlaceholder="Search emoji..."
              />
            </div>
          )}
        </div>

        {/* Send/Voice Button */}
        {text.trim() || selectedFile ? (
          <button
            type="submit"
            className={`chat-send-button ${isSending ? 'opacity-50' : ''}`}
            disabled={(!text.trim() && !selectedFile) || isSending}
            aria-label="Send message"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        ) : (
          <button
            type="button"
            className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center transition-all duration-200 haptic-feedback touch-target"
            onClick={handleVoiceRecord}
            aria-label="Voice message"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput;