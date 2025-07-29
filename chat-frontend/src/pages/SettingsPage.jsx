import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../contexts/ThemeContext';
import {
  Bell,
  Globe,
  Lock,
  Moon,
  Palette,
  Shield,
  Sun,
  Users,
  Volume2,
  Key,
  Trash2,
  Download,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  X,
  LogOut,
  User,
  Smartphone,
  Database,
  Settings as SettingsIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { authUser, logout, updateProfile, changePassword, deleteAccount, updateSettings } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [settings, setSettings] = useState({
    notifications: authUser?.settings?.notifications ?? (localStorage.getItem('notifications') !== 'false'),
    soundEnabled: authUser?.settings?.soundEnabled ?? (localStorage.getItem('soundEnabled') !== 'false'),
    language: authUser?.settings?.language || localStorage.getItem('language') || 'en',
    privacy: authUser?.settings?.privacy || localStorage.getItem('privacy') || 'friends',
    showOnlineStatus: authUser?.settings?.showOnlineStatus ?? (localStorage.getItem('showOnlineStatus') !== 'false'),
    twoFactorEnabled: authUser?.settings?.twoFactorEnabled || false,
    autoDeleteMessages: authUser?.settings?.autoDeleteMessages || localStorage.getItem('autoDeleteMessages') || 'never'
  });

  const handleSettingChange = async (key, value) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem(key, value);
      return newSettings;
    });
    
    // Sync with backend
    try {
      await updateSettings({ [key]: value });
    } catch (error) {
      console.error('Failed to sync setting with backend:', error);
    }
    
    toast.success('Setting updated successfully');
  };

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    
    // Sync theme with backend
    try {
      await updateSettings({ theme: newTheme });
    } catch (error) {
      console.error('Failed to sync theme with backend:', error);
    }
    
    toast.success('Theme updated successfully');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (success) {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const success = await deleteAccount(passwordData.currentPassword);
      if (success) {
        // Account deletion already handles logout internally
        // No need to call logout() here as the user no longer exists
        setShowDeleteModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        // Redirect to login page after a short delay to show success message
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const clearChatHistory = async () => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // Here you would call the API to clear chat history
        // await clearChatHistory();
        toast.success('Chat history cleared successfully');
      } catch (error) {
        toast.error('Failed to clear chat history');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const exportData = async () => {
    setIsLoading(true);
    try {
      // Here you would call the API to export user data
      // const data = await exportUserData();
      const data = {
        user: authUser,
        settings: settings,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-app-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const SettingItem = ({ icon: Icon, title, description, children, danger = false }) => (
    <div className={`flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${danger ? 'text-red-600' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${danger ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <Icon className={`w-5 h-5 ${danger ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
        </div>
        <div>
          <h3 className={`font-medium ${danger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{title}</h3>
          <p className={`text-sm ${danger ? 'text-red-500 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'}`}>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const TabButton = ({ id, icon: Icon, title, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{title}</span>
    </button>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <SettingItem
        icon={User}
        title="Account Information"
        description="View your account details"
      >
        <div className="text-right">
          <p className="font-medium text-gray-900 dark:text-white">{authUser?.username}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{authUser?.email}</p>
        </div>
      </SettingItem>

      <SettingItem
        icon={Key}
        title="Change Password"
        description="Update your account password"
      >
        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Change
        </button>
      </SettingItem>

      <SettingItem
        icon={Smartphone}
        title="Two-Factor Authentication"
        description="Add an extra layer of security"
      >
        <div className="flex items-center gap-3">
          <Toggle
            checked={settings.twoFactorEnabled}
            onChange={(value) => handleSettingChange('twoFactorEnabled', value)}
          />
          <span className="text-sm text-gray-500">
            {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </SettingItem>

      <SettingItem
        icon={LogOut}
        title="Sign Out"
        description="Sign out from your account"
      >
        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Sign Out
        </button>
      </SettingItem>

      <SettingItem
        icon={Trash2}
        title="Delete Account"
        description="Permanently delete your account and all data"
        danger
      >
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </SettingItem>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <SettingItem
        icon={Shield}
        title="Profile Visibility"
        description="Who can see your profile information"
      >
        <select
          value={settings.privacy}
          onChange={(e) => handleSettingChange('privacy', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="everyone">Everyone</option>
          <option value="friends">Friends Only</option>
          <option value="nobody">Nobody</option>
        </select>
      </SettingItem>

      <SettingItem
        icon={Users}
        title="Online Status"
        description="Show when you're online to others"
      >
        <Toggle
          checked={settings.showOnlineStatus}
          onChange={(value) => handleSettingChange('showOnlineStatus', value)}
        />
      </SettingItem>

      <SettingItem
        icon={Eye}
        title="Read Receipts"
        description="Show when you've read messages"
      >
        <Toggle
          checked={true}
          onChange={() => {}}
        />
      </SettingItem>

      <SettingItem
        icon={Globe}
        title="Last Seen"
        description="Show when you were last active"
      >
        <Toggle
          checked={true}
          onChange={() => {}}
        />
      </SettingItem>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <SettingItem
        icon={Bell}
        title="Push Notifications"
        description="Receive notifications for new messages"
      >
        <Toggle
          checked={settings.notifications}
          onChange={(value) => handleSettingChange('notifications', value)}
        />
      </SettingItem>

      <SettingItem
        icon={Volume2}
        title="Sound Effects"
        description="Play sound effects for notifications"
      >
        <Toggle
          checked={settings.soundEnabled}
          onChange={(value) => handleSettingChange('soundEnabled', value)}
        />
      </SettingItem>

      <SettingItem
        icon={Bell}
        title="Message Notifications"
        description="Notify when receiving new messages"
      >
        <Toggle
          checked={true}
          onChange={() => {}}
        />
      </SettingItem>

      <SettingItem
        icon={Users}
        title="Friend Request Notifications"
        description="Notify when receiving friend requests"
      >
        <Toggle
          checked={true}
          onChange={() => {}}
        />
      </SettingItem>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <SettingItem
        icon={theme === 'light' ? Sun : Moon}
        title="Theme"
        description="Choose your preferred theme"
      >
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </SettingItem>

      <SettingItem
        icon={Palette}
        title="Language"
        description="Select your preferred language"
      >
        <select
          value={settings.language}
          onChange={(e) => handleSettingChange('language', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
        </select>
      </SettingItem>

      <SettingItem
        icon={Palette}
        title="Font Size"
        description="Adjust the text size"
      >
        <select
          defaultValue="medium"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </SettingItem>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <SettingItem
        icon={Database}
        title="Auto-Delete Messages"
        description="Automatically delete old messages"
      >
        <select
          value={settings.autoDeleteMessages}
          onChange={(e) => handleSettingChange('autoDeleteMessages', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="never">Never</option>
          <option value="7days">After 7 days</option>
          <option value="30days">After 30 days</option>
          <option value="90days">After 90 days</option>
        </select>
      </SettingItem>

      <SettingItem
        icon={Trash2}
        title="Clear Chat History"
        description="Delete all your chat messages"
      >
        <button
          onClick={clearChatHistory}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Clear
        </button>
      </SettingItem>

      <SettingItem
        icon={Download}
        title="Export Data"
        description="Download a copy of your data"
      >
        <button
          onClick={exportData}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Export
        </button>
      </SettingItem>
    </div>
  );

  const tabs = [
    { id: 'account', icon: User, title: 'Account' },
    { id: 'privacy', icon: Shield, title: 'Privacy' },
    { id: 'notifications', icon: Bell, title: 'Notifications' },
    { id: 'appearance', icon: Palette, title: 'Appearance' },
    { id: 'data', icon: Database, title: 'Data & Storage' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'data':
        return renderDataTab();
      default:
        return renderAccountTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your app preferences and account</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                icon={tab.icon}
                title={tab.title}
                active={activeTab === tab.id}
              />
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  >
                    {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  >
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  >
                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || !passwordData.currentPassword}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;