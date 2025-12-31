'use client';

import React from 'react';
import { Home, Wallet, Plus, BarChart3, User } from 'lucide-react';

interface MobileNavProps {
  activeTab?: string;
  onPlusClick?: () => void;
}

const MobileNav = ({ activeTab = 'home', onPlusClick }: MobileNavProps) => {
  return (
    <footer className="mobile-footer">
      <div className={`footer-tab ${activeTab === 'home' ? 'active' : ''}`}>
        <Home size={22} />
        <span>Home</span>
      </div>
      <div className={`footer-tab ${activeTab === 'wallet' ? 'active' : ''}`}>
        <Wallet size={22} />
        <span>Wallet</span>
      </div>
      
      <div className="center-send" onClick={onPlusClick}>
        <Plus size={28} />
      </div>
      
      <div className={`footer-tab ${activeTab === 'stats' ? 'active' : ''}`}>
        <BarChart3 size={22} />
        <span>Stats</span>
      </div>
      <div className={`footer-tab ${activeTab === 'profile' ? 'active' : ''}`}>
        <User size={22} />
        <span>Profile</span>
      </div>
    </footer>
  );
};

export default MobileNav;