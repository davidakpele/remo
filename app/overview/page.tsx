'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Send,
  Plus,
  Settings,
  FileText,
  ArrowUpDown
} from 'lucide-react';
import './FinancialOverview.css';

interface BalanceCardProps {
  title: string;
  amount: string;
  subtitle: string;
  icon: React.ReactNode;
  isPrimary?: boolean;
  trend?: string;
}

const FinancialOverview = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const balanceCards: BalanceCardProps[] = [
    {
      title: 'Total Balance',
      amount: '$4,998,406.00',
      subtitle: 'from last month',
      icon: <CreditCard size={24} />,
      isPrimary: true,
      trend: '+2.5%'
    },
    {
      title: 'Available Balance',
      amount: '$4,998,406.00',
      subtitle: 'Ready for transactions',
      icon: <CheckCircle size={24} />,
    },
    {
      title: 'Pending Balance',
      amount: '$1,594.00',
      subtitle: 'Processing transactions',
      icon: <Clock size={24} />,
    }
  ];

  const accountInfo = {
    accountName: 'Nezer Techy',
    accountType: 'Savings',
    accountNumber: '5001320096',
    swiftCode: 'NEBANK'
  };

  const cardDetails = {
    balance: '$0.00',
    cardholderName: 'NEZER TECHY',
    expiryDate: '09/28',
    cardNumber: '5122********8111'
  };

  const quickActions = [
    { id: 1, title: 'Send Money', subtitle: 'Wire Transfer', icon: <Send size={24} />, color: 'primary' },
    { id: 2, title: 'Add Deposit', subtitle: 'Fund account', icon: <Plus size={24} />, color: 'secondary' },
    { id: 3, title: 'Settings', subtitle: 'Account Settings', icon: <Settings size={24} />, color: 'tertiary' },
    { id: 4, title: 'Statements', subtitle: 'Reports', icon: <FileText size={24} />, color: 'quaternary' }
  ];

  return (
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
  );
};

export default FinancialOverview;