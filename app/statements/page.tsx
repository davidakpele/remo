'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Calendar } from 'lucide-react';
import DepositModal from '@/components/DepositModal'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import "./Statement.css"
import { Currency } from '../types/api';

const Statements = () => {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [duration, setDuration] = useState('');
    const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
    const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
    const [durationSearch, setDurationSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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

    const handleSearchNow = () => {
      // Check if both fields are filled
      if (!selectedCurrency.code || !duration) {
        console.log('Please select both service and duration');
        return;
      }
      setIsLoading(true);
      
      console.log('Searching with:', { selectedCurrency, duration });
      setTimeout(() => {
        console.log('Search completed');
        setIsLoading(false);
      }, 1500);
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

  return (
    <>
     <div className={`dashboard-container`}>
      <Sidebar />
      <main className={`main-content ${isDepositOpen ? 'dashboard-blur' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className={`scrollable-content ${theme === 'dark' ? 'bg-light' : 'bg-dark'}`}>
          <div className="wallet-header-wrapper">
          <div className={`settings-page ${theme === 'dark' ? 'bg-light' : 'bg-dark'}`}>
             <div className=" flex justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
                  <div className="mb-8">
                    <button className="flex items-center text-gray-700 mb-4 hover:text-gray-900 transition-colors">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      <h1 className="text-2xl font-semibold">Account Statement</h1>
                    </button>
                    <p className="text-gray-600 text-sm">
                      Kindly select the service and duration of interest
                    </p>
                  </div>
                    
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
                    
                  <div className="statement-container">
                    <label className="statement-label">Duration</label>
                    <div className="statement-selectField" onClick={handleDurationOpenModal}>
                      <span className="statement-selectedText">
                        {duration || "--Select--"}
                      </span>
                      <svg className="statement-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  {/* Search Now Button */}
                    <button 
                      onClick={handleSearchNow}
                      disabled={!selectedCurrency.code || !duration || isLoading}
                      className="w-full mt-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
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
      </div>
      
      <div className="modal-footer p-4 border-t border-gray-200" style={{ padding: '16px 20px' }}>
        <button 
          onClick={handleCustomDateApply}
          disabled={!startDate || !endDate}
          className={`w-full py-2 rounded-lg font-medium transition-colors text-sm ${startDate && endDate ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          Apply Date Range
        </button>
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

export default Statements;