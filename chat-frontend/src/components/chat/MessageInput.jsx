import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Send, Smile, Paperclip, Mic, Image, File, Camera, Video, X } from 'lucide-react';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);
  const recordingIntervalRef = useRef(null);
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

  // Close emoji picker and attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (!event.target.closest('.attachment-menu') && !event.target.closest('button[aria-label="Attach file"]')) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setUploadProgress(100);
      setIsUploading(false);
      clearInterval(progressInterval);
      toast.success('Image ready to send!');
    };
    reader.onerror = () => {
      toast.error('Failed to load image');
      setIsUploading(false);
      clearInterval(progressInterval);
    };
    reader.readAsDataURL(file);
    
    // Store the file for upload
    setSelectedFile(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Image removed');
  };

  const handleEmojiClick = (emojiObject) => {
    setText(prevText => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
    // Focus back to textarea after emoji selection
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachmentMenu(false);
    if (!showEmojiPicker) {
      // Close keyboard on mobile when opening emoji picker
      textareaRef.current?.blur();
    }
  };

  const toggleAttachmentMenu = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
    setShowEmojiPicker(false);
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
      setUploadProgress(0);
      setShowEmojiPicker(false);
      setShowAttachmentMenu(false);
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
    if (!isRecording) {
      setIsRecording(true);
      toast.success('Recording started...');
    } else {
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const event = { target: { files: [imageFile] } };
      handleImageChange(event);
      toast.success('Image dropped successfully!');
    } else {
      toast.error('Please drop an image file');
    }
  };

  return (
    <div 
      className={`mobile-footer message-input-mobile ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Over Indicator */}
      {isDragOver && (
        <div className="fixed inset-0 bg-blue-500/20 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border-2 border-blue-500 animate-in scale-in duration-200">
            <div className="text-center">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Drop Image Here</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Release to upload your image</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Image Preview */}
      {imagePreview && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-gray-300 dark:border-gray-600 shadow-lg"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 haptic-feedback touch-target active:scale-95 shadow-lg"
                aria-label="Remove image"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                {isUploading ? 'Uploading image...' : 'Image ready to send'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedFile && `${selectedFile.name} (${formatFileSize(selectedFile.size)})`}
              </p>
              {isUploading && (
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="p-4 border-t border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">Recording...</p>
              <p className="text-xs text-red-500 dark:text-red-400">{formatRecordingTime(recordingTime)}</p>
            </div>
            <button
              onClick={handleVoiceRecord}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="input-container">
        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Enhanced Attachment Button */}
        <div className="relative">
          <button
            type="button"
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all duration-200 haptic-feedback touch-target flex-shrink-0 active:scale-95"
            onClick={toggleAttachmentMenu}
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Enhanced Attachment Menu */}
          {showAttachmentMenu && (
            <div className="attachment-menu absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 min-w-[240px] sm:min-w-[280px] p-3 animate-in slide-in-from-bottom-2 duration-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 touch-target"
                  aria-label="Upload photo from gallery"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Image className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Use camera capture
                    const cameraInput = document.createElement('input');
                    cameraInput.type = 'file';
                    cameraInput.accept = 'image/*';
                    cameraInput.capture = 'environment';
                    cameraInput.onchange = (e) => {
                      handleImageChange(e);
                      setShowAttachmentMenu(false);
                    };
                    cameraInput.click();
                  }}
                  className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 touch-target"
                  aria-label="Take photo with camera"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Camera className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.info('Video sharing coming soon!');
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 touch-target"
                  aria-label="Share video"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.info('File sharing coming soon!');
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 touch-target"
                  aria-label="Share file"
                >
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                    <File className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">File</span>
                </button>
              </div>
              
              {/* Enhanced drag and drop hint */}
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>📁 Drag & drop images here or tap to select</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Text Input Container */}
        <div className="flex-1 relative min-w-0">
          <textarea
            ref={textareaRef}
            className="input-textarea"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isSending}
          />
          
          {/* Enhanced Emoji Button */}
          <button
            type="button"
            className="absolute right-3 bottom-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 haptic-feedback touch-target flex-shrink-0 active:scale-95"
            aria-label="Add emoji"
            onClick={toggleEmojiPicker}
          >
            <Smile className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Enhanced Responsive Emoji Picker */}
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute bottom-full right-0 mb-2 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-xl animate-in slide-in-from-bottom-2 duration-200"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={window.innerWidth < 640 ? Math.min(300, window.innerWidth - 32) : 350}
                height={window.innerWidth < 640 ? 320 : 400}
                searchDisabled={false}
                skinTonesDisabled={true}
                lazyLoadEmojis={true}
                theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                searchPlaceholder="Search emoji..."
                previewConfig={{
                  showPreview: false
                }}
              />
            </div>
          )}
        </div>

        {/* Enhanced Send/Voice Button */}
        {text.trim() || selectedFile ? (
          <button
            type="submit"
            className={`chat-send-button active:scale-95 ${isSending ? 'opacity-50' : ''}`}
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
            className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl flex items-center justify-center transition-all duration-200 haptic-feedback touch-target active:scale-95 shadow-lg"
            onClick={handleVoiceRecord}
            aria-label="Voice message"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput;