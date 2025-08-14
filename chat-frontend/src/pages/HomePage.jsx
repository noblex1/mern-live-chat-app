import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/chat/Sidebar';
import NoChatSelected from '../components/chat/NoChatSelected';
import ChatContainer from '../components/chat/ChatContainer';
import MobileNavigation from '../components/chat/MobileNavigation';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="mobile-container">
      {/* Enhanced Mobile Layout */}
      <div className="chat-layout-mobile">
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
        
        {/* Enhanced Mobile Navigation */}
        <MobileNavigation />
      </div>

      {/* Enhanced Desktop Layout */}
      <div className="chat-layout-desktop">
        <div className="bg-white dark:bg-gray-800 h-full transition-colors duration-300">
          <div className="chat-layout">
            <Sidebar />
            <div className="chat-main-content">
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;