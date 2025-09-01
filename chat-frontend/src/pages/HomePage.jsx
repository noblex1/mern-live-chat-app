import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/chat/Sidebar';
import NoChatSelected from '../components/chat/NoChatSelected';
import ChatContainer from '../components/chat/ChatContainer';
import MobileNavigation from '../components/chat/MobileNavigation';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden pb-20">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
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
        <div className="flex w-full h-full bg-white dark:bg-gray-800 transition-colors duration-300">
          {/* Desktop Sidebar */}
          <Sidebar />
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;