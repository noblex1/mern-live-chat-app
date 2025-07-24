import { MessageSquare } from 'lucide-react';

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-16 bg-gray-50/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-gray-900">Welcome to HackChat</h3>
          <p className="text-gray-600">
            Select a conversation from the sidebar to start messaging
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-75" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;