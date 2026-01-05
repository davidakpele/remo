'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Calendar,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  SendIcon,
  X,
  Copy,
  Check
 } from 'lucide-react';
import DepositModal from '@/components/DepositModal'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import "./Statement.css"
import { Currency, SendStatementPayload } from '../types/api';
import { AccountTransactionStatement } from '../types/utils';
import LoadingScreen from '@/components/loader/Loadingscreen';
import { ApiResponse, ForwardAccountStatement, StatementItem } from '../types/errors';

const Statements = () => {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [duration, setDuration] = useState('');
    
    const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
    const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
    const [isStatemenToEmailModal, setIsStatemenToEmailModal] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false); 
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [durationSearch, setDurationSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statements, setStatements] = useState<AccountTransactionStatement[]>([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [emailAddress, setEmailAddress] = useState('');
    const emailRef = useRef<HTMLInputElement>(null);
    const scrollTimer = useRef<NodeJS.Timeout | null>(null);
    const [errors, setErrors] = useState<ForwardAccountStatement>({});
    const [successMessage, setSuccessMessage] = useState('');
    
    // Transaction Details Modal State
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<AccountTransactionStatement | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    
    const durations = ['Daily', 'Weekly', 'Monthly', 'Last Month', 'Custom'];
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
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>({ name: "", code: "", symbol: "" });
    
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

      const handleDurationOpenModal = () => {
        setIsDurationModalOpen(true);
      };

      const handleDurationSelect = (selectedDuration: string) => {
        if (selectedDuration === 'Custom') {
          setIsDurationModalOpen(false);
          setIsCustomDateModalOpen(true);
        } else {
          setDuration(selectedDuration);
          setIsDurationModalOpen(false);
        }
      };

      const handleCustomDateApply = () => {
        if (startDate && endDate) {
          setDuration(`Custom: ${formatDate(startDate)} - ${formatDate(endDate)}`);
          setIsCustomDateModalOpen(false);
          setStartDate('');
          setEndDate('');
        }
      };

      const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      };

      const filteredDurations = durations.filter(d => 
        d.toLowerCase().includes(durationSearch.toLowerCase())
      );

      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(() => {
          setIsScrolling(false);
        }, 1000);
      };

      const filteredCurrencies = currencies.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const [showTable, setShowTable] = useState(false);
      const [filters, setFilters] = useState({
        transactionType: 'All Types',
        status: 'All Statuses',
        fromDate: '',
        toDate: '',
        minAmount: '',
        maxAmount: ''
      });
    
      // Extended Mock transactions data - MORE DATA TO SHOW SCROLLING
      const allTransactions: AccountTransactionStatement[] = [
        {
          id: '1',
          type: 'Transfer',
          description: 'Transfer to John Doe',
          amount: -5000.00,
          status: 'Completed',
          date: 'Jan 05, 2026',
          reference: 'TXN001234567'
        },
        {
          id: '2',
          type: 'Deposit',
          description: 'Bank Deposit',
          amount: 50000.00,
          status: 'Completed',
          date: 'Jan 04, 2026',
          reference: 'TXN001234566'
        },
        {
          id: '3',
          type: 'Withdrawal',
          description: 'ATM Withdrawal',
          amount: -2000.00,
          status: 'Completed',
          date: 'Jan 03, 2026',
          reference: 'TXN001234565'
        },
        {
          id: '4',
          type: 'Payment',
          description: 'Online Payment - Amazon',
          amount: -15000.00,
          status: 'Pending',
          date: 'Jan 02, 2026',
          reference: 'TXN001234564'
        },
        {
          id: '5',
          type: 'Transfer',
          description: 'Salary Credit',
          amount: 250000.00,
          status: 'Completed',
          date: 'Jan 01, 2026',
          reference: 'TXN001234563'
        },
        {
          id: '6',
          type: 'Payment',
          description: 'Utility Bill Payment',
          amount: -8500.00,
          status: 'Completed',
          date: 'Dec 31, 2025',
          reference: 'TXN001234562'
        },
        {
          id: '7',
          type: 'Transfer',
          description: 'Transfer from Jane Smith',
          amount: 12000.00,
          status: 'Completed',
          date: 'Dec 30, 2025',
          reference: 'TXN001234561'
        },
        {
          id: '8',
          type: 'Withdrawal',
          description: 'ATM Withdrawal - Shopping Mall',
          amount: -3500.00,
          status: 'Completed',
          date: 'Dec 29, 2025',
          reference: 'TXN001234560'
        },
        {
          id: '9',
          type: 'Payment',
          description: 'Netflix Subscription',
          amount: -1200.00,
          status: 'Completed',
          date: 'Dec 28, 2025',
          reference: 'TXN001234559'
        },
        {
          id: '10',
          type: 'Deposit',
          description: 'Cash Deposit',
          amount: 75000.00,
          status: 'Completed',
          date: 'Dec 27, 2025',
          reference: 'TXN001234558'
        },
        {
          id: '11',
          type: 'Transfer',
          description: 'Transfer to Michael Brown',
          amount: -22000.00,
          status: 'Completed',
          date: 'Dec 26, 2025',
          reference: 'TXN001234557'
        },
        {
          id: '12',
          type: 'Payment',
          description: 'Grocery Shopping - Walmart',
          amount: -18500.00,
          status: 'Completed',
          date: 'Dec 25, 2025',
          reference: 'TXN001234556'
        },
        {
          id: '13',
          type: 'Transfer',
          description: 'Freelance Payment Received',
          amount: 95000.00,
          status: 'Completed',
          date: 'Dec 24, 2025',
          reference: 'TXN001234555'
        },
        {
          id: '14',
          type: 'Withdrawal',
          description: 'ATM Withdrawal',
          amount: -5000.00,
          status: 'Completed',
          date: 'Dec 23, 2025',
          reference: 'TXN001234554'
        },
        {
          id: '15',
          type: 'Payment',
          description: 'Internet Bill',
          amount: -4500.00,
          status: 'Pending',
          date: 'Dec 22, 2025',
          reference: 'TXN001234553'
        },
        {
          id: '16',
          type: 'Deposit',
          description: 'Investment Return',
          amount: 125000.00,
          status: 'Completed',
          date: 'Dec 21, 2025',
          reference: 'TXN001234552'
        },
        {
          id: '17',
          type: 'Transfer',
          description: 'Transfer to Sarah Wilson',
          amount: -35000.00,
          status: 'Completed',
          date: 'Dec 20, 2025',
          reference: 'TXN001234551'
        },
        {
          id: '18',
          type: 'Payment',
          description: 'Restaurant - Fine Dining',
          amount: -12800.00,
          status: 'Completed',
          date: 'Dec 19, 2025',
          reference: 'TXN001234550'
        },
        {
          id: '19',
          type: 'Withdrawal',
          description: 'ATM Withdrawal - Airport',
          amount: -10000.00,
          status: 'Completed',
          date: 'Dec 18, 2025',
          reference: 'TXN001234549'
        },
        {
          id: '20',
          type: 'Transfer',
          description: 'Bonus Credit',
          amount: 180000.00,
          status: 'Completed',
          date: 'Dec 17, 2025',
          reference: 'TXN001234548'
        }
      ];
    
      const [filteredTransactions, setFilteredTransactions] = useState<AccountTransactionStatement[]>([]);
    
      const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
      };
    
      const handleSearch = () => {
        // Show loader immediately
        setIsSearchLoading(true);
        setShowTable(false);
        
        // First, apply filters without showing table
        let filtered = [...allTransactions];

        if (filters.transactionType !== 'All Types') {
            filtered = filtered.filter(t => t.type === filters.transactionType);
        }

        if (filters.status !== 'All Statuses') {
            filtered = filtered.filter(t => t.status === filters.status);
        }

        if (filters.minAmount) {
            filtered = filtered.filter(t => Math.abs(t.amount) >= parseFloat(filters.minAmount));
        }
        if (filters.maxAmount) {
            filtered = filtered.filter(t => Math.abs(t.amount) <= parseFloat(filters.maxAmount));
        }

        setFilteredTransactions(filtered);
        
        // Wait 3 seconds before showing the table
        setTimeout(() => {
            setIsSearchLoading(false);
            setShowTable(true);
        }, 3000);
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
        setSelectedCurrency({ name: "", code: "", symbol: "" });
        setDuration('');
        setShowTable(false);
        setFilteredTransactions([]);
      };
    
      const formatAmount = (amount: number) => {
        const formatted = Math.abs(amount).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        return amount >= 0 ? `$${formatted}` : `$${formatted}`;
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

      // Check if there are active filters
      const hasActiveFilters = () => {
        return selectedCurrency.code || 
          filters.transactionType !== 'All Types' || 
          filters.status !== 'All Statuses' ||
          duration;
      };

      // Handle View Details Click
      const handleViewDetails = (transaction: AccountTransactionStatement) => {
        setSelectedTransaction(transaction);
        setIsDetailsModalOpen(true);
      };

      // Handle Copy Reference Number
      const handleCopyReference = (reference: string) => {
        navigator.clipboard.writeText(reference);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      };

      /**
       * Refactored function to send email with statements to backend API
       */
      const handleSendEmail = async () => {
        // Reset messages
        setErrors({});
        setSuccessMessage('');

        // Validate email
        const newErrors: ForwardAccountStatement = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailAddress || !emailRegex.test(emailAddress)) {
          newErrors.email = 'Valid email address is required!';
          setErrors(newErrors);
          return;
        }

        // Check if there are statements to send
        if (!filteredTransactions || filteredTransactions.length === 0) {
          newErrors.email = 'No transactions to send. Please apply filters first.';
          setErrors(newErrors);
          return;
        }

        // Prepare statements payload
        const statementsPayload: StatementItem[] = filteredTransactions.map(item => ({
          id: item.id ?? '',
          date: item.date ?? '',
          description: item.description ?? '',
          type: item.type ?? '',
          currencyType: selectedCurrency.code || 'USD',
          amount: item.amount ?? 0,
          balance: 0, 
          reference: item.reference ?? ''
        }));

        // Prepare complete payload
        const payload: SendStatementPayload = {
          email: emailAddress,
          statements: statementsPayload
        };

        setIsSendingEmail(true);

        try {
          // Make API call to Next.js API route
          const response = await fetch('/api/statements/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const result: ApiResponse = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to send email');
          }

          // Success
          setSuccessMessage(result.message || 'Statement sent successfully!');
          setEmailAddress('');
          
          // Close modal after 2 seconds
          setTimeout(() => {
            setIsStatemenToEmailModal(false);
            setSuccessMessage('');
          }, 2000);

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred while sending the email';
          newErrors.email = errorMessage;
          setErrors(newErrors);
        } finally {
          setIsSendingEmail(false);
        }
      };

      if (isPageLoading) {
        return <LoadingScreen />;
      }


  return (
    <>
     <div className={`dashboard-container`}>
      <Sidebar />
      <main className={`main-content ${isDepositOpen ? 'dashboard-blur' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className={`scrollable-content ${theme === 'dark' ? 'bg-light' : 'bg-dark'}`}>
          <div className="wallet-header-wrapper">
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
                      {/* First Row - 3 columns */}
                      <div className="ah-filter-row ah-filter-row-3">
                        <div className="ah-filter-group">
                          <label className="ah-filter-label">Service</label>
                          <div className="statement-selectField" onClick={() => setIsModalOpen(true)}>
                            <span className="statement-selectedText">
                              {selectedCurrency.code ? `${selectedCurrency.name} (${selectedCurrency.code})` : "Select Service"}
                            </span>
                            <svg className="statement-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>

                        <div className="ah-filter-group">
                          <label className="ah-filter-label">Transaction Type</label>
                          <select 
                            className="ah-filter-select"
                            value={filters.transactionType}
                            onChange={(e) => handleFilterChange('transactionType', e.target.value)}>
                            <option>All Types</option>
                            <option>Transfer</option>
                            <option>Deposit</option>
                            <option>Withdrawal</option>
                            <option>Payment</option>
                            <option>Bills Payment</option>
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
                      </div>

                      {/* Second Row - 2 columns (Duration + Search button) */}
                      <div className="ah-filter-row ah-filter-row-2">
                        <div className="ah-filter-group">
                          <label className="ah-filter-label">Duration</label>
                          <div className="statement-selectField duration-selectTextView" onClick={handleDurationOpenModal}>
                            <span className="statement-selectedText">
                              {duration || "--Select--"}
                            </span>
                            <svg className="statement-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>

                        <div className="ah-filter-group ah-filter-actions">
                          <button className="ah-search-btn" onClick={handleSearch} disabled={isSearchLoading} >
                            {isSearchLoading ? (<><div className="search-loader"></div>Searching...</>
                                                ) : (
                                                    <><Search size={18} />Search</>
                                                )}
                            </button>
                        </div>
                      </div>

                      {/* Active Filters Display */}
                      {hasActiveFilters() && (
                        <div className="active-filters">
                          {selectedCurrency.code && (
                            <span className="active-filter-tag">
                              Service: {selectedCurrency.name} ({selectedCurrency.code})
                            </span>
                          )}
                          {filters.transactionType && (
                            <span className="active-filter-tag">
                              Type: {filters.transactionType}
                            </span>
                          )}
                          {filters.status  && (
                            <span className="active-filter-tag">
                              Status: {filters.status}
                            </span>
                          )}
                          {duration && (
                            <span className="active-filter-tag">
                              Duration: {duration}
                            </span>
                          )}
                        </div>
                      )}
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
                        <div className="ah-action-buttons">
                          <button className="ah-download-btn">
                            <Download size={18} />
                            Export
                          </button>
                          <button className="ah-download-btn" onClick={()=>setIsStatemenToEmailModal(true)}>
                            <SendIcon size={18} />
                            Send to Email
                          </button>
                        </div>
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
                                    <button 
                                      className="ah-view-btn"
                                      onClick={() => handleViewDetails(transaction)}
                                    >
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

                  {/* Currency Modal */}
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
                            }}>
                              <span>{c.name} ({c.code})</span>
                              <div className={`radio-outer ${selectedCurrency.code === c.code ? 'checked' : ''}`}><div className="radio-inner"></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Duration Modal */}
              {isDurationModalOpen && (
                <div className="modal-overlay" onClick={() => setIsDurationModalOpen(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header"><h3>Select Duration</h3></div>
                    <div className="search-container">
                      <span className="search-icon-inside"><Search size={16} /></span>
                      <input type="text" placeholder="Search" value={durationSearch} onChange={(e) => setDurationSearch(e.target.value)} />
                    </div>
                    <div className={`country-list ${isScrolling ? 'is-scrolling' : ''}`} onScroll={handleScroll}>
                      {filteredDurations.map((d) => (
                        <div key={d} className="country-item" onClick={() => handleDurationSelect(d)}>
                          <span>{d}</span>
                          <div className={`radio-outer ${duration === d ? 'checked' : ''}`}><div className="radio-inner"></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Date Modal */}
              {isCustomDateModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCustomDateModalOpen(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '24rem', height: 'auto', maxHeight: '26rem' }}>
                    <div className="modal-header" style={{ padding: '16px 20px' }}>
                      <h3 style={{ fontSize: '14px', margin: 0 }}>Select Custom Date Range</h3>
                    </div>
                    <div className="p-4 space-y-4" style={{ padding: '16px 20px' }}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '12px', marginBottom: '8px' }}>Start Date</label>
                        <div className="relative">
                          <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                            style={{
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'textfield',
                              padding: '10px 12px',
                              fontSize: '12px'
                            }}
                          />
                          <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '12px', marginBottom: '8px' }}>End Date</label>
                        <div className="relative">
                          <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                            style={{
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'textfield',
                              padding: '10px 12px',
                              fontSize: '12px'
                            }}
                          />
                          <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    <div className="ah-filter-group ah-filter-actions">
                      <button className="apply-custom-btn" 
                        onClick={handleCustomDateApply}
                        disabled={!startDate || !endDate}>
                        Apply Date Range
                      </button>
                    </div>
                  </div>
                </div>
                </div>
              )}

              {/* Send Statement to Email Modal */}
              {isStatemenToEmailModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                  onClick={() => {
                    if (!isSendingEmail) {
                      setIsStatemenToEmailModal(false);
                      setErrors({});
                      setSuccessMessage('');
                    }
                  }}
                >
                  <div
                    className="w-full max-w-sm bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-200">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                        Send Statement to Email
                      </h3>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-4">
                      {/* Icon */}
                      <div className="flex justify-center">
                        <SendIcon size={40} className="text-slate-500" />
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 text-center">
                        Enter the email address where you would like to receive your account
                        statement.
                      </p>

                      {/* Success Message */}
                      {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs">
                          {successMessage}
                        </div>
                      )}

                      {/* Error Message */}
                      {errors.email && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                          {errors.email}
                        </div>
                      )}

                      {/* Input */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="Enter email address"
                          value={emailAddress}
                          ref={emailRef}
                          onChange={(e) => {
                            setEmailAddress(e.target.value);
                            setErrors({});
                          }}
                          disabled={isSendingEmail}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Button */}
                      <button 
                        className="w-full rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                        onClick={handleSendEmail}
                        disabled={isSendingEmail}
                      >
                        {isSendingEmail ? (
                          <>
                            <div className="search-loader"></div>
                            Sending...
                          </>
                        ) : (
                          'Send'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

                {isDetailsModalOpen && selectedTransaction && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setSelectedTransaction(null);
                      setIsCopied(false);
                    }}
                  >
                    <div
                      className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header - Compact */}
                      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-base font-semibold text-gray-800">
                          Transaction Details
                        </h3>
                        <button
                          onClick={() => {
                            setIsDetailsModalOpen(false);
                            setSelectedTransaction(null);
                            setIsCopied(false);
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded-full transition"
                        >
                          <X size={18} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Scrollable Body */}
                      <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        {/* Amount Card - Compact */}
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            selectedTransaction.amount >= 0 ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {selectedTransaction.amount >= 0 ? 
                              <ArrowDownLeft size={20} className="text-green-600" /> : 
                              <ArrowUpRight size={20} className="text-red-600" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className={`text-2xl font-bold truncate ${
                              selectedTransaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatAmount(selectedTransaction.amount)}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {selectedTransaction.amount >= 0 ? 'Money In' : 'Money Out'}
                            </p>
                          </div>
                        </div>

                        {/* Transaction Info - Compact Grid */}
                        <div className="space-y-3">
                          {/* Status */}
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-600">Status</span>
                            <span className={`ah-status-badge text-xs ${getStatusClass(selectedTransaction.status)}`}>
                              {selectedTransaction.status}
                            </span>
                          </div>

                          {/* Description */}
                          <div className="flex items-start justify-between py-2 border-b border-gray-100 gap-3">
                            <span className="text-xs font-medium text-gray-600 flex-shrink-0">Description</span>
                            <span className="text-xs text-gray-900 text-right break-words">
                              {selectedTransaction.description}
                            </span>
                          </div>

                          {/* Type */}
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-600">Type</span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                              {selectedTransaction.type}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-600">Date & Time</span>
                            <span className="text-xs text-gray-900">{selectedTransaction.date}</span>
                          </div>

                          {/* Reference with Copy */}
                          <div className="flex items-center justify-between py-2 border-b border-gray-100 gap-2">
                            <span className="text-xs font-medium text-gray-600 flex-shrink-0">Reference</span>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs text-gray-900 font-mono truncate">
                                {selectedTransaction.reference}
                              </span>
                              <button
                                onClick={() => handleCopyReference(selectedTransaction.reference)}
                                className="p-1 hover:bg-gray-100 rounded transition flex-shrink-0"
                                title="Copy"
                              >
                                {isCopied ? (
                                  <Check size={14} className="text-green-600" />
                                ) : (
                                  <Copy size={14} className="text-gray-500" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Transaction ID */}
                          <div className="flex items-center justify-between py-2">
                            <span className="text-xs font-medium text-gray-600">ID</span>
                            <span className="text-xs text-gray-900 font-mono">
                              {selectedTransaction.id}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions - Sticky */}
                      <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50">
                        <button className="flex-1 py-2 text-xs bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                          Download
                        </button>
                        <button className="flex-1 py-2 text-xs bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
          <Footer theme={theme} />
        </div>
      </main>
      <MobileNav activeTab="wallet" onPlusClick={() => setIsDepositOpen(true)} />
      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        theme={theme} 
      />
    </div>
    </>
  )
}

export default Statements;