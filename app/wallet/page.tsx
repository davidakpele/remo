'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  RefreshCw,
  ChevronDown,
  Search,
  Filter,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  MoreVertical
} from 'lucide-react';
import './Wallet.css';

interface Currency {
  name: string;
  code: string;
  symbol: string;
}

interface WalletBalance {
  currency: Currency;
  balance: number;
  isActive: boolean;
  lastTransaction?: string;
  monthlyChange?: number;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

const Wallet = () => {
  const [balancesVisible, setBalancesVisible] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  const currencies: Currency[] = [
    { name: "US Dollar", code: "USD", symbol: "$" },
    { name: "Euro", code: "EUR", symbol: "€" },
    { name: "Nigerian Naira", code: "NGN", symbol: "₦" },
    { name: "British Pound", code: "GBP", symbol: "£" },
    { name: "Japanese Yen", code: "JPY", symbol: "¥" },
    { name: "Australian Dollar", code: "AUD", symbol: "A$" },
    { name: "Canadian Dollar", code: "CAD", symbol: "C$" },
    { name: "Swiss Franc", code: "CHF", symbol: "Fr" },
    { name: "Chinese Yuan", code: "CNY", symbol: "¥" },
    { name: "Indian Rupee", code: "INR", symbol: "₹" },
  ];

  // Mock wallet balances
  const walletBalances: WalletBalance[] = [
    { currency: currencies[2], balance: 1250000.50, isActive: true, lastTransaction: '2 hours ago', monthlyChange: 12.5 },
    { currency: currencies[0], balance: 5430.75, isActive: true, lastTransaction: '1 day ago', monthlyChange: -3.2 },
    { currency: currencies[1], balance: 3250.00, isActive: true, lastTransaction: '3 days ago', monthlyChange: 8.7 },
    { currency: currencies[3], balance: 890.25, isActive: true, lastTransaction: '1 week ago', monthlyChange: 5.1 },
    { currency: currencies[4], balance: 150000, isActive: false, lastTransaction: 'Never', monthlyChange: 0 },
    { currency: currencies[5], balance: 0, isActive: false, lastTransaction: 'Never', monthlyChange: 0 },
    { currency: currencies[6], balance: 0, isActive: false, lastTransaction: 'Never', monthlyChange: 0 },
    { currency: currencies[7], balance: 0, isActive: false, lastTransaction: 'Never', monthlyChange: 0 },
    { currency: currencies[8], balance: 0, isActive: false, lastTransaction: 'Never', monthlyChange: 0 },
    { currency: currencies[9], balance: 0, isActive: false, lastTransaction: 'Never', monthlyChange: 0 },
  ];

  // Mock transactions for selected currency
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'credit',
      amount: 50000,
      currency: 'NGN',
      description: 'Deposit from Bank Transfer',
      date: '2 hours ago',
      status: 'completed',
      reference: 'TRX-2024-001'
    },
    {
      id: '2',
      type: 'debit',
      amount: 25000,
      currency: 'NGN',
      description: 'Payment to Electricity',
      date: '1 day ago',
      status: 'completed',
      reference: 'TRX-2024-002'
    },
    {
      id: '3',
      type: 'credit',
      amount: 100000,
      currency: 'NGN',
      description: 'Received from Alex Johnson',
      date: '2 days ago',
      status: 'completed',
      reference: 'TRX-2024-003'
    },
    {
      id: '4',
      type: 'debit',
      amount: 15000,
      currency: 'NGN',
      description: 'Exchange to USD',
      date: '3 days ago',
      status: 'completed',
      reference: 'TRX-2024-004'
    },
    {
      id: '5',
      type: 'credit',
      amount: 75000,
      currency: 'NGN',
      description: 'Deposit via Card',
      date: '5 days ago',
      status: 'pending',
      reference: 'TRX-2024-005'
    },
  ];

  const selectedWallet = walletBalances.find(w => w.currency.code === selectedCurrency);
  const currencySymbol = selectedWallet?.currency.symbol || '₦';

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDeposit = () => {
    console.log('Deposit to', selectedCurrency);
  };

  const handleWithdraw = () => {
    console.log('Withdraw from', selectedCurrency);
  };

  const handleExchange = () => {
    console.log('Exchange', selectedCurrency);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="wallet-page">
      {/* Header */}
      <div className="wallet-page-header">
        <div>
          <h1 className="wallet-page-title">My Wallets</h1>
          <p className="wallet-page-subtitle">Manage your multi-currency wallets</p>
        </div>
        <button className="wallet-refresh-btn">
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Wallet Card */}
      <div className="wallet-main-card">
        <div className="wallet-main-header">
          <div className="wallet-currency-selector" onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}>
            <span className="wallet-currency-code">{selectedCurrency}</span>
            <ChevronDown size={20} />
            
            {showCurrencyDropdown && (
              <div className="wallet-currency-dropdown">
                {walletBalances.map((wallet) => (
                  <div
                    key={wallet.currency.code}
                    className={`wallet-currency-option ${wallet.currency.code === selectedCurrency ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCurrency(wallet.currency.code);
                      setShowCurrencyDropdown(false);
                    }}
                  >
                    <span className="wallet-currency-flag">{wallet.currency.symbol}</span>
                    <div className="wallet-currency-info">
                      <span className="wallet-currency-name">{wallet.currency.name}</span>
                      <span className="wallet-currency-balance">
                        {wallet.currency.symbol}{formatAmount(wallet.balance)}
                      </span>
                    </div>
                    {wallet.isActive && <span className="wallet-active-badge">Active</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            className="wallet-visibility-toggle"
            onClick={() => setBalancesVisible(!balancesVisible)}
          >
            {balancesVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <div className="wallet-balance-section">
          <div className="wallet-balance-label">Available Balance</div>
          <div className="wallet-balance-amount">
            {balancesVisible ? (
              <>
                <span className="wallet-currency-symbol">{currencySymbol}</span>
                <span>{formatAmount(selectedWallet?.balance || 0)}</span>
              </>
            ) : (
              <span>******</span>
            )}
          </div>
          {selectedWallet?.monthlyChange !== undefined && selectedWallet.monthlyChange !== 0 && (
            <div className={`wallet-balance-change ${selectedWallet.monthlyChange > 0 ? 'positive' : 'negative'}`}>
              {selectedWallet.monthlyChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(selectedWallet.monthlyChange)}% this month</span>
            </div>
          )}
        </div>

        <div className="wallet-actions">
          <button className="wallet-action-btn deposit" onClick={handleDeposit}>
            <Plus size={20} />
            <span>Deposit</span>
          </button>
          <button className="wallet-action-btn withdraw" onClick={handleWithdraw}>
            <ArrowDownToLine size={20} />
            <span>Withdraw</span>
          </button>
          <button className="wallet-action-btn exchange" onClick={handleExchange}>
            <RefreshCw size={20} />
            <span>Exchange</span>
          </button>
        </div>
      </div>

      {/* All Wallets Grid */}
      <div className="wallet-grid-section">
        <h2 className="wallet-section-title">All Wallets</h2>
        <div className="wallet-grid">
          {walletBalances.map((wallet) => (
            <div 
              key={wallet.currency.code} 
              className={`wallet-grid-card ${!wallet.isActive ? 'inactive' : ''} ${wallet.currency.code === selectedCurrency ? 'selected' : ''}`}
              onClick={() => setSelectedCurrency(wallet.currency.code)}
            >
              <div className="wallet-grid-header">
                <div className="wallet-grid-currency">
                  <span className="wallet-grid-symbol">{wallet.currency.symbol}</span>
                  <div>
                    <div className="wallet-grid-code">{wallet.currency.code}</div>
                    <div className="wallet-grid-name">{wallet.currency.name}</div>
                  </div>
                </div>
                {wallet.isActive && <span className="wallet-grid-active-dot" />}
              </div>
              <div className="wallet-grid-balance">
                {balancesVisible ? (
                  <>
                    <span className="wallet-grid-amount">{wallet.currency.symbol}{formatAmount(wallet.balance)}</span>
                  </>
                ) : (
                  <span className="wallet-grid-amount">******</span>
                )}
              </div>
              <div className="wallet-grid-footer">
                <span className="wallet-grid-last-tx">Last: {wallet.lastTransaction}</span>
                {wallet.monthlyChange !== undefined && wallet.monthlyChange !== 0 && (
                  <span className={`wallet-grid-change ${wallet.monthlyChange > 0 ? 'positive' : 'negative'}`}>
                    {wallet.monthlyChange > 0 ? '+' : ''}{wallet.monthlyChange}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="wallet-transactions-section">
        <div className="wallet-transactions-header">
          <h2 className="wallet-section-title">Recent Transactions</h2>
          <div className="wallet-transactions-controls">
            <div className="wallet-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="wallet-filter-buttons">
              <button 
                className={`wallet-filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button 
                className={`wallet-filter-btn ${filterType === 'credit' ? 'active' : ''}`}
                onClick={() => setFilterType('credit')}
              >
                Credit
              </button>
              <button 
                className={`wallet-filter-btn ${filterType === 'debit' ? 'active' : ''}`}
                onClick={() => setFilterType('debit')}
              >
                Debit
              </button>
            </div>
            <button className="wallet-export-btn">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="wallet-transactions-list">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="wallet-transaction-item">
                <div className={`wallet-transaction-icon ${tx.type}`}>
                  {tx.type === 'credit' ? <ArrowDownToLine size={20} /> : <ArrowUpFromLine size={20} />}
                </div>
                <div className="wallet-transaction-details">
                  <div className="wallet-transaction-desc">{tx.description}</div>
                  <div className="wallet-transaction-meta">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span>{tx.reference}</span>
                  </div>
                </div>
                <div className="wallet-transaction-right">
                  <div className={`wallet-transaction-amount ${tx.type}`}>
                    {tx.type === 'credit' ? '+' : '-'}{currencySymbol}{formatAmount(tx.amount)}
                  </div>
                  <span className={`wallet-transaction-status ${tx.status}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="wallet-empty-state">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;