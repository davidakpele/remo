'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactSwitch from 'react-switch';
import { Bell, X, Menu, ChevronDown, User, Settings, LogOut, History, Headphones, CreditCard, Wallet, Receipt, FileText, UserPlus, HandCoins, LayoutDashboard } from 'lucide-react';
import './Header.css';
import Link from 'next/link';
import Image from 'next/image';


interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header = ({ theme, toggleTheme }: HeaderProps) => {
  const [showNotif, setShowNotif] = useState(false);
  const [isNotifLoading, setIsNotifLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [dropdownHover, setDropdownHover] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
      if (
        accountDropdownRef.current && 
        !accountDropdownRef.current.contains(event.target as Node) &&
        accountTriggerRef.current && 
        !accountTriggerRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
        setDropdownHover(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

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

  const handleAccountMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShowAccountDropdown(true);
  };

  const handleAccountMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      if (!dropdownHover) {
        setShowAccountDropdown(false);
      }
    }, 300);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownHover(true);
    setShowAccountDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    setDropdownHover(false);
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowAccountDropdown(false);
    }, 200);
  };

  const desktopNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'paybills', label: 'Paybills' },
    { id: 'giftcard', label: 'Giftcard' },
    { id: 'virtualCards', label: 'Virtual Cards' },
  ];

  const accountDropdownItems = [
    { id: 'dashboard/user', label: 'Profile', icon: <User size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    { id: 'auth/logout', label: 'Logout', icon: <LogOut size={16} /> },
  ];

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <History size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} /> },
    { id: 'bills', label: 'Bills', icon: <Receipt size={20} /> },
    { id: 'cards', label: 'Cards', icon: <CreditCard size={20} /> },
    { id: 'statements', label: 'Account Statement', icon: <FileText size={20} /> },
    { id: 'refer', label: 'Refer and Earn', icon: <UserPlus size={20} /> },
    { id: 'dashboard/user', label: 'Profile', icon: <User size={20} /> },
    { id: 'loan', label: 'Loan', icon: <HandCoins size={20} /> },
    { id: 'support', label: 'Support', icon: <Headphones size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      <header className={`header sticky-header ${isMobile ? 'mobile-header' : ''}`}>
        <div className="header-left">
          {isMobile && (
            <button 
              className="mobile-menu-button"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          )}
          
          {!isMobile && (
            <nav className="desktop-nav">
              <ul className="nav-list">
                {desktopNavItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/${item.id}`}
                      className="nav-link"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li 
                  className="nav-item-dropdown"
                >
                  <button 
                    ref={accountTriggerRef}
                    className="nav-link account-dropdown-trigger"
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    onMouseEnter={handleAccountMouseEnter}
                    onMouseLeave={handleAccountMouseLeave}
                  >
                    Account
                    <ChevronDown size={16} className={`dropdown-chevron ${showAccountDropdown ? 'rotate' : ''}`} />
                  </button>
                  {showAccountDropdown && (
                    <div 
                      className="account-dropdown"
                      ref={accountDropdownRef}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      {accountDropdownItems.map((item) => (
                        <Link
                          key={item.id}
                          href={`/${item.id}`}
                          className="dropdown-item"
                          onClick={() => {
                            setShowAccountDropdown(false);
                            setDropdownHover(false);
                          }}
                        >
                          <span className="dropdown-icon">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </div>

        <div className="header-right">
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

          <button className="notification-icon" onClick={handleToggleNotif}>
            <Bell size={24} />
            <span className="notification-badge">0</span>
          </button>
          
          <div className="user-avatar">
              <Image
                src="/assets/images/user-profile.jpg"
                alt={'User profile'}
                width={21}
                height={21}
                className="settings-avatar"
              />
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
                  <div className="notif-title">
                    <Bell size={18} style={{ color: '#c3290b' }} />
                    <span style={{ color: '#c3290b', fontWeight: '400' }}>Notifications</span>
                  </div>
                  <X size={18} style={{ cursor: 'pointer', color: "#c3290b" }} onClick={() => setShowNotif(false)} />
                </div>
                <div className="notif-content">
                  <select className="notif-select">
                    <option>All (0)</option>
                    <option>Messages (0)</option>
                    <option>Payments (0)</option>
                    <option>System (0)</option>
                  </select>
                  <div className="notif-empty">
                    <Bell size={40} style={{ color: '#c3290b' }} />
                    <p>No notifications</p>
                    <small>We'll notify you when something arrives</small>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {isMobile && isSidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
          <div className={`mobile-sidebar ${theme === 'dark' ? 'dark-sidebar' : ''}`} ref={sidebarRef}>
            <div className="sidebar-header">
              <div className="sidebar-user-info">
                <div className="user-avatar large">TM</div>
                <div>
                  <h3>Tola Mike</h3>
                  <p>tola.mike@example.com</p>
                </div>
              </div>
              <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
                {mobileNavItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/${item.id}`}
                      className="mobile-nav-link"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/logout"
                    className="mobile-nav-link logout-link"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className="nav-icon"><LogOut size={20} /></span>
                    <span>Logout</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;