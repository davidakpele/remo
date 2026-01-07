'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Eye, EyeOff, Plus, ArrowDownLeft, 
  CreditCard, Repeat, Search, User2, 
  LucideProps, Smartphone, Wifi, Tv, 
  Lightbulb, Hospital, Trophy, Plane, ShoppingBag 
} from 'lucide-react';
import './Dashboard.css';
import Sidebar from '@/components/Sidebar';
import { Currency } from '../types/api';
import Header from '@/components/Header';
import News from '@/components/News';
import History from '@/components/History';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import DepositModal from '@/components/DepositModal';
import WithdrawModal from '@/components/WithdrawModal';
import LoadingScreen from '@/components/loader/Loadingscreen';
import { getToken, getUserId, setActiveWallet, setFiat, setWalletContainer, walletService } from '../api';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState(null);
  // Trigger wallet service
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showBalance, setShowBalance] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const currencies: Currency[] = [
    { name: "US Dollar", code: "USD", symbol: "$" },
    { name: "Euro", code: "EUR", symbol: "€" },
    { name: "Nigerian Naira", code: "NGN", symbol: "₦" },
    { name: "British Pound", code: "GBP", symbol: "£" },
    { name: "Japanese Yen", code: "JPY", symbol: "¥" },
    { name: "Australian Dollar", code: "AUD", symbol: "$" },
    { name: "Canadian Dollar", code: "CAD", symbol: "$" },
    { name: "Swiss Franc", code: "CHF", symbol: "Fr" },
    { name: "Chinese Yuan", code: "CNY", symbol: "¥" },
    { name: "Indian Rupee", code: "INR", symbol: "₹" },
  ];
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[2]);

    const refreshBalance = useCallback(async () => {
      try {
        setLoading(true);
        setError('');
        const token = getToken();
        const userId = getUserId();
        
        if (!token || !userId) {
          setError('Please login to view wallet');
          setLoading(false);
          return;
        }
        const response = await walletService.getByUserId(userId, token);
        setWallet(response);
        setActiveWallet(selectedCurrency.name);
        setFiat(selectedCurrency.name);
        setWalletContainer(response.wallet_balances, response.hasTransferPin, response.walletId);
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false);
      }
    }, [selectedCurrency]); 
  
    useEffect(() => {
      refreshBalance();
    }, [refreshBalance, refreshTrigger]);
  useEffect(() => {
    // Handle page loading
    const loadingTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  };

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsScrolling(false), 1000);
  };
 
  const filteredCurrencies = currencies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRedirect =()=>{
    router.push('/cards');
  }

  const quickActions = [
    { icon: <Smartphone />, label: 'Buy Airtime', color: '#ff7a5c' },
    { icon: <Wifi />, label: 'Buy Data', color: '#5ecdbf' },
    { icon: <Tv />, label: 'CableTv', color: '#5eb7cd' },
    { icon: <Lightbulb />, label: 'Electricity', color: '#ffac7a' },
    { icon: <CreditCard />, label: 'Virtual Card', color: '#9adbb9' },
    { icon: <Hospital />, label: 'Hospital', color: '#f5d671' },
    { icon: <Trophy />, label: 'Betting', color: '#b5a1d5' },
    { icon: <Repeat />, label: 'Swap', color: '#8ec5ed' },
    { icon: <Plane />, label: 'Book Flight', color: '#f7c978' },
    { icon: <ShoppingBag />, label: 'Shopping', color: '#88e0a3' },
  ];

  const handleExchangeRoute = () => {
    router.push('/exchange');
  };
  
  if (isPageLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`dashboard-container ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar />
      <main className={`main-content ${isDepositOpen ? 'dashboard-blur' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="scrollable-content">
          <div className="welcome-message">
            <div className="user-avatar">
                <Image
                  src="/assets/images/user-profile.jpg"
                  alt={'User profile'}
                  width={21}
                  height={21}
                  className="settings-avatar"
                /> 
            </div>
            <span className={`user-name-out ${theme === "dark" ? "color-light" : "color-dark"}`}>
              Welcome back, <span className='username-display'>David</span>
            </span>
          </div>
          <section className="hero-banner">
            <div className="wallet-header-wrapper">
              <div className="wallet-main-header">
                {/* Left corner */}
                <div className="wallet-currency-selector">
                  <div ref={dropdownRef} className="currency-pill" onClick={() => {
                    setIsModalOpen(true);
                    setIsDropdownOpen(!isDropdownOpen);
                  }} style={{ cursor: 'pointer' }}>
                    <span className='currency-option'>
                      {selectedCurrency.code} 
                      <i className={`fa ${isDropdownOpen ? 'fa-caret-up' : 'fa-caret-down'} text-light`} 
                        aria-hidden="true"
                        style={{ color: "#fff", fontSize: "15px", marginLeft: "4px", marginTop:"3px" }}></i>
                    </span>
                  </div>
                </div>

                {/* Right corner */}
                <div className="wallet-visibility-toggle">
                  <button onClick={() => setShowBalance(!showBalance)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <span className='eye-view'>
                      {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                    </span>
                  </button>
                </div>
              </div>
              <div className="balance-row">
                <div className="wallet-balance-label">Available Balance</div>
                <div className="amount">
                  {selectedCurrency.symbol} {showBalance ? '42,500.00' : '*****'}
                </div>
              </div>
            </div>


            <div className="hero-actions">
              <div className="hero-action-item" onClick={() => setIsDepositOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="hero-icon-box" style={{ background: '#fff', borderRadius: '50%', border: '1px solid #e2e8f0' }}>
                  <Plus size={20} style={{ color: '#ef4444' }} />
                </div>
                <span>Deposit</span>
              </div>
              <div className="hero-action-item" onClick={() => setIsWithdrawOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="hero-icon-box" style={{ background: '#fff', borderRadius: '50%', border: '1px solid #e2e8f0' }}>
                  <ArrowDownLeft size={20} style={{ color: '#ef4444' }} />
                </div>
                <span>Withdraw</span>
              </div>
              <div className="hero-action-item" onClick={handleRedirect}>
                <div className="hero-icon-box" style={{ background: '#fff', borderRadius: '50%', border: '1px solid #e2e8f0' }}>
                  <CreditCard size={20} style={{ color: '#ef4444' }} />
                </div>
                <span>Cards</span>
              </div>
              <div className="hero-action-item" onClick={handleExchangeRoute}>
                <div className="hero-icon-box" style={{ background: '#fff', borderRadius: '50%', border: '1px solid #e2e8f0' }}>
                  <Repeat size={20} style={{ color: '#ef4444' }} />
                </div>
                <span>Exchange</span>
              </div>
            </div>
          </section>

          <div className="kyc-progress-container">
            <Link href={"/"} className="kyc-progress-header-link">
              <h2 className={`kyc-progress-header ${theme === "dark" ? "light" : "color-dark"}`}>Complete your KYC</h2>
              <span className="kyc-progress-arrow">→</span>
            </Link>
            <div className="kyc-progress-bar-wrapper">
              <div className="kyc-progress-bar">
                <div className="kyc-progress-fill" style={{ width: `68%` }}></div>
              </div>
              <span className="kyc-progress-percentage">68%</span>
            </div>
          </div>

          <section className={`feature-grid ${theme === "dark" ? "color-light" : "color-dark"}`}>
            {quickActions.map((action, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-wrapper" style={{ background: action.color }}>
                  {React.cloneElement(action.icon as React.ReactElement<LucideProps>, { size: 22 })}
                </div>
                <span className="feature-label">{action.label}</span>
              </div>
            ))}
          </section>

          <div className="bottom-sections-grid">
            <div className="history-column">
              <History theme={theme} />
            </div>
            <div className="news-column">
              <News theme={theme} />
            </div>
          </div>

          <Footer theme={theme} />
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Select Currency</h3></div>
            <div className="search-container">
              <span className="search-icon-inside"><Search size={16} /></span>
              <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className={`country-list ${isScrolling ? 'is-scrolling' : ''}`} onScroll={handleScroll}>
              {filteredCurrencies.map((c) => (
                <div key={c.code} className="country-item" onClick={() => { 
                  setSelectedCurrency(c); 
                  setIsModalOpen(false);
                  setSearchTerm('') 
                  setIsDropdownOpen(false);
                }}>
                  <span>{c.name} ({c.code})</span>
                  <div className={`radio-outer ${selectedCurrency.code === c.code ? 'checked' : ''}`}><div className="radio-inner"></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <MobileNav activeTab="home" onPlusClick={() => setIsDepositOpen(true)} />
      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        theme={theme} 
      />
      <WithdrawModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        theme={theme} 
      />
    </div>
  );
};

export default Dashboard;