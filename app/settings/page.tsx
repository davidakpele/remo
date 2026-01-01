'use client';

import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Eye,
  Lock,
  Smartphone,
  Mail,
  Globe,
  Moon,
  Sun,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Key,
  LogOut,
  Trash2,
  Download,
  Upload,
  Camera
} from 'lucide-react';
import './Settings.css';

interface UserSettings {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    username: string;
    profileImage: string;
  };
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    sessionTimeout: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    transactionAlerts: boolean;
    loginAlerts: boolean;
    marketingEmails: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    theme: 'light' | 'dark' | 'auto';
    timezone: string;
  };
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      fullName: 'David Akpele',
      email: 'david@example.com',
      phone: '+234 801 234 5678',
      username: 'davidakpele',
      profileImage: '/api/placeholder/120/120'
    },
    security: {
      twoFactorEnabled: true,
      biometricEnabled: false,
      sessionTimeout: 30
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      transactionAlerts: true,
      loginAlerts: true,
      marketingEmails: false
    },
    preferences: {
      language: 'English',
      currency: 'NGN',
      theme: 'light',
      timezone: 'Africa/Lagos'
    }
  });

  const handleToggle = (category: keyof UserSettings, key: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]]
      }
    }));
  };

  const handleSelectChange = (category: keyof UserSettings, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Profile updated successfully!');
    }, 1500);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleExportData = () => {
    console.log('Exporting user data...');
  };

  const handleImageUpload = () => {
    console.log('Upload profile image');
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button 
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
        <button 
          className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={20} />
          <span>Security</span>
        </button>
        <button 
          className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={20} />
          <span>Notifications</span>
        </button>
        <button 
          className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <Globe size={20} />
          <span>Preferences</span>
        </button>
      </div>

      {/* Content */}
      <div className="settings-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="settings-section">
            <div className="settings-section-header">
              <h2>Profile Information</h2>
              <p>Update your personal information and profile picture</p>
            </div>

            <div className="settings-profile-picture">
              <div className="settings-avatar-wrapper">
                <img src={settings.profile.profileImage} alt="Profile" className="settings-avatar" />
                <button className="settings-avatar-upload" onClick={handleImageUpload}>
                  <Camera size={18} />
                </button>
              </div>
              <div>
                <h3>Profile Picture</h3>
                <p className="settings-helper-text">JPG, PNG or GIF. Max size 2MB</p>
                <div className="settings-button-group">
                  <button className="settings-btn-secondary" onClick={handleImageUpload}>
                    <Upload size={16} />
                    Upload
                  </button>
                  <button className="settings-btn-text">Remove</button>
                </div>
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={settings.profile.fullName}
                  onChange={(e) => handleSelectChange('profile', 'fullName', e.target.value)}
                />
              </div>
              <div className="settings-form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={settings.profile.username}
                  onChange={(e) => handleSelectChange('profile', 'username', e.target.value)}
                />
              </div>
              <div className="settings-form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={settings.profile.email}
                  onChange={(e) => handleSelectChange('profile', 'email', e.target.value)}
                />
              </div>
              <div className="settings-form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={settings.profile.phone}
                  onChange={(e) => handleSelectChange('profile', 'phone', e.target.value)}
                />
              </div>
            </div>

            <div className="settings-actions">
              <button className="settings-btn-secondary">Cancel</button>
              <button className="settings-btn-primary" onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <div className="settings-section-header">
              <h2>Security Settings</h2>
              <p>Manage your account security and authentication methods</p>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <Lock size={20} />
                <h3>Password</h3>
              </div>
              <p className="settings-card-desc">Change your password regularly to keep your account secure</p>
              <button className="settings-btn-outline" onClick={handleChangePassword}>
                Change Password
              </button>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <Shield size={20} />
                <h3>Two-Factor Authentication</h3>
              </div>
              <p className="settings-card-desc">Add an extra layer of security to your account</p>
              <div className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-label">Enable 2FA</div>
                  <div className="settings-toggle-desc">Require a code from your phone to login</div>
                </div>
                <label className="settings-toggle">
                  <input 
                    type="checkbox" 
                    checked={settings.security.twoFactorEnabled}
                    onChange={() => handleToggle('security', 'twoFactorEnabled')}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <Smartphone size={20} />
                <h3>Biometric Authentication</h3>
              </div>
              <p className="settings-card-desc">Use fingerprint or face recognition to login</p>
              <div className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-label">Enable Biometric</div>
                  <div className="settings-toggle-desc">Login with Touch ID or Face ID</div>
                </div>
                <label className="settings-toggle">
                  <input 
                    type="checkbox" 
                    checked={settings.security.biometricEnabled}
                    onChange={() => handleToggle('security', 'biometricEnabled')}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <AlertCircle size={20} />
                <h3>Session Timeout</h3>
              </div>
              <p className="settings-card-desc">Automatically log out after period of inactivity</p>
              <select 
                className="settings-select"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSelectChange('security', 'sessionTimeout', e.target.value)}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <div className="settings-section-header">
              <h2>Notification Preferences</h2>
              <p>Choose how you want to receive notifications</p>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <Mail size={20} />
                <h3>Email Notifications</h3>
              </div>
              <div className="settings-toggle-list">
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Email Notifications</div>
                    <div className="settings-toggle-desc">Receive notifications via email</div>
                  </div>
                  <label className="settings-toggle">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.email}
                      onChange={() => handleToggle('notifications', 'email')}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Transaction Alerts</div>
                    <div className="settings-toggle-desc">Get notified about transactions</div>
                  </div>
                  <label className="settings-toggle">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.transactionAlerts}
                      onChange={() => handleToggle('notifications', 'transactionAlerts')}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Login Alerts</div>
                    <div className="settings-toggle-desc">Get notified of new login attempts</div>
                  </div>
                  <label className="settings-toggle">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.loginAlerts}
                      onChange={() => handleToggle('notifications', 'loginAlerts')}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Marketing Emails</div>
                    <div className="settings-toggle-desc">Receive updates and promotional emails</div>
                  </div>
                  <label className="settings-toggle">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.marketingEmails}
                      onChange={() => handleToggle('notifications', 'marketingEmails')}
                    />
                    <span className="settings-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <Bell size={20} />
                <h3>Push Notifications</h3>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-label">Push Notifications</div>
                  <div className="settings-toggle-desc">Receive push notifications on your device</div>
                </div>
                <label className="settings-toggle">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.push}
                    onChange={() => handleToggle('notifications', 'push')}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <Smartphone size={20} />
                <h3>SMS Notifications</h3>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-label">SMS Notifications</div>
                  <div className="settings-toggle-desc">Receive text messages for important updates</div>
                </div>
                <label className="settings-toggle">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.sms}
                    onChange={() => handleToggle('notifications', 'sms')}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="settings-section">
            <div className="settings-section-header">
              <h2>App Preferences</h2>
              <p>Customize your app experience</p>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <Globe size={20} />
                <h3>Language</h3>
              </div>
              <p className="settings-card-desc">Choose your preferred language</p>
              <select 
                className="settings-select"
                value={settings.preferences.language}
                onChange={(e) => handleSelectChange('preferences', 'language', e.target.value)}
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
              </select>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <Globe size={20} />
                <h3>Currency</h3>
              </div>
              <p className="settings-card-desc">Set your default currency</p>
              <select 
                className="settings-select"
                value={settings.preferences.currency}
                onChange={(e) => handleSelectChange('preferences', 'currency', e.target.value)}
              >
                <option value="NGN">Nigerian Naira (NGN)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                {settings.preferences.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                <h3>Theme</h3>
              </div>
              <p className="settings-card-desc">Choose your app appearance</p>
              <div className="settings-theme-grid">
                <label className={`settings-theme-option ${settings.preferences.theme === 'light' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="light"
                    checked={settings.preferences.theme === 'light'}
                    onChange={(e) => handleSelectChange('preferences', 'theme', e.target.value)}
                  />
                  <Sun size={20} />
                  <span>Light</span>
                </label>
                <label className={`settings-theme-option ${settings.preferences.theme === 'dark' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="dark"
                    checked={settings.preferences.theme === 'dark'}
                    onChange={(e) => handleSelectChange('preferences', 'theme', e.target.value)}
                  />
                  <Moon size={20} />
                  <span>Dark</span>
                </label>
                <label className={`settings-theme-option ${settings.preferences.theme === 'auto' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="auto"
                    checked={settings.preferences.theme === 'auto'}
                    onChange={(e) => handleSelectChange('preferences', 'theme', e.target.value)}
                  />
                  <Eye size={20} />
                  <span>Auto</span>
                </label>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <Globe size={20} />
                <h3>Timezone</h3>
              </div>
              <p className="settings-card-desc">Set your timezone</p>
              <select 
                className="settings-select"
                value={settings.preferences.timezone}
                onChange={(e) => handleSelectChange('preferences', 'timezone', e.target.value)}
              >
                <option value="Africa/Lagos">West Africa Time (Lagos)</option>
                <option value="America/New_York">Eastern Time (New York)</option>
                <option value="Europe/London">Greenwich Mean Time (London)</option>
                <option value="Asia/Tokyo">Japan Time (Tokyo)</option>
              </select>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="settings-danger-zone">
          <h3>Danger Zone</h3>
          <div className="settings-danger-actions">
            <div className="settings-danger-item">
              <div>
                <h4>Export Data</h4>
                <p>Download all your account data</p>
              </div>
              <button className="settings-btn-outline" onClick={handleExportData}>
                <Download size={16} />
                Export
              </button>
            </div>
            <div className="settings-danger-item">
              <div>
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all data</p>
              </div>
              <button className="settings-btn-danger" onClick={handleDeleteAccount}>
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <>
          <div className="settings-modal-overlay" onClick={() => setShowDeleteModal(false)} />
          <div className="settings-modal">
            <div className="settings-modal-content">
              <div className="settings-modal-icon danger">
                <AlertCircle size={48} />
              </div>
              <h3>Delete Account</h3>
              <p>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.</p>
              <div className="settings-modal-actions">
                <button className="settings-btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="settings-btn-danger" onClick={() => {
                  console.log('Account deleted');
                  setShowDeleteModal(false);
                }}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <>
          <div className="settings-modal-overlay" onClick={() => setShowPasswordModal(false)} />
          <div className="settings-modal">
            <div className="settings-modal-content">
              <div className="settings-modal-icon primary">
                <Key size={48} />
              </div>
              <h3>Change Password</h3>
              <div className="settings-form-group">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" />
              </div>
              <div className="settings-form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
              <div className="settings-form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>
              <div className="settings-modal-actions">
                <button className="settings-btn-secondary" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button className="settings-btn-primary" onClick={() => {
                  console.log('Password changed');
                  setShowPasswordModal(false);
                }}>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;