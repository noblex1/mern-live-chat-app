import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/chat/Sidebar';
import NoChatSelected from '../components/chat/NoChatSelected';
import ChatContainer from '../components/chat/ChatContainer';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 pt-16">
      <div className="h-full">
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