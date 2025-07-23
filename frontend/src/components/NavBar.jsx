import { MessageCircleCodeIcon, Settings } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuthHook from "../hooks/useAuthhook.jsx"; // adjust path if needed

function NavBar({ authUser }) {
  const { logout } = useAuthHook(); // Get logout method
  const navigate = useNavigate(); // Router navigation

  // Handle logout
  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      toast.success(res.message);
      navigate("/signin");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="max-w-4xl mx-auto flex justify-between">
        {/* Left container */}
        <div className="flex items-center space-x-2">
          <MessageCircleCodeIcon />
          <h2>HackChat</h2>
        </div>

        {/* Right container */}
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
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-700 hover:bg-red-800"
              >
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
