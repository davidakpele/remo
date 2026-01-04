'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import './Transactions.css';



const AccountHistory = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showFilters, setShowFilters] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [filters, setFilters] = useState({
    transactionType: 'All Types',
    status: 'All Statuses',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: ''
  });

  // Mock transactions data
  const allTransactions: Transaction[] = [
    {
      id: '1',
      type: 'Transfer',
      description: 'Transfer to John Doe',
      amount: -5000.00,
      status: 'Completed',
      date: 'Sep 10, 2025',
      reference: 'TXN001234567'
    },
    {
      id: '2',
      type: 'Deposit',
      description: 'Bank Deposit',
      amount: 50000.00,
      status: 'Completed',
      date: 'Sep 08, 2025',
      reference: 'TXN001234566'
    },
    {
      id: '3',
      type: 'Withdrawal',
      description: 'ATM Withdrawal',
      amount: -2000.00,
      status: 'Completed',
      date: 'Sep 05, 2025',
      reference: 'TXN001234565'
    },
    {
      id: '4',
      type: 'Payment',
      description: 'Online Payment - Amazon',
      amount: -15000.00,
      status: 'Pending',
      date: 'Sep 03, 2025',
      reference: 'TXN001234564'
    },
    {
      id: '5',
      type: 'Transfer',
      description: 'Salary Credit',
      amount: 250000.00,
      status: 'Completed',
      date: 'Sep 01, 2025',
      reference: 'TXN001234563'
    }
  ];

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    let filtered = [...allTransactions];

    // Filter by transaction type
    if (filters.transactionType !== 'All Types') {
      filtered = filtered.filter(t => t.type === filters.transactionType);
    }

    // Filter by status
    if (filters.status !== 'All Statuses') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Filter by amount range
    if (filters.minAmount) {
      filtered = filtered.filter(t => Math.abs(t.amount) >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(t => Math.abs(t.amount) <= parseFloat(filters.maxAmount));
    }

    setFilteredTransactions(filtered);
    setShowTable(true);
  };

  const handleClearFilters = () => {
    setFilters({
      transactionType: 'All Types',
      status: 'All Statuses',
      fromDate: '',
      toDate: '',
      minAmount: '',
      maxAmount: ''
    });
    setShowTable(false);
    setFilteredTransactions([]);
  };

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return amount >= 0 ? `+$${formatted}` : `-$${formatted}`;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'Pending': return 'status-pending';
      case 'Failed': return 'status-failed';
      default: return '';
    }
  };

  const handleBackToDashboard = () => {
    console.log('Back to dashboard');
  };

  return (
    <div className={`account-history ${theme}`}>
      {/* Header */}
      <div className="ah-header">
        <div className="ah-header-content">
          <h1 className="ah-title">Account History</h1>
          <p className="ah-subtitle">View your master account transaction history</p>
        </div>
        <button className="ah-back-btn" onClick={handleBackToDashboard}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      {/* Account Info Card */}
      <div className="ah-account-card">
        <div className="ah-account-info">
          <div className="ah-account-details">
            <h2 className="ah-account-name">Nezer Techy</h2>
            <p className="ah-account-number">Account: 5001320096</p>
          </div>
          <div className="ah-balance-info">
            <h3 className="ah-balance-amount">$4,998,406.00</h3>
            <p className="ah-balance-label">Available: $4,998,406.00</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="ah-filter-section">
        <div className="ah-filter-header">
          <h3 className="ah-filter-title">Filter Transactions</h3>
          <button className="ah-clear-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>

        <div className="ah-filters-grid">
          <div className="ah-filter-row">
            <div className="ah-filter-group">
              <label className="ah-filter-label">Transaction Type</label>
              <select 
                className="ah-filter-select"
                value={filters.transactionType}
                onChange={(e) => handleFilterChange('transactionType', e.target.value)}
              >
                <option>All Types</option>
                <option>Transfer</option>
                <option>Deposit</option>
                <option>Withdrawal</option>
                <option>Payment</option>
              </select>
            </div>

            <div className="ah-filter-group">
              <label className="ah-filter-label">Status</label>
              <select 
                className="ah-filter-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option>All Statuses</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>

            <div className="ah-filter-group">
              <label className="ah-filter-label">From Date</label>
              <div className="ah-date-input">
                <Calendar size={18} />
                <input 
                  type="date" 
                  className="ah-filter-input"
                  value={filters.fromDate}
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  placeholder="From Date"
                />
              </div>
            </div>

            <div className="ah-filter-group">
              <label className="ah-filter-label">To Date</label>
              <div className="ah-date-input">
                <Calendar size={18} />
                <input 
                  type="date" 
                  className="ah-filter-input"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  placeholder="To Date"
                />
              </div>
            </div>
          </div>

          <div className="ah-filter-row">
            <div className="ah-filter-group">
              <label className="ah-filter-label">Min Amount</label>
              <input 
                type="number" 
                className="ah-filter-input"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                placeholder="Min Amount"
              />
            </div>

            <div className="ah-filter-group">
              <label className="ah-filter-label">Max Amount</label>
              <input 
                type="number" 
                className="ah-filter-input"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                placeholder="Max Amount"
              />
            </div>

            <div className="ah-filter-group ah-filter-actions">
              <button className="ah-search-btn" onClick={handleSearch}>
                <Search size={18} />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      {showTable && (
        <div className="ah-table-section">
          <div className="ah-table-header">
            <div className="ah-table-info">
              <h3 className="ah-table-title">Transaction History</h3>
              <p className="ah-table-subtitle">
                Showing {filteredTransactions.length} of {filteredTransactions.length} transactions
              </p>
            </div>
            <button className="ah-download-btn">
              <Download size={18} />
              Export
            </button>
          </div>

          <div className="ah-table-container">
            <table className="ah-table">
              <thead>
                <tr>
                  <th>TRANSACTION</th>
                  <th>TYPE</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="ah-transaction-cell">
                          <div className={`ah-transaction-icon ${transaction.amount >= 0 ? 'credit' : 'debit'}`}>
                            {transaction.amount >= 0 ? 
                              <ArrowDownLeft size={18} /> : 
                              <ArrowUpRight size={18} />
                            }
                          </div>
                          <div className="ah-transaction-details">
                            <p className="ah-transaction-description">{transaction.description}</p>
                            <p className="ah-transaction-reference">{transaction.reference}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="ah-type-badge">{transaction.type}</span>
                      </td>
                      <td>
                        <span className={`ah-amount ${transaction.amount >= 0 ? 'credit' : 'debit'}`}>
                          {formatAmount(transaction.amount)}
                        </span>
                      </td>
                      <td>
                        <span className={`ah-status-badge ${getStatusClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <span className="ah-date">{transaction.date}</span>
                      </td>
                      <td>
                        <button className="ah-view-btn">
                          <Eye size={18} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="ah-empty-state">
                      <p>No transactions found matching your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!showTable && (
        <div className="ah-empty-message">
          <Filter size={48} />
          <h3>Apply filters to view transactions</h3>
          <p>Use the filters above to search for specific transactions</p>
        </div>
      )}
    </div>
  );
};

export default AccountHistory;