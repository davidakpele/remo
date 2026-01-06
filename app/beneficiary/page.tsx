'use client';

import DepositModal from "@/components/DepositModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { useState, useMemo } from "react";

const BeneficiaryManager = () => {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const beneficiaries = [
        { id: 1, name: "Samuel Mensah", detail: "Access Bank • 0123456789", initial: "SM", category: "banks", isEpay: false },
        { id: 2, name: "Kemi Adebayo", detail: "Zenith Bank • 9876543210", initial: "KA", category: "banks", isEpay: false },
        { id: 3, name: "Emmanuel Peter", detail: "ePay Wallet • @emmapeter", initial: "EP", category: "epay", isEpay: true },
    ];

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
    }, [activeFilter, searchQuery]);

    return (
      <div className="dashboard-container">
      <Sidebar />
      <main className={`main-content ${isDepositOpen ? 'blur-sm' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="scrollable-content pt-20">
          
          <div className="max-w-6xl mx-auto w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            
            <div className="p-6 sm:p-10">
                <header className="mb-10 w-full">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Saved Beneficiaries</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">Quickly access and manage your transaction contacts.</p>
                </header>

                <div className="mb-8 w-full">
                    <div className="relative w-full">
                        <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                        <input 
                            type="text" 
                            id="searchInput" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, bank, or account handle..." 
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-base"
                        />
                    </div>
                </div>

                <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar w-full">
                    {['all', 'banks', 'epay', 'intl'].map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setActiveFilter(cat)} 
                            className={`tab-btn whitespace-nowrap pb-4 px-2 text-sm sm:text-base font-bold transition-all relative ${
                                activeFilter === cat ? 'text-[#c23321]' : 'text-gray-400'
                            }`}
                        >
                            {cat === 'all' ? `All (${beneficiaries.length})` : cat === 'epay' ? 'ePay Users' : cat === 'intl' ? 'Intl' : 'Banks'}
                            {activeFilter === cat && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c23321] rounded-full"></span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mb-10 w-full">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Frequent Recipients</h3>
                    <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-4 no-scrollbar w-full">
                        {[
                            { name: "Jane Doe", color: "bg-orange-100 text-orange-600" },
                            { name: "Aliu O.", color: "bg-blue-100 text-blue-600" },
                            { name: "Sarah K.", color: "bg-purple-100 text-purple-600" },
                            { name: "John M.", color: "bg-green-100 text-green-600" }
                        ].map((person, idx) => (
                            <div key={idx} className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${person.color} flex items-center justify-center text-lg sm:text-xl font-bold border-2 border-white shadow-sm`}>
                                    {person.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="text-xs font-bold text-gray-700">{person.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div id="beneficiaryGrid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-4">
                    {filteredBeneficiaries.map((b) => (
                        <div key={b.id} className={`beneficiary-card bg-white p-6 rounded-2xl border transition-all hover:shadow-md ${b.isEpay ? 'border-l-4 border-l-red-600' : 'border-gray-100 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${b.isEpay ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                    {b.initial}
                                </div>
                                <div className="flex gap-3 text-gray-300">
                                    {b.isEpay && <span className="text-[10px] bg-red-100 text-red-600 px-3 py-1 rounded-full font-extrabold uppercase tracking-widest">ePay</span>}
                                    <i className="fas fa-ellipsis-v hover:text-gray-600 cursor-pointer text-sm"></i>
                                </div>
                            </div>
                            <h4 className="font-bold text-gray-800 text-lg">{b.name}</h4>
                            <p className="text-xs text-gray-400 mb-8">{b.detail}</p>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2.5 text-xs font-bold bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition">History</button>
                                <button className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${b.isEpay ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                                    Send
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {filteredBeneficiaries.length === 0 && (
                        <div className="col-span-full text-center py-16">
                            <p className="text-gray-400 text-sm">No beneficiaries found in this category.</p>
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
    );
};

export default BeneficiaryManager;