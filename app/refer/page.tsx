'use client';

import { useState, FormEvent, ChangeEvent, useEffect, useMemo } from 'react';
import DepositModal from '@/components/DepositModal'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import { 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowUpRight, 
  X,
  Download 
} from 'lucide-react';
import "./Refer.css"
import { referralData } from '../lib/referralData';
import { ReferredUser } from '../types/utils';

const Refer = () => {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [searchTerm, setSearchTerm] = useState('');
    const [monthFilter, setMonthFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('2024');
    const [activeModal, setActiveModal] = useState<'none' | 'filter-main' | 'year-range' | 'details'>('none');
    const [selectedUser, setSelectedUser] = useState<ReferredUser | null>(null);
    const [yearRange, setYearRange] = useState({ from: '2020', to: '2026' });

    const totalPlatformEarnings = useMemo(() => {
      return referralData.reduce((acc, user) => acc + user.totalEarningsFromUser, 0);
    }, [referralData]);

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

      const handleFilterSelect = (type: string) => {
    if (type === 'all') {
      setActiveModal('none');
    } else if (type === 'year') {
      setActiveModal('year-range');
    }
  };

  const openDetails = (user: ReferredUser) => {
    setSelectedUser(user);
    setActiveModal('details');
  };

  const filteredUsers = referralData.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const userYear = new Date(user.joinedDate).getFullYear();
    const matchesYear = userYear >= parseInt(yearRange.from) && userYear <= parseInt(yearRange.to);
    return matchesSearch && matchesYear;
  });

  return (
    <>
     <div className={`dashboard-container`}>
      <Sidebar />
      <main className={`main-content ${isDepositOpen ? 'dashboard-blur' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="scrollable-content">
          <div className="referral-container">
            <div className="referral-header">
              <div>
                <h1>Referral Program</h1>
                <p>Manage your network and track commissions</p>
              </div>
              <div className="referral-link-btn">
                Ref ID: <span>EPAY-7721</span>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card total-earned">
                <div className="stat-info">
                  <p>Total Commission</p>
                  <h3>₦ 6,700.00</h3>
                </div>
                <div className="stat-icon red-bg"><TrendingUp size={24} /></div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <p>Direct Referrals</p>
                  <h3>{referralData.length} Users</h3>
                </div>
                <div className="stat-icon gray-bg"><Users size={24} /></div>
              </div>
            </div>

       
             <div className="table-outer-wrapper">
              <div className="table-inner-scroll">
                <table className="referral-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Joined Date</th>
                      <th>Earnings (₦)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-profile-cell">
                            <div className="avatar-circle">{user.username.charAt(0).toUpperCase()}</div>
                            <span className="username-text">{user.username}</span>
                          </div>
                        </td>
                        <td>{user.joinedDate}</td>
                        <td className="earning-cell-text">₦{user.totalEarningsFromUser.toLocaleString()}</td>
                        <td>
                          <button className="details-action-btn" onClick={() => { setSelectedUser(user); setActiveModal('details'); }}>
                            Details <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {activeModal !== 'none' && (
              <div className="modal-overlay" onClick={() => setActiveModal('none')}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{activeModal === 'filter-main' ? 'Filter By' : activeModal === 'year-range' ? 'Select Year Range' : 'User Transactions'}</h3>
                    <X className="close-icon" onClick={() => setActiveModal('none')} />
                  </div>

                  {activeModal === 'filter-main' && (
                    <div className="filter-options">
                      <button onClick={() => handleFilterSelect('all')}>Show All</button>
                      <button onClick={() => handleFilterSelect('year')}>Filter by Year Range</button>
                      <button>Filter by Month</button>
                    </div>
                  )}

                  {activeModal === 'year-range' && (
                    <div className="range-picker">
                      <div className="input-group">
                        <label>From</label>
                        <input type="number" value={yearRange.from} onChange={(e) => setYearRange({...yearRange, from: e.target.value})} />
                      </div>
                      <div className="input-group">
                        <label>To</label>
                        <input type="number" value={yearRange.to} onChange={(e) => setYearRange({...yearRange, to: e.target.value})} />
                      </div>
                      <button className="apply-btn" onClick={() => setActiveModal('none')}>Apply Filter</button>
                    </div>
                  )}

                  {activeModal === 'details' && selectedUser && (
                    <div className="details-view">
                      <p className="subtitle">Activity for <strong>{selectedUser.username}</strong></p>
                      <div className="tx-list">
                        {selectedUser.transactions.map(tx => (
                          <div key={tx.id} className="tx-item">
                            <div>
                              <p className="tx-type">{tx.type}</p>
                              <p className="tx-date">{tx.date}</p>
                            </div>
                            <div className="tx-amounts">
                              <p className="tx-main">₦{tx.amount}</p>
                              <p className="tx-comm">+₦{tx.commission} earned</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
    </div>
    </>
  )
}

export default Refer;