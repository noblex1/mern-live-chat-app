import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/chat/Sidebar';
import NoChatSelected from '../components/chat/NoChatSelected';
import ChatContainer from '../components/chat/ChatContainer';
import MobileNavigation from '../components/chat/MobileNavigation';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 pt-16">
      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 pb-20">
          {selectedUser ? (
            <ChatContainer />
          ) : (
            <NoChatSelected />
          )}
        </div>
        
        {/* Mobile Sidebar - Drawer */}
        <Sidebar />
        
        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <div className="flex w-full h-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl transition-all duration-300">
          {/* Desktop Sidebar */}
          <Sidebar />
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-800 rounded-r-2xl overflow-hidden">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;