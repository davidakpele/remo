'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Globe, 
  Hash,
  Key,
  Shield,
  AlertCircle,
  Smartphone,
  Monitor,
  Eye,
  FileText,
  CheckCircle
} from 'lucide-react';
import './UserProfile.css';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  country: string;
  referralName: string;
  customerId: string;
  status: 'Active' | 'Suspended' | 'Pending';
  kycLevel: number;
  profileImage: string;
}

interface KYCDocument {
  id: string;
  type: string;
  verifiedOn: string;
  status: 'verified' | 'pending' | 'rejected';
}

interface LoginHistory {
  id: string;
  device: string;
  browser: string;
  location: string;
  timestamp: string;
}

const UserProfile = () => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

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
    kycLevel: 3,
    profileImage: '/api/placeholder/100/100'
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
    // Navigate back to users list
    console.log('Navigate back to users');
  };

  const handleEditProfile = () => {
    console.log('Edit profile');
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
    console.log('Suspend account');
  };

  const handleViewDocument = (docId: string) => {
    console.log('View document:', docId);
  };

  return (
    <div className="user-profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={handleBackToUsers}>
          <ArrowLeft size={20} />
          <span>Back to Users</span>
        </button>
      </div>

      {/* User Info Card */}
      <div className="user-info-card">
        <div className="user-info-left">
          <div className="user-avatar">
            <img src={userData.profileImage} alt={userData.fullName} />
          </div>
          <div className="user-basic-info">
            <div className="user-name-row">
              <h1 className="user-name">{userData.fullName.split(' ')[0]} {userData.fullName.split(' ')[userData.fullName.split(' ').length - 1]}</h1>
              <span className={`status-badge ${userData.status.toLowerCase()}`}>
                {userData.status}
              </span>
              <span className="kyc-badge">
                <CheckCircle size={14} />
                KYC Level {userData.kycLevel}
              </span>
            </div>
            <p className="customer-id">Customer ID: {userData.customerId}</p>
          </div>
        </div>
        <div className="user-info-actions">
          <button className="btn-secondary" onClick={handleRequestDeactivation}>
            Request Deactivation
          </button>
          <button className="btn-primary" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-content">
        {/* Left Column */}
        <div className="profile-main">
          {/* Personal Information */}
          <div className="info-section">
            <div className="section-header">
              <User size={20} />
              <h2>Personal Information</h2>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>FULL NAME</label>
                <p>{userData.fullName}</p>
              </div>
              <div className="info-item">
                <label>EMAIL ADDRESS</label>
                <p>{userData.email}</p>
              </div>
              <div className="info-item">
                <label>PHONE NUMBER</label>
                <p>{userData.phone}</p>
              </div>
              <div className="info-item">
                <label>USERNAME</label>
                <p>{userData.username}</p>
              </div>
              <div className="info-item">
                <label>DATE OF BIRTH</label>
                <p>{userData.dateOfBirth}</p>
              </div>
              <div className="info-item">
                <label>GENDER</label>
                <p>{userData.gender}</p>
              </div>
              <div className="info-item">
                <label>ADDRESS</label>
                <p>{userData.address}</p>
              </div>
              <div className="info-item">
                <label>COUNTRY</label>
                <p>{userData.country}</p>
              </div>
              <div className="info-item">
                <label>CITY/STATE</label>
                <p>{userData.city}</p>
              </div>
              <div className="info-item">
                <label>REFERRAL NAME</label>
                <p>{userData.referralName}</p>
              </div>
            </div>
          </div>

          {/* KYC & Verification Documents */}
          <div className="info-section">
            <div className="section-header">
              <FileText size={20} />
              <h2>KYC & Verification Documents</h2>
            </div>
            <div className="documents-list">
              {kycDocuments.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-icon">
                    <FileText size={20} />
                  </div>
                  <div className="document-info">
                    <h3>{doc.type}</h3>
                    <p>Verified on {doc.verifiedOn}</p>
                  </div>
                  <button className="btn-view" onClick={() => handleViewDocument(doc.id)}>
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-sidebar">
          {/* Security Actions */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Security Actions</h3>
            <div className="security-actions">
              <button className="security-action-btn" onClick={handleResetPassword}>
                <Key size={18} />
                <span>Reset Password</span>
              </button>
              <button className="security-action-btn" onClick={handleEnable2FA}>
                <Shield size={18} />
                <span>Enable 2FA (Force)</span>
              </button>
              <button className="security-action-btn danger" onClick={handleSuspendAccount}>
                <AlertCircle size={18} />
                <span>Suspend Account</span>
              </button>
            </div>
          </div>

          {/* Login History */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Login History</h3>
            <div className="login-history-list">
              {loginHistory.map((login) => (
                <div key={login.id} className="login-history-item">
                  <div className="login-icon">
                    {login.device.includes('iPhone') || login.device.includes('App') ? 
                      <Smartphone size={20} /> : 
                      <Monitor size={20} />
                    }
                  </div>
                  <div className="login-info">
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
          <div className="modal-overlay" onClick={() => setShowDeactivateModal(false)} />
          <div className="modal">
            <div className="modal-content">
              <div className="modal-icon warning">
                <AlertCircle size={48} />
              </div>
              <h3>Request Account Deactivation</h3>
              <p>Are you sure you want to request deactivation for this account? This action requires admin approval.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDeactivateModal(false)}>
                  Cancel
                </button>
                <button className="btn-danger" onClick={() => {
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
          <div className="modal-overlay" onClick={() => setShowResetPasswordModal(false)} />
          <div className="modal">
            <div className="modal-content">
              <div className="modal-icon primary">
                <Key size={48} />
              </div>
              <h3>Reset User Password</h3>
              <p>A password reset link will be sent to the user's email address.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowResetPasswordModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={() => {
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

      {/* 2FA Modal */}
      {show2FAModal && (
        <>
          <div className="modal-overlay" onClick={() => setShow2FAModal(false)} />
          <div className="modal">
            <div className="modal-content">
              <div className="modal-icon primary">
                <Shield size={48} />
              </div>
              <h3>Enable 2FA (Force)</h3>
              <p>This will force the user to set up two-factor authentication on their next login.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShow2FAModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={() => {
                  console.log('2FA forced');
                  setShow2FAModal(false);
                }}>
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;