'use client';

import DepositModal from "@/components/DepositModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { useState, useMemo } from "react";
import "./BeneficiaryManager.css";

const BeneficiaryManager = () => {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
    const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null);
    const [historyFilter, setHistoryFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [beneficiaryToDelete, setBeneficiaryToDelete] = useState<number | null>(null);

    const [beneficiaries, setBeneficiaries] = useState([
        { 
            id: 1, 
            name: "Samuel Mensah", 
            detail: "Access Bank • 0123456789", 
            initial: "SM", 
            category: "banks", 
            isEpay: false, 
            lastTransaction: "2 days ago", 
            amount: "₦25,000",
            transactions: [
                { id: 1, date: "2026-01-04", amount: "₦25,000", type: "sent", status: "completed" },
                { id: 2, date: "2025-12-28", amount: "₦15,000", type: "sent", status: "completed" },
                { id: 3, date: "2025-12-15", amount: "₦30,000", type: "sent", status: "completed" },
                { id: 4, date: "2025-12-01", amount: "₦20,000", type: "sent", status: "completed" },
            ]
        },
        { 
            id: 2, 
            name: "Kemi Adebayo", 
            detail: "Zenith Bank • 9876543210", 
            initial: "KA", 
            category: "banks", 
            isEpay: false, 
            lastTransaction: "1 week ago", 
            amount: "₦15,000",
            transactions: [
                { id: 1, date: "2025-12-30", amount: "₦15,000", type: "sent", status: "completed" },
                { id: 2, date: "2025-12-20", amount: "₦10,000", type: "sent", status: "completed" },
            ]
        },
        { 
            id: 3, 
            name: "Emmanuel Peter", 
            detail: "ePay Wallet • @emmapeter", 
            initial: "EP", 
            category: "epay", 
            isEpay: true, 
            lastTransaction: "Today", 
            amount: "₦50,000",
            transactions: [
                { id: 1, date: "2026-01-06", amount: "₦50,000", type: "sent", status: "completed" },
                { id: 2, date: "2026-01-05", amount: "₦25,000", type: "sent", status: "completed" },
                { id: 3, date: "2026-01-03", amount: "₦40,000", type: "sent", status: "completed" },
                { id: 4, date: "2025-12-29", amount: "₦35,000", type: "sent", status: "completed" },
                { id: 5, date: "2025-12-20", amount: "₦20,000", type: "sent", status: "completed" },
            ]
        },
        { 
            id: 4, 
            name: "Chioma Nwosu", 
            detail: "GTBank • 5647382910", 
            initial: "CN", 
            category: "banks", 
            isEpay: false, 
            lastTransaction: "3 days ago", 
            amount: "₦30,000",
            transactions: [
                { id: 1, date: "2026-01-03", amount: "₦30,000", type: "sent", status: "completed" },
                { id: 2, date: "2025-12-25", amount: "₦18,000", type: "sent", status: "completed" },
            ]
        },
        { 
            id: 5, 
            name: "Tunde Bakare", 
            detail: "ePay Wallet • @tundeb", 
            initial: "TB", 
            category: "epay", 
            isEpay: true, 
            lastTransaction: "Yesterday", 
            amount: "₦12,000",
            transactions: [
                { id: 1, date: "2026-01-05", amount: "₦12,000", type: "sent", status: "completed" },
                { id: 2, date: "2026-01-01", amount: "₦8,000", type: "sent", status: "completed" },
                { id: 3, date: "2025-12-28", amount: "₦15,000", type: "sent", status: "completed" },
            ]
        },
    ]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const filteredBeneficiaries = useMemo(() => {
        return beneficiaries.filter((b) => {
            const matchesTab = activeFilter === 'all' || b.category === activeFilter;
            const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 b.detail.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [activeFilter, searchQuery, beneficiaries]);

    const getCategoryCount = (category: string) => {
        if (category === 'all') return beneficiaries.length;
        return beneficiaries.filter(b => b.category === category).length;
    };

    const openHistoryModal = (beneficiary: any) => {
        setSelectedBeneficiary(beneficiary);
        setShowHistoryModal(true);
        setHistoryFilter('all');
        setDateFrom('');
        setDateTo('');
    };

    const handleDeleteClick = (id: number) => {
        setBeneficiaryToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (beneficiaryToDelete) {
            setBeneficiaries(beneficiaries.filter(b => b.id !== beneficiaryToDelete));
            setShowDeleteConfirm(false);
            setBeneficiaryToDelete(null);
        }
    };

    const getFilteredTransactions = () => {
        if (!selectedBeneficiary) return [];
        
        const now = new Date();
        const transactions = selectedBeneficiary.transactions;

        if (historyFilter === 'custom' && dateFrom && dateTo) {
            return transactions.filter((t: any) => {
                const tDate = new Date(t.date);
                return tDate >= new Date(dateFrom) && tDate <= new Date(dateTo);
            });
        }

        return transactions.filter((t: any) => {
            const tDate = new Date(t.date);
            const diffTime = now.getTime() - tDate.getTime();
            const diffDays = diffTime / (1000 * 3600 * 24);

            switch(historyFilter) {
                case 'day':
                    return diffDays <= 1;
                case 'week':
                    return diffDays <= 7;
                case 'month':
                    return diffDays <= 30;
                default:
                    return true;
            }
        });
    };

    return (
      <div className="dashboard-container">
      <Sidebar />
      <main className={`main-content ${isDepositOpen ? 'blur-sm' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="scrollable-content pt-20 px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-7xl mx-auto w-full">
            
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 mb-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <i className="fas fa-users text-white text-xl"></i>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Saved Beneficiaries</h1>
                            </div>
                        </div>
                        <p className="text-red-100 text-sm sm:text-base max-w-xl">Manage your trusted contacts and send money instantly to your favorite recipients.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px] border border-white/20">
                            <div className="text-white/80 text-xs font-medium mb-1">Total Contacts</div>
                            <div className="text-white text-2xl sm:text-3xl font-bold">{beneficiaries.length}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px] border border-white/20">
                            <div className="text-white/80 text-xs font-medium mb-1">ePay Users</div>
                            <div className="text-white text-2xl sm:text-3xl font-bold">{beneficiaries.filter(b => b.isEpay).length}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                    <div className="flex-1 relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search contacts..." 
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2 bg-gray-100 rounded-xl p-1.5">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600'}`}
                        >
                            <i className="fas fa-th mr-2"></i>
                            <span className="hidden sm:inline">Grid</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600'}`}
                        >
                            <i className="fas fa-list mr-2"></i>
                            <span className="hidden sm:inline">List</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <div className="flex overflow-x-auto no-scrollbar">
                    {[
                        { key: 'all', label: 'All Contacts', icon: 'users' },
                        { key: 'banks', label: 'Bank Accounts', icon: 'university' },
                        { key: 'epay', label: 'ePay Users', icon: 'wallet' },
                        { key: 'intl', label: 'International', icon: 'globe' }
                    ].map((tab) => (
                        <button 
                            key={tab.key}
                            onClick={() => setActiveFilter(tab.key)} 
                            className={`flex-1 min-w-[140px] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center gap-2 sm:gap-3 font-bold text-xs sm:text-sm transition-all border-b-4 ${
                                activeFilter === tab.key 
                                    ? 'text-red-600 bg-red-50/50 border-red-600' 
                                    : 'text-gray-500 border-transparent hover:bg-gray-50'
                            }`}
                        >
                            <i className={`fas fa-${tab.icon} text-sm sm:text-base`}></i>
                            <span>{tab.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                activeFilter === tab.key ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {getCategoryCount(tab.key)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-bold text-gray-700 flex items-center gap-2">
                        <i className="fas fa-star text-yellow-500"></i>
                        Frequent Recipients
                    </h3>
                    <button className="text-red-600 text-xs sm:text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {[
                        { name: "Jane Doe", color: "bg-gradient-to-br from-orange-400 to-orange-600" },
                        { name: "Aliu O.", color: "bg-gradient-to-br from-blue-400 to-blue-600" },
                        { name: "Sarah K.", color: "bg-gradient-to-br from-purple-400 to-purple-600" },
                        { name: "John M.", color: "bg-gradient-to-br from-green-400 to-green-600" },
                        { name: "Ada I.", color: "bg-gradient-to-br from-pink-400 to-pink-600" }
                    ].map((person, idx) => (
                        <div key={idx} className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${person.color} flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                                {person.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-xs font-semibold text-gray-700 text-center max-w-[80px] truncate">{person.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {filteredBeneficiaries.map((b) => (
                        <div key={b.id} className={`bg-white rounded-2xl sm:rounded-3xl border-2 transition-all hover:shadow-xl hover:-translate-y-1 group ${
                            b.isEpay ? 'border-red-200 hover:border-red-400' : 'border-gray-100 hover:border-gray-300'
                        }`}>
                            <div className="p-5 sm:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${
                                        b.isEpay 
                                            ? 'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30' 
                                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                                    }`}>
                                        {b.initial}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {b.isEpay && (
                                            <span className="text-[9px] sm:text-[10px] bg-red-600 text-white px-2 py-1 rounded-full font-extrabold uppercase tracking-wider">
                                                ePay
                                            </span>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteClick(b.id)}
                                            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-600 transition"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1 truncate">{b.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-500 mb-4 truncate">{b.detail}</p>
                                
                                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Last sent</span>
                                        <span className="font-bold text-gray-700">{b.lastTransaction}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs mt-1">
                                        <span className="text-gray-500">Amount</span>
                                        <span className="font-bold text-red-600">{b.amount}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => openHistoryModal(b)}
                                    className="w-full py-3 text-xs sm:text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
                                >
                                    <i className="fas fa-history text-xs"></i>
                                    View History
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {filteredBeneficiaries.length === 0 && (
                        <div className="col-span-full bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-search text-3xl text-gray-400"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2">No beneficiaries found</h3>
                            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3 mb-8">
                    {filteredBeneficiaries.map((b) => (
                        <div key={b.id} className={`bg-white rounded-2xl border-2 transition-all hover:shadow-lg ${
                            b.isEpay ? 'border-red-200 hover:border-red-400' : 'border-gray-100 hover:border-gray-300'
                        }`}>
                            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl flex items-center justify-center font-bold ${
                                        b.isEpay 
                                            ? 'bg-gradient-to-br from-red-500 to-red-700 text-white' 
                                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                                    }`}>
                                        {b.initial}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">{b.name}</h4>
                                            {b.isEpay && (
                                                <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider flex-shrink-0">
                                                    ePay
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">{b.detail}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">{b.lastTransaction}</div>
                                        <div className="text-sm font-bold text-red-600">{b.amount}</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openHistoryModal(b)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm font-bold"
                                        >
                                            <i className="fas fa-history"></i>
                                            <span className="hidden sm:inline">History</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(b.id)}
                                            className="w-10 h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center justify-center"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {filteredBeneficiaries.length === 0 && (
                        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-search text-3xl text-gray-400"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2">No beneficiaries found</h3>
                            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            )}
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trash text-red-600 text-2xl"></i>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">Delete Beneficiary?</h3>
            <p className="text-gray-600 text-center mb-6">This action cannot be undone. Are you sure you want to remove this beneficiary from your list?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

{showHistoryModal && selectedBeneficiary && (
    <>
      {/* Backdrop */}
      <div 
        className="history-backdrop"
        onClick={() => setShowHistoryModal(false)}
      />
      
      {/* History Panel */}
      <div className="history-panel">
        {/* Panel Header */}
        <div className="history-panel-header">
          <div className="history-panel-header-content">
            <div className="history-panel-back-button">
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="history-back-button"
                aria-label="Go back"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
            <div className="history-panel-title-section">
              <h2 className="history-panel-title">
                <i className="fas fa-history history-panel-title-icon"></i>
                Transaction History
              </h2>
              <p className="history-panel-subtitle">{selectedBeneficiary.name}</p>
            </div>
            <div className="history-panel-header-actions">
              <button 
                 onClick={() => setShowHistoryModal(false)}
                className="history-panel-send-button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="history-quick-stats">
          <div className="history-quick-stat">
            <div className="history-quick-stat-value">{selectedBeneficiary.transactions.length}</div>
            <div className="history-quick-stat-label">Total</div>
          </div>
          <div className="history-quick-stat">
            <div className="history-quick-stat-value">{getFilteredTransactions().length}</div>
            <div className="history-quick-stat-label">Showing</div>
          </div>
          <div className="history-quick-stat">
            <div className="history-quick-stat-value-small">{selectedBeneficiary.amount}</div>
            <div className="history-quick-stat-label">Total Sent</div>
          </div>
          <div className="history-quick-stat">
            <div className="history-quick-stat-value-small">{selectedBeneficiary.lastTransaction}</div>
            <div className="history-quick-stat-label">Last Sent</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="history-filter-section">
          <div className="history-filter-group">
            <div className="history-filter-tabs">
              {[
                { key: 'all', label: 'All Time', icon: 'infinity' },
                { key: 'day', label: 'Today', icon: 'sun' },
                { key: 'week', label: 'Week', icon: 'calendar-week' },
                { key: 'month', label: 'Month', icon: 'calendar' },
                { key: 'custom', label: 'Custom', icon: 'calendar-alt' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    if (filter.key === 'custom') {
                      setHistoryFilter('custom');
                    } else {
                      setHistoryFilter(filter.key);
                      setDateFrom('');
                      setDateTo('');
                    }
                  }}
                  className={`history-filter-tab ${historyFilter === filter.key ? 'history-filter-tab-active' : ''}`}
                >
                  <i className={`fas fa-${filter.icon} history-filter-tab-icon`}></i>
                  <span className="history-filter-tab-label">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Picker */}
          {historyFilter === 'custom' && (
            <div className="history-custom-date-picker">
              <div className="history-custom-date-header">
                <h4 className="history-custom-date-title">Select Date Range</h4>
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => {
                      setDateFrom('');
                      setDateTo('');
                    }}
                    className="history-clear-dates-button"
                  >
                    <i className="fas fa-times"></i> Clear
                  </button>
                )}
              </div>
              <div className="history-date-inputs">
                <div className="history-date-input-group">
                  <label className="history-date-label" htmlFor="date-from">
                    <i className="fas fa-calendar-plus"></i> From
                  </label>
                  <input
                    id="date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="history-date-input"
                    max={dateTo || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="history-date-input-group">
                  <label className="history-date-label" htmlFor="date-to">
                    <i className="fas fa-calendar-minus"></i> To
                  </label>
                  <input
                    id="date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="history-date-input"
                    min={dateFrom}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              {(!dateFrom || !dateTo) && (
                <div className="history-date-hint">
                  <i className="fas fa-info-circle"></i>
                  Select both dates to filter transactions
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transaction List */}
        <div className="history-transaction-list">
          {getFilteredTransactions().length === 0 ? (
            <div className="history-empty-state">
              <div className="history-empty-icon">
                <i className="fas fa-exchange-alt"></i>
              </div>
              <h3 className="history-empty-title">
                {historyFilter === 'custom' && (!dateFrom || !dateTo) 
                  ? "Select a date range" 
                  : "No transactions found"}
              </h3>
              <p className="history-empty-message">
                {historyFilter === 'custom' && (!dateFrom || !dateTo) 
                  ? "Choose start and end dates to view transactions" 
                  : "Try changing your filters or select a different period"}
              </p>
              {historyFilter === 'custom' && (!dateFrom || !dateTo) && (
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    const lastWeek = new Date();
                    lastWeek.setDate(lastWeek.getDate() - 7);
                    const lastWeekStr = lastWeek.toISOString().split('T')[0];
                    
                    setDateFrom(lastWeekStr);
                    setDateTo(today);
                  }}
                  className="history-suggested-range-button"
                >
                  <i className="fas fa-history"></i>
                  View Last 7 Days
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="history-list-header">
                <div className="history-list-title">
                  <i className="fas fa-list-ul"></i>
                  Recent Transactions
                  <span className="history-list-count">
                    ({getFilteredTransactions().length})
                  </span>
                </div>
                <button
                  onClick={() => {
                    console.log('Export transactions for', selectedBeneficiary.name);
                  }}
                  className="history-export-button"
                >
                  <i className="fas fa-download"></i>
                  Export
                </button>
              </div>

              <div className="history-transactions">
                {getFilteredTransactions().map((transaction: any) => (
                  <div 
                    key={transaction.id} 
                    className={`history-transaction-item ${expandedTransaction === transaction.id ? 'expanded' : ''}`}
                  >
                    <div className="history-transaction-header">
                      <div className="history-transaction-icon">
                        <div className={`history-transaction-type-icon ${transaction.type}`}>
                          <i className={`fas fa-${transaction.type === 'sent' ? 'arrow-up' : 'arrow-down'}`}></i>
                        </div>
                      </div>
                      <div className="history-transaction-details">
                        <div className="history-transaction-main">
                          <div className="history-transaction-amount">{transaction.amount}</div>
                          <div className={`history-transaction-status ${transaction.status}`}>
                            <i className={`fas fa-${transaction.status === 'completed' ? 'check-circle' : transaction.status === 'pending' ? 'clock' : 'exclamation-circle'}`}></i>
                            {transaction.status}
                          </div>
                        </div>
                        <div className="history-transaction-info">
                          <div className="history-transaction-date">
                            <i className="fas fa-calendar"></i>
                            {new Date(transaction.date).toLocaleDateString('en-GB', { 
                              weekday: 'short',
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="history-transaction-reference">
                            <i className="fas fa-hashtag"></i>
                            TX{transaction.id.toString().padStart(6, '0')}
                          </div>
                        </div>
                      </div>
                      <div className="history-transaction-action">
                        <button 
                          className="history-transaction-details-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id);
                          }}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <div className="history-transaction-expanded-details">
                      <div className="history-transaction-detail-row">
                        <span className="history-transaction-detail-label">Transaction ID</span>
                        <span className="history-transaction-detail-value">TX{transaction.id.toString().padStart(6, '0')}</span>
                      </div>
                      <div className="history-transaction-detail-row">
                        <span className="history-transaction-detail-label">Amount</span>
                        <span className="history-transaction-detail-value">{transaction.amount}</span>
                      </div>
                      <div className="history-transaction-detail-row">
                        <span className="history-transaction-detail-label">Transaction Type</span>
                        <span className="history-transaction-detail-value">{transaction.type === 'sent' ? 'Money Sent' : 'Money Received'}</span>
                      </div>
                      <div className="history-transaction-detail-row">
                        <span className="history-transaction-detail-label">Date & Time</span>
                        <span className="history-transaction-detail-value">
                          {new Date(transaction.date).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric'
                          })} • {new Date(transaction.date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="history-transaction-detail-row">
                        <span className="history-transaction-detail-label">Status</span>
                        <span className="history-transaction-detail-value">
                          <span className={`history-transaction-status ${transaction.status}`}>
                            <i className={`fas fa-${transaction.status === 'completed' ? 'check-circle' : transaction.status === 'pending' ? 'clock' : 'exclamation-circle'}`}></i>
                            {transaction.status}
                          </span>
                        </span>
                      </div>
                      <div className="history-transaction-detail-row">
                        <span className="history-transaction-detail-label">Recipient</span>
                        <span className="history-transaction-detail-value">{selectedBeneficiary.name}</span>
                      </div>
                      <div className="history-transaction-detail-row">
                        <span className="history-transaction-detail-label">Account</span>
                        <span className="history-transaction-detail-value">{selectedBeneficiary.detail}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )}
    </div>
    );
};

export default BeneficiaryManager;