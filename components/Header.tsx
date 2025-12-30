'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactSwitch from 'react-switch';
import { Bell, X } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header = ({ theme, toggleTheme }: HeaderProps) => {
  const [showNotif, setShowNotif] = useState(false);
  const [isNotifLoading, setIsNotifLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
    };
    if (showNotif) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotif]);

  const handleToggleNotif = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showNotif) {
      setIsNotifLoading(true);
      setShowNotif(true);
      setTimeout(() => setIsNotifLoading(false), 1500);
    } else {
      setShowNotif(false);
    }
  };

  return (
    <header className="header sticky-header">
      <div className="theme-switch-container">
        <ReactSwitch
          onChange={toggleTheme}
          checked={theme === 'dark'}
          checkedIcon={false}
          uncheckedIcon={false}
          offColor="#bbb"
          onColor="#c3290b"
          height={20}
          width={40}
          handleDiameter={16}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button className="notification-icon" onClick={handleToggleNotif}>
          <Bell size={24} />
          <span className="notification-badge">0</span>
        </button>
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: '50%', 
          backgroundColor: 'rgba(235, 69, 23, 1)', 
          fontWeight: "bold", 
          fontSize: "13px", 
          padding: "6px", 
          textAlign: "center", 
          color: "white" 
        }}>
          TM
        </div>
      </div>

      {showNotif && (
        <div className="notification-dropdown" ref={notifRef} onClick={(e) => e.stopPropagation()}>
          {isNotifLoading ? (
            <div className={`notif-loader-container ${theme === "dark" ? "color-light" : "color-dark"}`}>
              <div className="notif-spinner"></div>
            </div>
          ) : (
            <>
              <div className="notif-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={18} style={{ color: '#c3290b' }} />
                  <span style={{ color: '#c3290b', fontWeight: '400' }}>Notifications</span>
                </div>
                <X size={18} style={{ cursor: 'pointer', color: "#c3290b" }} onClick={() => setShowNotif(false)} />
              </div>
              <div style={{ padding: '16px', fontSize: "13px" }}>
                <select className="notif-select" style={{ 
                  color: theme === 'dark' ? '#fff' : '#000',
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  background: 'transparent',
                  border: '1px solid #e2e8f0'
                }}>
                  <option>All (0)</option>
                  <option>Messages (0)</option>
                  <option>Payments (0)</option>
                  <option>System (0)</option>
                </select>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Bell size={40} style={{ color: '#c3290b', margin: '0 auto 12px' }} />
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>No notifications</p>
                  <p style={{ color: '#cbd5e1', fontSize: '12px' }}>We'll notify you when something arrives</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;