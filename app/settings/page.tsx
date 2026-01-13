'use client';

import React, { useState, useEffect, useRef} from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Lock,
  Smartphone,
  Mail,
  Globe,
  AlertCircle,
  Key,
  Trash2,
  Download,
  Upload,
  Camera
} from 'lucide-react';
import './Settings.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import Image from 'next/image';
import DepositModal from '@/components/DepositModal';
import { UserSettings } from '../types/utils';
import LoadingScreen from '@/components/loader/Loadingscreen';
import { getToken, getUserId, getUserIsSetTransfer, getUsername, getUserWalletId, updateProfileImageInStorage, userService, walletService } from '../api';
import { Toast } from '@/app/types/auth';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences' | 'pin'>('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRemoveImageModal, setShowRemoveImageModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [userHasPin, setUserHasPin] = useState(false);
  const [pinMode, setPinMode] = useState('create');
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [profileImage, setProfileImage] = useState('/assets/images/user-profile.jpg');
  const [hasCustomImage, setHasCustomImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      document.title = 'Settings - ePay Online Business Banking';
      const loadingTimer = setTimeout(() => {
        setIsPageLoading(false);
      }, 2000);
  
      return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    checkPinStatus();
  }, []);

 useEffect(() => {
  const loadProfileImageFromStorage = () => {
    try {
      const storedData = localStorage.getItem('data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const userPhoto = parsedData?.user?.photo;
        
        if (userPhoto && userPhoto !== '/assets/images/user-profile.jpg') {
          setProfileImage(userPhoto);
          setHasCustomImage(true);
        } else {
          setProfileImage('/assets/images/user-profile.jpg');
          setHasCustomImage(false);
        }
      }
    } catch (error) {
      console.error('Error loading profile image from storage:', error);
      setProfileImage('/assets/images/user-profile.jpg');
      setHasCustomImage(false);
    }
  };

  loadProfileImageFromStorage();
}, []);

  const checkPinStatus = () => {
    const hasPin = getUserIsSetTransfer();
    setUserHasPin(!!hasPin);
    if (hasPin) {
      setPinMode('update');
    } else {
      setPinMode('create');
    }
  };

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

  const showToast = (msg: string, type: 'warning' | 'success' = 'warning') => {
    setToasts((prev) => {
      if (prev.length >= 5) return prev;

      const id = Date.now();
      const newToast: Toast = { id, message: msg, type, exiting: false };

      setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );

        setTimeout(() => {
          setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
        }, 300);
      }, 3000);

      return [...prev, newToast];
    });
  };

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleExportData = () => {
    showToast('Exporting user data...');
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const API_BASE_URL = 'http://localhost:8000/api/auth';
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      showToast('Image size must be less than 2MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Revoke previous blob URL if exists
      if (profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(profileImage);
      }

      // Create new preview URL for immediate feedback
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);

      const formData = new FormData();
      formData.append('image', file);
      const id = getUserId();

      const response = await fetch(`/api/user/upload-profile-image/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);
      
      // Check for success using 'status' field as per your API response
      if (data.status === 'success' && data.imageUrl) {
        // Construct the full image URL
        // API returns: "/image/1001.jpg"
        // We need: "http://localhost:8000/api/auth/image/1001.jpg"
        const fullImageUrl = `${API_BASE_URL}${data.imageUrl}`;
        
        // Revoke the blob URL since we have the real URL now
        URL.revokeObjectURL(previewUrl);
        
        // Update the profile image URL
        setProfileImage(fullImageUrl);
        
        // Update the image URL in storage
        updateProfileImageInStorage(fullImageUrl);
        
        setHasCustomImage(true);
        showToast('Profile image updated successfully', 'success');
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Failed to upload image. Please try again.');
      
      // Revert to default image on error
      setProfileImage('/assets/images/user-profile.jpg');
      setHasCustomImage(false);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (!hasCustomImage) {
      showToast('No custom profile image to remove');
      return;
    }
    setShowRemoveImageModal(true);
  };

  const confirmRemoveImage = async () => {
    setShowRemoveImageModal(false);
    setIsUploadingImage(true);

    try {
      const userId = getUserId();
      
      // Call your API to remove the image
      const response = await fetch(`/api/user/remove-profile-image/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          userId: userId,
          username: getUsername(),
        }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Revoke the object URL if it exists to prevent memory leaks
        if (profileImage.startsWith('blob:')) {
          URL.revokeObjectURL(profileImage);
        }

        // Reset to default image
        const defaultImage = '/assets/images/user-profile.jpg';
        setProfileImage(defaultImage);
        
        // Update storage with default image
        updateProfileImageInStorage(defaultImage);
        
        setHasCustomImage(false);
        showToast('Profile image removed successfully', 'success');
      } else {
        throw new Error(data.message || 'Remove failed');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      showToast('Failed to remove image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePinInput = (index: number, value: string, isConfirm: boolean = false) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    if (isConfirm) {
      const newConfirmPin = [...confirmPin];
      newConfirmPin[index] = value;
      setConfirmPin(newConfirmPin);
    } else {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
    }
  };

  const handleSetPin = async () => {
    const pinValue = pin.join('');
    const confirmPinValue = confirmPin.join('');
    if (pinValue.length !== 4) {
      showToast('Please enter a 4-digit PIN');
      return;
    }

    if (pinValue !== confirmPinValue) {
      showToast('PINs do not match. Please try again.');
      return;
    }
    const payload = {
      userId: getUserId(), 
      walletId: getUserWalletId(), 
      username: getUsername(), 
      transferPin: pinValue
    };
   
    const response = await walletService.createTransferPin(payload);
    if (response?.status === "success") {
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      showToast('PIN Created Successfully!','success');
    }
  };

  if (isPageLoading) {
      return <LoadingScreen />;
  }

  return (
    <>
    <div className={`dashboard-container ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar />
      <main className={`main-content ${isDepositOpen ? 'dashboard-blur' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="toastrs">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toastr toastr--${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}>
              <div className="toast-icon">
                <i className={`fa ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} aria-hidden="true"></i>
              </div>
              <div className="toast-message">{toast.message}</div>
            </div>
          ))}
        </div>
        <div className="scrollable-content">

           <div className={`settings-page ${theme === 'dark' ? 'bg-light' : 'bg-dark'}`}>
              {/* Header */}
              <div className={`settings-header ${theme === 'dark' ? 'dark' : 'light'}`}>
                <div>
                  <h1 className={`settings-title ${theme === 'dark' ? 'color-light' : 'coolor-dark'}`}>Settings</h1>
                  <p className={`settings-subtitle ${theme === 'dark' ? 'color-light' : 'coolor-dark'}`}>Manage your account settings and preferences</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="settings-tabs">
                <button 
                  className={`settings-tab ${activeTab === 'profile' ? 'active' : ''} ${theme === 'dark' ? 'color-light' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button 
                  className={`settings-tab ${activeTab === 'security' ? 'active' : ''} ${theme === 'dark' ? 'color-light' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield size={20} />
                  <span>Security</span>
                </button>
                <button 
                  className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''} ${theme === 'dark' ? 'color-light' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell size={20} />
                  <span>Notifications</span>
                </button>
                <button 
                  className={`settings-tab ${activeTab === 'pin' ? 'active' : ''} ${theme === 'dark' ? 'color-light' : ''}`}
                  onClick={() => setActiveTab('pin')}
                >
                  <Key size={20} />
                  <span>Withdrawal PIN</span>
                </button>
                <button 
                  className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''} ${theme === 'dark' ? 'color-light' : ''}`}
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
                        {isUploadingImage ? (
                          <div className="settings-avatar-loader">
                            <div className="settings-spinner"></div>
                          </div>
                        ) : (
                          <Image
                            src={profileImage}
                            alt="User profile"
                            width={100}
                            height={100}
                            className="settings-avatar"
                            unoptimized={profileImage.startsWith('blob:')}
                          />
                        )}
                        
                        <button 
                          className="settings-avatar-upload" 
                          onClick={handleImageUpload}
                          disabled={isUploadingImage}
                          title="Change profile picture"
                        >
                          <Camera size={18} />
                        </button>
                      </div>
                      <div>
                        <h3>Profile Picture</h3>
                        <p className="settings-helper-text">JPG, PNG or GIF. Max size 2MB</p>
                        <div className="settings-button-group">
                          <button 
                            className="settings-btn-secondary" 
                            onClick={handleImageUpload}
                            disabled={isUploadingImage}
                          >
                            <Upload size={16} />
                            {isUploadingImage ? 'Uploading...' : 'Upload'}
                          </button>
                          <button 
                            className="settings-btn-text"
                            onClick={handleRemoveImage}
                            disabled={isUploadingImage || !hasCustomImage}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                      aria-label="Upload profile picture"
                    />
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

                {/* PIN Tab */}
                {activeTab === 'pin' && (
                  <>
                  {/* Withdrawal PIN Setup */}
                    <div className="settings-card">
                      <div className="settings-card-header">
                        <Key size={20} />
                        <h3>Withdrawal PIN</h3>
                      </div>
                      <p className="settings-card-desc">
                         {userHasPin 
                          ? 'Update your 4-digit transfer PIN for secure transactions' 
                          : 'Set up a 4-digit PIN to authorize withdrawals and sensitive transactions'
                        }</p>
                      
                      <div className="settings-pin-setup">
                        <label className="settings-pin-label">Enter 4-Digit PIN</label>
                        <div className="settings-pin-inputs">
                          {pin.map((digit, index) => (
                            <input 
                              key={`pin-${index}`}
                              type="text" 
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              className="settings-pin-input"
                              onChange={(e) => handlePinInput(index, e.target.value, false)}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !digit && index > 0) {
                                  const inputs = document.querySelectorAll('.settings-pin-inputs input');
                                  (inputs[index - 1] as HTMLInputElement).focus();
                                }
                              }}
                              onInput={(e) => {
                                if (e.currentTarget.value && index < 3) {
                                  const inputs = document.querySelectorAll('.settings-pin-inputs input');
                                  (inputs[index + 1] as HTMLInputElement).focus();
                                }
                              }}
                            />
                          ))}
                        </div>
                        
                        <label className="settings-pin-label">Confirm 4-Digit PIN</label>
                        <div className="settings-pin-inputs">
                          {confirmPin.map((digit, index) => (
                            <input 
                              key={`confirm-${index}`}
                              type="text" 
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              className="settings-pin-input"
                              onChange={(e) => handlePinInput(index, e.target.value, true)}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !digit && index > 0) {
                                  const inputs = document.querySelectorAll('.settings-pin-inputs input');
                                  const allInputs = Array.from(inputs);
                                  (allInputs[index + 3] as HTMLInputElement).focus();
                                }
                              }}
                              onInput={(e) => {
                                if (e.currentTarget.value && index < 3) {
                                  const inputs = document.querySelectorAll('.settings-pin-inputs input');
                                  const allInputs = Array.from(inputs);
                                  (allInputs[index + 5] as HTMLInputElement).focus();
                                }
                              }}
                            />
                          ))}
                        </div>
                        {/* Status Indicator */}
                        <div className={`pin-status-indicator ${userHasPin ? 'pin-set' : 'pin-not-set'} ${theme === "dark" ? "color-light" : "color-dark"}`}>
                          <i className={`fas ${userHasPin ? 'fa-check-circle' : 'fa-exclamation-circle'} ${theme === "dark" ? "color-light" : "color-dark"}`} style={{marginRight:"3px"}}></i>
                          <span>
                            {userHasPin ? 'Transfer PIN is already set' : 'Transfer PIN not set'}
                          </span>
                        </div>
                        <button 
                          className="settings-btn-primary" 
                          style={{marginTop: '16px'}}
                          onClick={handleSetPin}
                        >
                          Set PIN
                        </button>
                      </div>
                    </div>
                  </>
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

              {/* Remove Image Confirmation Modal */}
              {showRemoveImageModal && (
                <>
                  <div className="settings-modal-overlay" onClick={() => setShowRemoveImageModal(false)} />
                  <div className="settings-modal">
                    <div className="settings-modal-content">
                      <div className="settings-modal-icon danger">
                        <Trash2 size={48} />
                      </div>
                      <h3>Remove Profile Picture</h3>
                      <p>Are you sure you want to remove your profile picture? Your profile will display the default avatar.</p>
                      <div className="settings-modal-actions">
                        <button className="settings-btn-secondary" onClick={() => setShowRemoveImageModal(false)}>
                          Cancel
                        </button>
                        <button className="settings-btn-danger" onClick={confirmRemoveImage}>
                          Remove Picture
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
            <Footer theme={theme} />
        </div>
      </main>
      <MobileNav activeTab="none" onPlusClick={() => setIsDepositOpen(true)} />
        <DepositModal 
            isOpen={isDepositOpen} 
            onClose={() => setIsDepositOpen(false)} 
            theme={theme} 
          />
    </div>
    </>
   
  );
};

export default Settings;