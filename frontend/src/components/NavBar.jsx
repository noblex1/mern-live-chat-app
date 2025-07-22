import { MessageCircleCodeIcon, Settings } from "lucide-react";
import React from "react";

function NavBar({ authUser }) {
  return (
    <div className="p-6 w-full">
      <div className="max-w-4xl mx-auto flex justify-between">
       
        {/** Left container  */}
        <div className="flex items-center space-x-2">
          <MessageCircleCodeIcon />
          <h2>HackChat</h2>
        </div>

        {/** Right container  */}
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 rounded bg-blue-700 flex items-center space-x-1">
            <Settings className="size-5" />
            <span>Settings</span>
            </button>

          {authUser && (
            <div className="space-x-2">
              <button className="px-4 py-2 rounded bg-blue-700">

                Profile
              </button>
              <button className="px-4 py-2 rounded bg-blue-700">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;