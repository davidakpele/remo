'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp,
  CreditCard,
  Plus,
  ArrowUpDown
} from 'lucide-react';
import './FinancialOverview.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { accountInfo, balanceCards, cardDetails, quickActions } from '../lib/AccountStatisticRecordData';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import DepositModal from '@/components/DepositModal';
import LoadingScreen from '@/components/loader/Loadingscreen';

const FinancialOverview = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  
    useEffect(() => {
      // Handle page loading
      const loadingTimer = setTimeout(() => {
        setIsPageLoading(false);
      }, 2000);
  
      return () => clearTimeout(loadingTimer);
    }, []);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  };
  
  if (isPageLoading) {
      return <LoadingScreen />;
  }
  
  return (
    <>
     <div className={`dashboard-container ${theme === 'dark' ? 'dark' : ''}`}>
          <Sidebar />
          <main className={`main-content`}>
            <Header theme={theme} toggleTheme={toggleTheme} />
            <div className="scrollable-content">
               <div className={`financial-overview ${theme}`}>
                  {/* Header */}
                  <div className="fo-header">
                    <div className="fo-header-content">
                      <h1 className="fo-title">Financial Overview</h1>
                      <p className="fo-subtitle">Manage your banking activities</p>
                    </div>
                    <div className="fo-header-actions">
                      <button className="fo-btn fo-btn-primary">
                        <Plus size={20} />
                        Add Deposit
                      </button>
                      <button className="fo-btn fo-btn-secondary">
                        <ArrowUpDown size={20} />
                        Transfer
                      </button>
                    </div>
                  </div>

                  {/* Balance Cards */}
                  <div className="fo-balance-cards">
                    {balanceCards.map((card, index) => (
                      <div 
                        key={index} 
                        className={`fo-balance-card ${card.isPrimary ? 'primary' : ''}`}
                      >
                        <div className="fo-balance-card-header">
                          <div className={`fo-balance-icon ${card.isPrimary ? 'primary' : ''}`}>
                            {card.icon}
                          </div>
                          {card.isPrimary && <span className="fo-badge">PRIMARY</span>}
                        </div>
                        <div className="fo-balance-content">
                          <p className="fo-balance-label">{card.title}</p>
                          <h2 className="fo-balance-amount">{card.amount}</h2>
                          <div className="fo-balance-footer">
                            {card.trend && (
                              <span className="fo-trend">
                                <TrendingUp size={14} />
                                {card.trend}
                              </span>
                            )}
                            <span className="fo-balance-subtitle">{card.subtitle}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Grid */}
                  <div className="fo-bottom-grid">
                    {/* Your Card */}
                    <div className="fo-card">
                      <h3 className="fo-card-title">Your Card</h3>
                      <div className="fo-debit-card">
                        <div className="fo-debit-card-header">
                          <div className="fo-debit-badge">
                            <CreditCard size={20} />
                            DEBIT
                          </div>
                          <div className="fo-card-logo">FOREIGN CLAIM</div>
                        </div>
                        <div className="fo-debit-balance">
                          <p className="fo-debit-balance-label">Available Balance</p>
                          <h3 className="fo-debit-balance-amount">{cardDetails.balance}</h3>
                        </div>
                        <div className="fo-debit-details">
                          <div className="fo-debit-detail">
                            <p className="fo-debit-detail-label">CARDHOLDER NAME</p>
                            <p className="fo-debit-detail-value">{cardDetails.cardholderName}</p>
                          </div>
                          <div className="fo-debit-detail">
                            <p className="fo-debit-detail-label">EXPIRES</p>
                            <p className="fo-debit-detail-value">{cardDetails.expiryDate}</p>
                          </div>
                        </div>
                        <div className="fo-debit-footer">
                          <span className="fo-card-number">{cardDetails.cardNumber}</span>
                          <div className="fo-card-providers">
                            <div className="fo-card-provider red"></div>
                            <div className="fo-card-provider yellow"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="fo-card">
                      <h3 className="fo-card-title">Account Information</h3>
                      <div className="fo-account-info">
                        <div className="fo-info-row">
                          <span className="fo-info-label">Account Name</span>
                          <span className="fo-info-value">{accountInfo.accountName}</span>
                        </div>
                        <div className="fo-info-row">
                          <span className="fo-info-label">Account Type</span>
                          <span className="fo-info-value">{accountInfo.accountType}</span>
                        </div>
                        <div className="fo-info-row">
                          <span className="fo-info-label">Account Number</span>
                          <span className="fo-info-value">{accountInfo.accountNumber}</span>
                        </div>
                        <div className="fo-info-row">
                          <span className="fo-info-label">Swift Code</span>
                          <span className="fo-info-value">{accountInfo.swiftCode}</span>
                        </div>
                        <div className="fo-card-actions">
                          <button className="fo-action-btn fund">Fund</button>
                          <button className="fo-action-btn delete">Delete</button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="fo-card">
                      <h3 className="fo-card-title">Quick Actions</h3>
                      <div className="fo-quick-actions">
                        {quickActions.map((action) => (
                          <button 
                            key={action.id} 
                            className={`fo-quick-action ${action.color}`}
                          >
                            <div className="fo-quick-action-icon">
                              {action.icon}
                            </div>
                            <div className="fo-quick-action-content">
                              <p className="fo-quick-action-title">{action.title}</p>
                              <p className="fo-quick-action-subtitle">{action.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
             <Footer theme={theme} />
          </div>
        </main>
          <MobileNav activeTab="exchange" onPlusClick={() => setIsDepositOpen(true)} />
            <DepositModal 
            isOpen={isDepositOpen} 
            onClose={() => setIsDepositOpen(false)} 
            theme={theme} 
          />
        </div>
    </>
   
  );
};

export default FinancialOverview;