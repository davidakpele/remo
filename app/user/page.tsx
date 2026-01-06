'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Key,
  Shield,
  AlertCircle,
  Smartphone,
  Monitor,
  FileText,
  CheckCircle
} from 'lucide-react';
import './UserProfile.css';
import { KYCDocument, LoginHistory, UserData, UserSettings } from '@/app/types/utils';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import DepositModal from '@/components/DepositModal';
import LoadingScreen from '@/components/loader/Loadingscreen';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Toast } from '@/app/types/auth';

const UserProfile = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isEditUserProfileDetails, setIsEditUserProfileDetails] = useState(false);
  const [isShowSuspendAccountModal, setShowSuspendAccountModal] = useState(false);
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
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

  const router = useRouter();

  useEffect(() => {
    // Handle page loading
    const loadingTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Mock user data
  const userData: UserData = {
    id: 'user_12345',
    fullName: 'Alex Christopher Johnson',
    email: 'alex.j@example.com',
    username: 'Alex',
    phone: '+1 (555) 000-1234',
    dateOfBirth: 'May 12, 1992',
    gender: 'Male',
    address: '123 Finance Way, New York, NY 10001',
    city: 'Lanly',
    country: 'United States',
    referralName: 'alexchrisjohnson',
    customerId: '#FV-99210',
    status: 'Active',
    kycLevel: 3
  };

  const kycDocuments: KYCDocument[] = [
    {
      id: '1',
      type: 'Government Issued Passport',
      verifiedOn: 'Oct 14, 2025',
      status: 'verified'
    },
    {
      id: '2',
      type: 'Proof of Address (Utility Bill)',
      verifiedOn: 'Oct 15, 2025',
      status: 'verified'
    }
  ];

  const loginHistory: LoginHistory[] = [
    {
      id: '1',
      device: 'iPhone 15 Pro',
      browser: 'Chrome',
      location: 'Lagos, NG',
      timestamp: '2 mins ago'
    },
    {
      id: '2',
      device: 'MacBook Pro',
      browser: 'Safari',
      location: 'New York, US',
      timestamp: '2 days ago'
    },
    {
      id: '3',
      device: 'iPhone 15 Pro',
      browser: 'App',
      location: 'London, UK',
      timestamp: '1 week ago'
    }
  ];

  const handleBackToUsers = () => {
    router.back();
  };

  const handleEditProfile = () => {
    setIsEditUserProfileDetails(true)
  };

  const handleRequestDeactivation = () => {
    setShowDeactivateModal(true);
  };

  const handleResetPassword = () => {
    setShowResetPasswordModal(true);
  };

  const handleEnable2FA = () => {
    setShow2FAModal(true);
   
  };

  const handleSuspendAccount = () => {
    setShowSuspendAccountModal(true);
  };

 const handleViewDocument = (docId: string) => {
    setLoadingDocId(docId);
    console.log('View document:', docId);

    setTimeout(() => {
      setLoadingDocId(null);
    }, 2000);
  };

  const handleProcessFAModal = () => {
    setShow2FAModal(false);
     showToast('Successfully Enabled 2Factor authentication.!', 'success');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
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
      setIsEditUserProfileDetails(false);
      showToast('Profile updated successfully!', 'success');
    }, 1500);
  };

  // Show loading screen for 3 seconds
  if (isPageLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
    <div className={`dashboard-container ${theme === 'dark' ? 'dark' : 'light'}`}>
      <Sidebar />

      <main className={`main-content`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <div className="scrollable-content">
            <div className={`user-profile-container ${theme == "dark" ? "bg-light" : "bg-dark"}`}>
              <div className="toastrs">
                {toasts.map((toast) => (
                  <div
                    key={toast.id}
                    className={`toastr toastr--${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}
                  >
                    <div className="toast-icon">
                      <i className={`fa ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} aria-hidden="true"></i>
                    </div>
                    <div className="toast-message">{toast.message}</div>
                  </div>
                ))}
              </div>
              {/* Header */}
              <div className="user-profile-header">
                <button className={`user-profile-back-btn ${theme === "dark" ? "color-light" : "color-dark"}`} onClick={handleBackToUsers}>
                  <ArrowLeft size={20} />
                  <span>Back to Users</span>
                </button>
              </div>

              {/* User Info Card */}
              <div className="user-profile-info-card">
                <div className="user-profile-info-left">
                  <div className="user-profile-avatar">
                  <Image
                    src="/assets/images/user-profile.jpg"
                    alt={userData?.fullName ?? 'User profile'}
                    width={48}
                    height={48}
                  />
                  </div>
                  <div className="user-profile-basic-info">
                    <div className="user-profile-name-row">
                      <h1 className="user-profile-name">{userData.fullName.split(' ')[0]} {userData.fullName.split(' ')[userData.fullName.split(' ').length - 1]}</h1>
                      <span className={`user-profile-status-badge ${userData.status.toLowerCase()}`}>
                        {userData.status}
                      </span>
                      <span className="user-profile-kyc-badge">
                        <CheckCircle size={14} />
                        KYC Level {userData.kycLevel}
                      </span>
                    </div>
                    <p className="user-profile-customer-id">Customer ID: {userData.customerId}</p>
                  </div>
                </div>
                <div className="user-profile-info-actions">
                  <button className="user-profile-btn-secondary" onClick={handleRequestDeactivation}>
                    Request Deactivation
                  </button>
                  {!isEditUserProfileDetails && 
                  ( <button className="user-profile-btn-primary" onClick={handleEditProfile}>
                    Edit Profile
                  </button>)
                  }
                 
                </div>
              </div>

              <div className="user-profile-content">
                {/* Left Column */}
                <div className="user-profile-main">
                  {/* Personal Information */}
                  <div className="user-profile-info-section">
                    <div className="user-profile-section-header">
                      <User size={20} />
                      <h2>{isEditUserProfileDetails? 'Edit Personal Information' : 'Personal Information'}</h2>
                    </div>
                    {isEditUserProfileDetails ? (
                      <>
                      <div className="settings-form-grid">
                        <div className="settings-form-group">
                          <label>Full Name</label>
                          <input 
                            type="text" 
                            value={userData.fullName.split(' ')[0]}
                            onChange={(e) => handleSelectChange('profile', 'fullName', e.target.value)}
                          />
                        </div>
                        <div className="settings-form-group">
                          <label>Username</label>
                          <input 
                            type="text" 
                            value={userData.username}
                            onChange={(e) => handleSelectChange('profile', 'username', e.target.value)}
                          />
                        </div>
                        <div className="settings-form-group">
                          <label>Email Address</label>
                          <input 
                            type="email" 
                            value={userData.email}
                            onChange={(e) => handleSelectChange('profile', 'email', e.target.value)}
                          />
                        </div>
                        <div className="settings-form-group">
                          <label>Phone Number</label>
                          <input 
                            type="tel" 
                            value={userData.phone}
                            onChange={(e) => handleSelectChange('profile', 'phone', e.target.value)}
                          />
                        </div>
                        <div className="settings-form-group">
                          <label>Gender</label>
                          <select className='settings-select' name='gender' id="gender" value={userData.gender} onChange={(e) => handleSelectChange('profile', 'gender', e.target.value)}>
                            <option value="">--Select--</option>
                            <option value="male">Male</option>
                            <option value="female">Femaile</option>
                            <option value="none">Prefer not to say</option>
                          </select>
                        </div>
                        <div className="settings-form-group">
                          <label>Address</label>
                          <input 
                            type="text" 
                            name='address'
                            value={userData.address}
                            onChange={(e) => handleSelectChange('profile', 'address', e.target.value)}
                          />
                        </div>
                        <div className="settings-form-group">
                          <label>Country</label>
                          <input 
                            type="text" 
                            name='country'
                            value={userData.country}
                            onChange={(e) => handleSelectChange('profile', 'country', e.target.value)}
                          />
                        </div>
                        <div className="settings-form-group">
                          <label>City</label>
                          <input 
                            type="text" 
                            name='city'
                            value={userData.city}
                            onChange={(e) => handleSelectChange('profile', 'city', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="settings-actions">
                        <button className="settings-btn-secondary" onClick={()=>setIsEditUserProfileDetails(false)}>Cancel</button>
                        <button className="settings-btn-primary" onClick={handleSaveProfile} disabled={isLoading}>
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                      </>
                    ):(
                      <>
                       <div className="user-profile-info-grid">
                          <div className="user-profile-info-item">
                            <label>FULL NAME</label>
                            <p>{userData.fullName}</p>
                          </div>
                          <div className="user-profile-info-item">
                            <label>EMAIL ADDRESS</label>
                            <p>{userData.email}</p>
                          </div>
                          <div className="user-profile-info-item">
                            <label>PHONE NUMBER</label>
                            <p>{userData.phone}</p>
                          </div>
                          <div className="user-profile-info-item">
                            <label>USERNAME</label>
                            <p>{userData.username}</p>
                          </div>
                          <div className="user-profile-info-item">
                            <label>DATE OF BIRTH</label>
                            <p>{userData.dateOfBirth}</p>
                          </div>
                          <div className="user-profile-info-item">
                            <label>GENDER</label>
                            <p>{userData.gender}</p>
                          </div>
                          <div className="user-profile-info-item">
                            <label>ADDRESS</label>
                            <p>{userData.address}</p>
                          </div>
                          <div className="user-profile-info-item">
                            <label>COUNTRY</label>
                            <p>{userData.country}</p>
                          </div>
                          <div className="user-profile-info-item">
                            <label>CITY/STATE</label>
                            <p>{userData.city}</p>
                          </div>
                          <div className="user-profile-info-item">
                            <label>REFERRAL NAME</label>
                            <p>{userData.referralName}</p>
                          </div>
                        </div>
                      </>
                    )}
                   

                  </div>

                  {/* KYC & Verification Documents */}
                  <div className="user-profile-info-section">
                    <div className="user-profile-section-header">
                      <FileText size={20} />
                      <h2>KYC & Verification Documents</h2>
                    </div>
                    <div className="user-profile-documents-list">
                      {kycDocuments.map((doc) => (
                        <div key={doc.id} className="user-profile-document-item">
                          <div className="user-profile-document-icon">
                            <FileText size={20} />
                          </div>
                          <div className="user-profile-document-info">
                            <h3>{doc.type}</h3>
                            <p>Verified on {doc.verifiedOn}</p>
                          </div>
                           {loadingDocId === doc.id ? (
                            <>
                              <div className={`setting-notif-loader-container"}`}>
                                <div className="settings-notif-spinner"></div>
                              </div>
                            </>
                           ) : (
                            <>
                              <button className="user-profile-btn-view" onClick={() => handleViewDocument(doc.id)} disabled={loadingDocId === doc.id}>View</button>
                            </>
                            )}
                          
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="user-profile-sidebar">
                  {/* Security Actions */}
                  <div className="user-profile-sidebar-section">
                    <h3 className="user-profile-sidebar-title">Security Actions</h3>
                    <div className="user-profile-security-actions">
                      <button className="user-profile-security-action-btn" onClick={handleResetPassword}>
                        <Key size={18} />
                        <span>Reset Password</span>
                      </button>
                      <button className="user-profile-security-action-btn" onClick={handleEnable2FA}>
                        <Shield size={18} />
                        <span>Enable 2FA (Force)</span>
                      </button>
                      <button className="user-profile-security-action-btn danger" onClick={handleSuspendAccount}>
                        <AlertCircle size={18} />
                        <span>Suspend Account</span>
                      </button>
                    </div>
                  </div>

                  {/* Login History */}
                  <div className="user-profile-sidebar-section">
                    <h3 className="user-profile-sidebar-title">Login History</h3>
                    <div className="user-profile-login-history-list">
                      {loginHistory.map((login) => (
                        <div key={login.id} className="user-profile-login-history-item">
                          <div className="user-profile-login-icon">
                            {login.device.includes('iPhone') || login.device.includes('App') ? 
                              <Smartphone size={20} /> : 
                              <Monitor size={20} />
                            }
                          </div>
                          <div className="user-profile-login-info">
                            <h4>{login.device} • {login.browser}</h4>
                            <p>{login.location} • {login.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Deactivation Modal */}
              {showDeactivateModal && (
                <>
                  <div className="user-profile-modal-overlay" onClick={() => setShowDeactivateModal(false)} />
                  <div className="user-profile-modal">
                    <div className="user-profile-modal-content">
                      <div className="user-profile-modal-icon warning">
                        <AlertCircle size={48} />
                      </div>
                      <h3>Request Account Deactivation</h3>
                      <p>Are you sure you want to request deactivation for this account? This action requires admin approval.</p>
                      <div className="user-profile-modal-actions">
                        <button className="user-profile-btn-secondary" onClick={() => setShowDeactivateModal(false)}>
                          Cancel
                        </button>
                        <button className="user-profile-btn-danger" onClick={() => {
                          console.log('Deactivation requested');
                          setShowDeactivateModal(false);
                        }}>
                          Request Deactivation
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Reset Password Modal */}
              {showResetPasswordModal && (
                <>
                  <div className="user-profile-modal-overlay" onClick={() => setShowResetPasswordModal(false)} />
                  <div className="user-profile-modal">
                    <div className="user-profile-modal-content">
                      <div className="user-profile-modal-icon primary">
                        <Key size={48} />
                      </div>
                      <h3>Reset User Password</h3>
                      <p>A password reset link will be sent to the user's email address.</p>
                      <div className="user-profile-modal-actions">
                        <button className="user-profile-btn-secondary" onClick={() => setShowResetPasswordModal(false)}>
                          Cancel
                        </button>
                        <button className="user-profile-btn-primary" onClick={() => {
                          console.log('Password reset sent');
                          setShowResetPasswordModal(false);
                        }}>
                          Send Reset Link
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {isShowSuspendAccountModal && (
                <>
                  <div className="user-profile-modal-overlay" onClick={() => setShowSuspendAccountModal(false)} />
                  <div className="user-profile-modal">
                    <div className="user-profile-modal-content">
                      <div className="user-profile-modal-icon warning">
                        <AlertCircle size={48} />
                      </div>
                      <h3>Request Account Suspension</h3>
                      <p>Are you sure you want to request suspend your account? This action requires admin approval.</p>
                      <div className="user-profile-modal-actions">
                        <button className="user-profile-btn-secondary" onClick={() => setShowSuspendAccountModal(false)}>
                          Cancel
                        </button>
                        <button className="user-profile-btn-danger" onClick={() => {
                          setShowSuspendAccountModal(false);
                        }}>
                          Request Suspension
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 2FA Modal */}
              {show2FAModal && (
                  <>
                    <div className="user-profile-modal-overlay" onClick={() => setShow2FAModal(false)} />
                      <div className="user-profile-modal">
                        <div className="user-profile-modal-content">
                          <div className="user-profile-modal-icon primary">
                            <Shield size={48} />
                          </div>
                          <h3>Enable 2FA (Force)</h3>
                          <p>This is another nice step to secure your account, on every time someone tries to login - you receive private clearance code and until you give that to that person only then will he gain access to you account</p>
                          <div className="user-profile-modal-actions">
                            <button className="user-profile-btn-secondary" onClick={() => setShow2FAModal(false)}>
                              Cancel
                            </button>
                            <button className="user-profile-btn-primary" onClick={handleProcessFAModal}>
                              Enable 2FA
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
       <MobileNav activeTab="profile" onPlusClick={() => setIsDepositOpen(true)} />
      <DepositModal
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        theme={theme} 
      />
    </div>
    </>
  );
};

export default UserProfile;