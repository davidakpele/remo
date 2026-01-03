'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Download, Eye, X, ChevronDown, ChevronUp, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import DepositModal from '@/components/DepositModal'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import "./Transactions.css"
import { Currency } from '../types/api';
import React from 'react';

const Transactions = () => {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [dateFilterType, setDateFilterType] = useState<'all' | 'range'>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [balanceData, setBalanceData] = useState({
        totalBalance: 12500.75
    });
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    
    const scrollTimer = useRef<NodeJS.Timeout | null>(null);
    
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
    
    // Sample transaction history data with detailed information
    const [allTransactions, setAllTransactions] = useState([
        { 
            id: 1, 
            date: '2024-01-15', 
            description: 'Deposit from Bank Transfer', 
            amount: 5000.00, 
            type: 'credit', 
            status: 'completed',
            details: {
                reference: 'TRX-789456123',
                sender: 'John Smith',
                senderAccount: 'XXXX-XXXX-7894',
                receiver: 'Your Account',
                receiverAccount: 'XXXX-XXXX-1234',
                method: 'Bank Transfer',
                fees: 0.00,
                notes: 'Monthly salary deposit'
            }
        },
        { 
            id: 2, 
            date: '2024-01-14', 
            description: 'Purchase - Online Store', 
            amount: 250.50, 
            type: 'debit', 
            status: 'completed',
            details: {
                reference: 'TRX-321654987',
                merchant: 'Amazon Online Store',
                merchantId: 'AMZ-789456',
                category: 'Shopping',
                location: 'Online',
                method: 'Debit Card',
                fees: 2.50,
                notes: 'Electronics purchase'
            }
        },
        { 
            id: 3, 
            date: '2024-01-13', 
            description: 'Withdrawal Request', 
            amount: 1000.00, 
            type: 'debit', 
            status: 'pending',
            details: {
                reference: 'TRX-654987321',
                method: 'Bank Transfer',
                toAccount: 'XXXX-XXXX-9876',
                processingTime: '1-2 business days',
                fees: 5.00,
                notes: 'Scheduled withdrawal'
            }
        },
        { 
            id: 4, 
            date: '2024-01-12', 
            description: 'Referral Bonus', 
            amount: 50.00, 
            type: 'credit', 
            status: 'completed',
            details: {
                reference: 'TRX-147258369',
                type: 'Referral Bonus',
                referrer: 'User12345',
                program: 'Referral Program 2024',
                fees: 0.00,
                notes: 'Successful referral bonus'
            }
        },
        { 
            id: 5, 
            date: '2024-01-11', 
            description: 'Service Fee', 
            amount: 10.25, 
            type: 'debit', 
            status: 'completed',
            details: {
                reference: 'TRX-369258147',
                service: 'Monthly Maintenance',
                category: 'Service Fee',
                period: 'January 2024',
                fees: 10.25,
                notes: 'Monthly account maintenance fee'
            }
        },
        { 
            id: 6, 
            date: '2024-01-10', 
            description: 'Deposit from Card', 
            amount: 3000.00, 
            type: 'credit', 
            status: 'completed',
            details: {
                reference: 'TRX-456123789',
                method: 'Credit Card',
                bank: 'Bank of America',
                fees: 0.00,
                notes: 'Manual deposit'
            }
        },
    ]);
    
    const [transactionsHistory, setTransactionsHistory] = useState(allTransactions);
    
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        document.body.classList.toggle('dark-theme', initialTheme === 'dark');
    }, []);
    
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        document.body.classList.toggle('dark-theme', newTheme === 'dark');
    };

    const handleSearchNow = () => {
      if (!selectedCurrency.code) {
        console.log('Please select a service');
        return;
      }
      
      setIsLoading(true);
      
      // Prepare search parameters
      const searchParams = {
        currency: selectedCurrency.code,
        dateFilter: dateFilterType,
        startDate: startDate,
        endDate: endDate
      };
      
      console.log('Searching with:', searchParams);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Search completed');
        
        // Filter transactions based on date range if selected
        let filteredTransactions = [...allTransactions];
        
        if (dateFilterType === 'range' && startDate && endDate) {
          filteredTransactions = allTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include entire end day
            
            return transactionDate >= start && transactionDate <= end;
          });
        }
        
        setTransactionsHistory(filteredTransactions);
        
        // Calculate total balance from filtered transactions
        const totalBalance = filteredTransactions.reduce((total, transaction) => {
          return transaction.type === 'credit' 
            ? total + transaction.amount 
            : total - transaction.amount;
        }, 10000); // Starting balance
        
        setBalanceData({ totalBalance });
        setIsLoading(false);
        setShowResults(true);
        setExpandedRow(null); // Close any open details
      }, 1500);
    };

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    const handleSelect = (currency: Currency) => {
      console.log('Selected currency:', currency);
    };

    const handleDateFilterChange = (type: 'all' | 'range') => {
      setDateFilterType(type);
      if (type === 'all') {
        setStartDate('');
        setEndDate('');
      }
    };

    const handleResetSearch = () => {
      setShowResults(false);
      setSelectedCurrency({ name: "", code: "", symbol: "" });
      setDateFilterType('all');
      setStartDate('');
      setEndDate('');
      setTransactionsHistory(allTransactions);
      setBalanceData({ totalBalance: 12500.75 });
      setExpandedRow(null);
    };

    const handleExport = () => {
      const exportData = {
        currency: selectedCurrency.code,
        dateFilter: dateFilterType,
        startDate: startDate || 'All',
        endDate: endDate || 'All',
        transactions: transactionsHistory
      };
      console.log('Exporting data:', exportData);
      alert(`Exporting ${transactionsHistory.length} transactions for ${selectedCurrency.code}`);
    };

    const handleDownload = () => {
      console.log('Downloading PDF...');
      alert(`Downloading PDF with ${transactionsHistory.length} transactions`);
    };

    const toggleRowDetails = (id: number) => {
      setExpandedRow(expandedRow === id ? null : id);
    };

    const filteredCurrencies = currencies.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        return `${selectedCurrency.symbol || '$'}${amount.toFixed(2)}`;
    };

    const formatDateForDisplay = () => {
      if (dateFilterType === 'all') {
        return 'All Dates';
      }
      if (startDate && endDate) {
        const start = new Date(startDate).toLocaleDateString();
        const end = new Date(endDate).toLocaleDateString();
        return `${start} - ${end}`;
      }
      return 'Select Date Range';
    };

    const calculateAccountSummary = () => {
      const totalTransactions = transactionsHistory.length;
      const totalCredits = transactionsHistory
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalDebits = transactionsHistory
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + t.amount, 0);
      const netAmount = totalCredits - totalDebits;
      
      return {
        totalTransactions,
        totalCredits,
        totalDebits,
        netAmount
      };
    };

    const renderTransactionDetails = (transaction: typeof allTransactions[0]) => {
        const details = transaction.details as any;
        return (
            <div className="transaction-details bg-gray-50 p-4 md:p-6 rounded-lg mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="detail-item">
                        <span className="detail-label">Transaction Reference:</span>
                        <span className="detail-value font-mono">{details.reference}</span>
                    </div>
                    
                    {details.sender && (
                        <div className="detail-item">
                            <span className="detail-label">Sender:</span>
                            <span className="detail-value">{details.sender}</span>
                        </div>
                    )}
                    
                    {details.merchant && (
                        <div className="detail-item">
                            <span className="detail-label">Merchant:</span>
                            <span className="detail-value">{details.merchant}</span>
                        </div>
                    )}
                    
                    {details.method && (
                        <div className="detail-item">
                            <span className="detail-label">Payment Method:</span>
                            <span className="detail-value">{details.method}</span>
                        </div>
                    )}
                    
                    <div className="detail-item">
                        <span className="detail-label">Transaction Fees:</span>
                        <span className="detail-value">{formatCurrency(details.fees || 0)}</span>
                    </div>
                    
                    {details.category && (
                        <div className="detail-item">
                            <span className="detail-label">Category:</span>
                            <span className="detail-value">{details.category}</span>
                        </div>
                    )}
                    
                    {details.location && (
                        <div className="detail-item">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">{details.location}</span>
                        </div>
                    )}
                    
                    {details.notes && (
                        <div className="detail-item col-span-1 md:col-span-2 lg:col-span-3">
                            <span className="detail-label">Notes:</span>
                            <span className="detail-value">{details.notes}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const accountSummary = calculateAccountSummary();

  return (
    <>
     <div className={`dashboard-container`}>
      <Sidebar />
      <main className={`main-content ${isDepositOpen ? 'dashboard-blur' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className={`scrollable-content ${theme === 'dark' ? 'bg-light' : 'bg-dark'}`}>
          <div className="transaction-header-wrapper">
          <div className={`settings-page ${theme === 'dark' ? 'bg-light' : 'bg-dark'}`}>
             <div className="flex flex-col items-center p-4 md:p-6">
                {/* Main Content Container */}
                <div className="w-full max-w-6xl bg-white rounded-lg shadow-sm p-6 md:p-8">
                  {/* Header Section */}
                  <div className="mb-8 relative">
                    <div className="text-center">
                      <h1 className="text-2xl font-semibold text-black mb-2">Account History</h1>
                      <p className="text-gray-600 text-sm md:text-base">
                        View your mast account history transaction history
                      </p>
                    </div>
                  </div>
                  
                  {/* Search Section */}
                  {!showResults ? (
                    <div className="mb-8 flex flex-col items-center">
                      <div className="w-full max-w-md space-y-6">
                        {/* Service Selection */}
                        <div className="statement-container">
                          <label className="statement-label">Service</label>
                          <div className="statement-selectField" onClick={() => setIsModalOpen(true)}>
                            <span className="statement-selectedText">
                              {selectedCurrency.code ? `${selectedCurrency.name} (${selectedCurrency.code})` : "Select Service"}
                            </span>
                            <svg className="statement-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>

                        {/* Date Filter Selection - FIXED */}
                        <div className="statement-container">
                          <label className="statement-label">Date Filter</label>
                          <div className="space-y-4">
                            {/* All Dates Option */}
                            <div 
                              className={`date-option ${dateFilterType === 'all' ? 'selected' : ''}`}
                              onClick={() => handleDateFilterChange('all')}
                            >
                              <div className="flex items-center">
                                <div className={`radio-outer ${dateFilterType === 'all' ? 'checked' : ''}`}>
                                  <div className="radio-inner"></div>
                                </div>
                                <span className="ml-3 font-medium">All Dates</span>
                              </div>
                            </div>

                            {/* Date Range Option - FIXED: Separated click handlers */}
                            <div 
                              className={`date-option ${dateFilterType === 'range' ? 'selected' : ''}`}
                            >
                              <div 
                                className="flex items-center mb-3 cursor-pointer"
                                onClick={() => handleDateFilterChange('range')}
                              >
                                <div className={`radio-outer ${dateFilterType === 'range' ? 'checked' : ''}`}>
                                  <div className="radio-inner"></div>
                                </div>
                                <span className="ml-3 font-medium">Date Range</span>
                              </div>
                              
                              {dateFilterType === 'range' && (
                                <div className="ml-9 space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                    <input
                                      type="date"
                                      value={startDate}
                                      onChange={(e) => setStartDate(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                    <input
                                      type="date"
                                      value={endDate}
                                      onChange={(e) => setEndDate(e.target.value)}
                                      min={startDate}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    {startDate && endDate && endDate < startDate && (
                                      <p className="text-xs text-red-600 mt-1">
                                        End date must be after start date
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Search Button */}
                        <button 
                          onClick={handleSearchNow}
                          disabled={
                            !selectedCurrency.code || 
                            isLoading || 
                            (dateFilterType === 'range' && (!startDate || !endDate || (endDate < startDate)))
                          }
                          className="w-full mt-6 py-3 px-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                          {isLoading ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Searching...
                            </>
                          ) : (
                            'Search now'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Results Section */
                    <div className="results-section mt-8">
                      {/* Back to Search Button for Desktop */}
                      <div className="mb-6 hidden md:block">
                        <button 
                          onClick={handleResetSearch}
                          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Change Search Parameters
                        </button>
                      </div>

                      {/* Search Summary - Black Text */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                          <div className="flex items-center">
                            <span className="text-sm text-black font-medium mr-2">Currency:</span>
                            <span className="font-semibold text-black">{selectedCurrency.name} ({selectedCurrency.code})</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-black font-medium mr-2">Date:</span>
                            <span className="font-semibold text-black">{formatDateForDisplay()}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-black font-medium mr-2">Results:</span>
                            <span className="font-semibold text-black">{transactionsHistory.length} transactions</span>
                          </div>
                        </div>
                      </div>

                      {/* Account Info Card */}
                      <div className="account-tsr-info-wrapper">
                        <div className="account-tsr-info-card">
                          <div className="account-tsr-info-content">
                            <div className="account-tsr-info-left">
                              <h3 className="account-tsr-info-title">Account Holder</h3>
                              <p className="account-tsr-info-subtitle">Account: {selectedCurrency.code}-XXXX-1234</p>
                            </div>
                            <div className="account-tsr-info-right">
                              <p className="account-tsr-info-balance">{formatCurrency(balanceData.totalBalance)}</p>
                              <p className="account-tsr-info-available">Available: {formatCurrency(balanceData.totalBalance)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Statement Summary */}
                      <div className="account-tsr-summary-wrapper">
                        <div className="account-tsr-summary-card">
                          <h3 className="account-tsr-summary-title">Statement Summary</h3>
                          <div className="account-tsr-summary-grid">
                            {/* Total Transactions */}
                            <div className="account-tsr-summary-item">
                              <p className="account-tsr-summary-value">{accountSummary.totalTransactions}</p>
                              <p className="account-tsr-summary-label">Total Transactions</p>
                            </div>

                            {/* Total Credits */}
                            <div className="account-tsr-summary-item">
                              <p className="account-tsr-summary-value account-tsr-value-green">{formatCurrency(accountSummary.totalCredits)}</p>
                              <p className="account-tsr-summary-label">Total Credits</p>
                            </div>

                            {/* Total Debits */}
                            <div className="account-tsr-summary-item">
                              <p className="account-tsr-summary-value account-tsr-value-red">{formatCurrency(accountSummary.totalDebits)}</p>
                              <p className="account-tsr-summary-label">Total Debits</p>
                            </div>

                            {/* Net Amount */}
                            <div className="account-tsr-summary-item">
                              <p className={`account-tsr-summary-value ${accountSummary.netAmount >= 0 ? 'account-tsr-value-green' : 'account-tsr-value-red'}`}>
                                {formatCurrency(accountSummary.netAmount)}
                              </p>
                              <p className="account-tsr-summary-label">Net Amount</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Transaction History Table */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <h2 className="text-lg md:text-xl font-semibold text-black">Transaction History</h2>
                          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
                            <button 
                              onClick={handleExport}
                              className="flex-1 md:flex-none px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                            >
                              <Download size={14} className="md:size-4" />
                              <span className="hidden xs:inline">Export</span>
                            </button>
                            <button 
                              onClick={handleDownload}
                              className="flex-1 md:flex-none px-3 py-2 md:px-4 md:py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                            >
                              <Download size={14} className="md:size-4" />
                              <span className="hidden xs:inline">PDF</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[640px]">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs md:text-sm font-semibold text-black">Date</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs md:text-sm font-semibold text-black">Description</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs md:text-sm font-semibold text-black">Amount</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs md:text-sm font-semibold text-black">Type</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs md:text-sm font-semibold text-black">Status</th>
                                <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs md:text-sm font-semibold text-black">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {transactionsHistory.map((transaction) => (
                                <React.Fragment key={transaction.id}>
                                  <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-gray-700">{transaction.date}</td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-gray-700">{transaction.description}</td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                                      <span className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                                      <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium ${
                                        transaction.type === 'credit' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                                      <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium ${
                                        transaction.status === 'completed' 
                                          ? 'bg-blue-100 text-blue-800' 
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm">
                                      <button 
                                        onClick={() => toggleRowDetails(transaction.id)}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-xs md:text-sm flex items-center gap-1"
                                      >
                                        {expandedRow === transaction.id ? 'Hide Details' : 'View Details'}
                                        {expandedRow === transaction.id ? (
                                          <ChevronUp size={14} className="md:size-4" />
                                        ) : (
                                          <ChevronDown size={14} className="md:size-4" />
                                        )}
                                      </button>
                                    </td>
                                  </tr>
                                  {expandedRow === transaction.id && (
                                    <tr key={`${transaction.id}-details`}>
                                      <td colSpan={6} className="p-0">
                                        {renderTransactionDetails(transaction)}
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Table Footer */}
                        <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                          <div className="text-xs md:text-sm text-gray-600">
                            Showing {transactionsHistory.length} of {transactionsHistory.length} transactions
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                              Previous
                            </button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                              1
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                              2
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Currency Modal */}
                {isModalOpen && (
                  <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Select Currency</h3>
                        <button 
                          onClick={() => setIsModalOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="search-container">
                        <span className="search-icon-inside"><Search size={16} /></span>
                        <input 
                          type="text" 
                          placeholder="Search currency..." 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className={`country-list ${isScrolling ? 'is-scrolling' : ''}`} onScroll={handleScroll}>
                        {filteredCurrencies.map((c) => (
                          <div key={c.code} className="country-item" onClick={() => { 
                            setSelectedCurrency(c);
                            handleSelect(c);
                            setIsModalOpen(false);
                            setSearchTerm('')
                          }}>
                            <span className="truncate">{c.name} ({c.code})</span>
                            <div className={`radio-outer ${selectedCurrency.code === c.code ? 'checked' : ''}`}>
                              <div className="radio-inner"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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

export default Transactions;