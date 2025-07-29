import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Image, Send, Smile, X } from 'lucide-react';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage, startTyping, stopTyping } = useChatStore();

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
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !selectedFile) return;

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
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-2 sm:p-4 bg-white dark:bg-gray-800 flex-shrink-0">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-1 sm:gap-2">
        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Image Button */}
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Text Input Container */}
        <div className="flex-1 relative min-w-0">
          <input
            type="text"
            className="input pr-10 sm:pr-12 text-sm sm:text-base"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Emoji Button - Responsive positioning and sizing */}
          <button
            type="button"
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0 min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
            aria-label="Add emoji"
            onClick={toggleEmojiPicker}
          >
            <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute bottom-full right-0 mb-2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg"
              style={{
                width: '300px',
                height: '400px'
              }}
            >
              <div className="p-2 border-b border-gray-200">
                <span className="text-sm font-medium">Emoji Picker</span>
              </div>
              <div className="p-2">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={280}
                  height={350}
                  searchDisabled={false}
                  skinTonesDisabled={true}
                  lazyLoadEmojis={true}
                  theme="light"
                  searchPlaceholder="Search emoji..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-primary p-1.5 sm:p-2 flex-shrink-0 min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
          disabled={!text.trim() && !selectedFile}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;