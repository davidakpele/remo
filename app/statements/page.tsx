'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Calendar,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  SendIcon
 } from 'lucide-react';
import DepositModal from '@/components/DepositModal'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import "./Statement.css"
import { Currency } from '../types/api';
import { AccountTransactionStatement } from '../types/utils';
import LoadingScreen from '@/components/loader/Loadingscreen';

const Statements = () => {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [duration, setDuration] = useState('');
    const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
    const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false); 
    const [durationSearch, setDurationSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const scrollTimer = useRef<NodeJS.Timeout | null>(null);
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
    
      // Mock transactions data
      const allTransactions: AccountTransactionStatement[] = [
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

      // Check if there are active filters
      const hasActiveFilters = () => {
        return selectedCurrency.code || 
               filters.transactionType !== 'All Types' || 
               filters.status !== 'All Statuses' ||
               duration;
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
                          <button 
                                                className="ah-search-btn" 
                                                onClick={handleSearch}
                                                disabled={isSearchLoading} 
                                            >
                                                {isSearchLoading ? (
                                                    <>
                                                        <div className="search-loader"></div>
                                                        Searching...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Search size={18} />
                                                        Search
                                                    </>
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
                          <button className="ah-download-btn">
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