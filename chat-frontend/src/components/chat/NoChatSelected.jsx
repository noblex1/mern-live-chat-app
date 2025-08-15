import { MessageCircle, Search, Users, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center h-full text-center">
      {/* Mobile Layout - Enhanced to match the image */}
      <div className="welcome-screen-mobile">
        <div className="welcome-card-mobile">
          {/* Enhanced Icon Container */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MessageCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          
          {/* Enhanced Title */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to MeebaChat
          </h2>
          
          {/* Enhanced Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            Start a conversation by searching for users or browse your recent chats
          </p>
          
          {/* Enhanced Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSearchUsers}
              className="action-button-mobile bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-100 dark:border-green-800/20 hover:shadow-sm"
              aria-label="Search for users to chat with"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Search className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Search Users</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Find people to chat with</p>
              </div>
              <Sparkles className="w-4 h-4 text-green-500 opacity-60" />
            </button>
            
            <button
              onClick={handleRecentChats}
              className="action-button-mobile bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-purple-100 dark:border-purple-800/20 hover:shadow-sm"
              aria-label="View recent conversations"
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Recent Chats</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Continue conversations</p>
              </div>
              <Sparkles className="w-4 h-4 text-purple-500 opacity-60" />
            </button>
          </div>
          
          {/* Enhanced Bottom Instruction */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Tap the menu button to get started</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Enhanced */}
      <div className="welcome-screen-desktop">
        <div className="welcome-card-desktop">
          {/* Enhanced Icon Container */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <MessageCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          
          {/* Enhanced Title */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to MeebaChat
          </h2>
          
          {/* Enhanced Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-center">
            Select a conversation from the sidebar to start messaging, or search for new users to connect with.
          </p>
          
          {/* Enhanced Search Hint */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Search className="w-4 h-4" />
            <span>Search for users to start a conversation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;