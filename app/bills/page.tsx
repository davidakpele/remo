'use client';

import { useState, useEffect } from 'react';
import { 
  Zap, 
  Wifi, 
  Tv, 
  Phone, 
  Droplets, 
  ShieldCheck, 
  CreditCard, 
  Smartphone,
  Search
} from 'lucide-react';
import DepositModal from '@/components/DepositModal'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import "./Bills.css"
import { filters, services } from '../lib/BillsData';

const Bills = () => {
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredServices = services.filter(service => {
      const matchesFilter = selectedFilter === 'all' || service.category === selectedFilter;
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

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

    const getServiceIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('electricity')) return <Zap size={80} />;
        if (lowerName.includes('internet') || lowerName.includes('data')) return <Wifi size={80} />;
        if (lowerName.includes('tv') || lowerName.includes('cable')) return <Tv size={80} />;
        if (lowerName.includes('airtime')) return <Smartphone size={80} />;
        if (lowerName.includes('water')) return <Droplets size={80} />;
        if (lowerName.includes('insurance')) return <ShieldCheck size={80} />;
        if (lowerName.includes('betting')) return <CreditCard size={80} />;
        return <Phone size={80} />;
    };

  return (
    <>
     <div className={`dashboard-container`}>
      <Sidebar />
      <main className={`main-content ${isDepositOpen ? 'dashboard-blur' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="scrollable-content">
           <div className="bills-page">
      <div className="bills-content">
        <div className="page-header">
          <h1 className="page-title">Pay Bills</h1>
          <p className="page-description">
            No more stress over bill payment! ePay got you covered. With just a tap, take care of all your bills in a jiffy. 
            Chillax and let ePay do the boring part for you. More time for the fun things in life!
          </p>
        </div>
        <div className="filter-container">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`filter-button ${selectedFilter === filter.id ? 'active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="services-container">
          {filteredServices.map((service) => (
            <div key={service.id} className={`service-card ${service.color}`}>
              <h3 className="service-title">{service.name}</h3>
              <div className="service-icon-wrapper">
                {getServiceIcon(service.name)}
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="no-results">
            <p>No services found matching "{searchQuery}"</p>
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

export default Bills