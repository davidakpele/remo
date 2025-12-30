'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import "./Register.css";
import logo from "../../assets/images/sekilogo-light.png";
import { Country } from '../interface/response';
import { countries } from '@/components/countries';
import { authService } from '@/app/api';


interface RegisterFormErrors {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  verificationCode?: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'warning' | 'success';
  exiting: boolean;
}

const Register = () => {
  const [regMode, setRegMode] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSwitchMode = (mode: 'email' | 'phone') => {
    setRegMode(mode);
    setFormData(prev => ({
      ...prev,
      email: '',
      phone: '',
      verificationCode: ''
    }));
    setSelectedCountry(null);
    setErrors({});
  };

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  const showToast = (msg: string, type: 'warning' | 'success' = 'warning') => {
    setToasts((prev) => {
      if (prev.length >= 5) return prev;
      const id = Date.now();
      const newToast: Toast = { id, message: msg, type, exiting: false };
      setTimeout(() => {
        setToasts((curr) => curr.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
        setTimeout(() => {
          setToasts((curr) => curr.filter((t) => t.id !== id));
        }, 300);
      }, 3000);
      return [...prev, newToast];
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) { showToast('Name is required'); return false; }
    if (!formData.username.trim()) { showToast('Username is required'); return false; }
    if (regMode === 'email') {
        if (!formData.email.includes('@')) { showToast('Invalid email'); return false; }
    } else {
        if (!selectedCountry) { showToast('Please select a country'); return false; }
        if (!formData.phone.trim()) { showToast('Phone number is required'); return false; }
    }
    if (formData.password.length < 8) { showToast('Password too short'); return false; }
    if (formData.password !== formData.confirmPassword) { showToast('Passwords mismatch'); return false; }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestCode = async () => {
    const identifier = regMode === 'email' ? formData.email : `${selectedCountry?.code}${formData.phone}`;
    if (!identifier || (regMode === 'phone' && !selectedCountry)) {
      showToast(`Please enter your ${regMode} details first`);
      return;
    }

    setIsRequestingCode(true);
    try {
        await authService.verifyToken(identifier);
        showToast('Verification code sent!', 'success');
    } catch (error: any) {
        showToast(error.toString());
    } finally {
        setIsRequestingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
        ...formData,
        phone: regMode === 'phone' ? `${selectedCountry?.code}${formData.phone}` : '',
        regMode
    };

    try {
      await authService.register(payload);
      showToast('Account created successfully!', 'success');
      setFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
      });
      setSelectedCountry(null);
    } catch (error: any) {
      const errorMsg = error.toString();
      if (errorMsg.includes('internet connection')) {
        showToast('You are offline. Please check your network.');
      } else if (errorMsg.includes('maintenance') || errorMsg.includes('down')) {
        showToast('Service unavailable. The server might be down.');
      } else {
        showToast(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="auth-page-wrapper">
      <div className="toastrs">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toastr toastr--${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}>
            <div className="toast-icon">
              <i className={`fa ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            </div>
            <div className="toast-message">{toast.message}</div>
          </div>
        ))}
      </div>

      <div className="register-card">
        <div className="logo-container">
          <Image src={logo} alt="Logo" className="logo-image" priority />
        </div>

        <div className="form-header-text"><h2>Create an account</h2></div>

        <div className="toggle-container">
          <button 
            type="button"
            className={regMode === 'email' ? 'active' : ''} 
            onClick={() => handleSwitchMode('email')}
          >
            Email
          </button>
          <button 
            type="button"
            className={regMode === 'phone' ? 'active' : ''} 
            onClick={() => handleSwitchMode('phone')}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input ref={nameRef} type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="Name" />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} placeholder="Username" />
          </div>

          {regMode === 'email' ? (
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="Email" />
            </div>
          ) : (
            <div className="form-group">
              <label>Phone number</label>
              <div className="phone-input-group">
                <div className="country-dropdown" onClick={() => setIsModalOpen(true)}>
                  <span>
                    {selectedCountry 
                      ? `${selectedCountry.name} (${selectedCountry.code})` 
                      : 'Select Country'}
                  </span>
                  <i className="fa fa-chevron-down"></i>
                </div>
                <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="Phone" />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} className="form-control" onChange={handleChange} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-container">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} className="form-control" onChange={handleChange} />
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Verification code</label>
            <div className="verification-wrapper">
              <input type="text" name="verificationCode" value={formData.verificationCode} className="form-control" onChange={handleChange} />
              <button type="button" className="btn-request-code" onClick={handleRequestCode} disabled={isRequestingCode}>
                {isRequestingCode ? 'Sending...' : 'Request Code'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? <div className="spinner"></div> : 'Sign Up'}
          </button>
        </form>

        <div className="footer-link">Already have an account? <Link href="/auth/login">Sign in</Link></div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Select Country</h3></div>
            <div className="search-container">
              <i className="fa fa-search"></i>
              <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div 
              className={`country-list ${isScrolling ? 'is-scrolling' : ''}`} 
              onScroll={handleScroll}
            >
              {filteredCountries.map((c) => (
                <div key={c.name} className="country-item" onClick={() => { setSelectedCountry(c); setIsModalOpen(false); }}>
                  <span>{c.name} ({c.code})</span>
                  <div className={`radio-outer ${selectedCountry?.name === c.name ? 'checked' : ''}`}><div className="radio-inner"></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;