import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/chat/Sidebar';
import NoChatSelected from '../components/chat/NoChatSelected';
import ChatContainer from '../components/chat/ChatContainer';
import MobileNavigation from '../components/chat/MobileNavigation';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="mobile-container">
      {/* Mobile Layout - Enhanced */}
      <div className="lg:hidden h-full flex flex-col">
        {selectedUser ? (
          <ChatContainer />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Mobile: Show NoChatSelected when no user is selected */}
            <NoChatSelected />
          </div>
        )}
        
        {/* Mobile Sidebar - Always render for drawer functionality */}
        <Sidebar />
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>

      {/* Desktop Layout - Unchanged */}
      <div className="hidden lg:block h-full">
        <div className="bg-white dark:bg-gray-800 h-full transition-colors duration-300">
          <div className="flex h-full overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;