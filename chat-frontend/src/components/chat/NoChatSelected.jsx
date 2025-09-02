import { MessageCircle, Search, Users, Sparkles, ArrowRight, Phone, Video, Shield } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useEffect } from 'react';

const NoChatSelected = () => {
  const { setSidebarOpen, setSearchTerm, getConversations } = useChatStore();

  const handleSearchUsers = () => {
    try {
      // Open sidebar and focus on search
      setSidebarOpen(true);
      
      // Small delay to ensure sidebar is open before focusing search
      setTimeout(() => {
        setSearchTerm('');
        
        // Try multiple selectors for better reliability
        const searchInput = document.getElementById('sidebar-search-input') || 
                           document.querySelector('input[data-testid="sidebar-search-input"]') ||
                           document.querySelector('input[placeholder*="Search"]');
        
        if (searchInput) {
          searchInput.focus();
        } else {
          // Retry after a longer delay
          setTimeout(() => {
            const retrySearchInput = document.getElementById('sidebar-search-input') || 
                                   document.querySelector('input[data-testid="sidebar-search-input"]') ||
                                   document.querySelector('input[placeholder*="Search"]');
            if (retrySearchInput) {
              retrySearchInput.focus();
            }
          }, 300);
        }
      }, 200);
    } catch (error) {
      console.error('Error in handleSearchUsers:', error);
    }
  };

  const handleRecentChats = () => {
    try {
      // Open sidebar and show recent chats
      setSidebarOpen(true);
      setSearchTerm('');
      
      // Load conversations to ensure they're available
      setTimeout(() => {
        getConversations();
      }, 100);
    } catch (error) {
      console.error('Error in handleRecentChats:', error);
    }
  };

  // Load conversations on component mount
  useEffect(() => {
    getConversations();
  }, [getConversations]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile Layout - Enhanced to match the image */}
      <div className="lg:hidden w-full px-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Enhanced Icon Container */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          
          {/* Enhanced Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome to MeebaChat
          </h2>
          
          {/* Enhanced Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-base leading-relaxed">
            Connect with friends and family with secure, real-time messaging
          </p>
          
          {/* Enhanced Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleSearchUsers}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl p-4 flex items-center gap-4 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              aria-label="Search for users to chat with"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="text-base font-semibold">Search Users</p>
                <p className="text-sm opacity-90">Find people to chat with</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleRecentChats}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl p-4 flex items-center gap-4 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              aria-label="View recent conversations"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="text-base font-semibold">Recent Chats</p>
                <p className="text-sm opacity-90">Continue conversations</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Enhanced Features */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Voice Calls</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Video className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Video Calls</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Enhanced */}
      <div className="hidden lg:block max-w-2xl mx-auto px-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700">
          {/* Enhanced Icon Container */}
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <MessageCircle className="w-16 h-16 text-white" />
          </div>
          
          {/* Enhanced Title */}
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to MeebaChat
          </h2>
          
          {/* Enhanced Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            Select a conversation from the sidebar to start messaging, or search for new users to connect with. 
            Enjoy secure, real-time communication with voice and video calls.
          </p>
          
          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Voice Calls</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Crystal clear audio</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Video className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Video Calls</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Face-to-face chats</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Secure</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end encryption</p>
            </div>
          </div>
          
          {/* Enhanced Search Hint */}
          <div className="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <Search className="w-5 h-5" />
            <span className="text-sm">Search for users to start a conversation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;