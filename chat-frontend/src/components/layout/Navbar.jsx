import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { Settings, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useChatStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-target"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img 
                src="/MeebaChat logo.png" 
                alt="MeebaChat Logo" 
                className="w-9 h-9 object-contain"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">MeebaChat</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop User Menu */}
            <div className="hidden md:block relative group">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <img
                  src={authUser?.avatar || '/avatar.png'}
                  alt={authUser?.username || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {authUser?.username || 'User'}
                </span>
              </button>

              {/* Desktop Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile User Menu Button */}
            <div className="md:hidden relative">
              <button
                onClick={toggleMobileMenu}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-target"
                aria-label="User menu"
              >
                <img
                  src={authUser?.avatar || '/avatar.png'}
                  alt={authUser?.username || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {/* Mobile Dropdown Menu */}
              {showMobileMenu && (
                <>
                  {/* Overlay */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={closeMobileMenu}
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {authUser?.username || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {authUser?.email || 'user@example.com'}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left touch-target"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;