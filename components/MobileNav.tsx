'use client';

import { useRouter} from 'next/navigation';
import { Home, Wallet, Plus, User, Repeat } from 'lucide-react';
import { useState } from 'react';
import "./MobileNav.css"

interface MobileNavProps {
  activeTab?: string;
  onPlusClick?: () => void;
}



const MobileNav = ({ activeTab = 'home', onPlusClick }: MobileNavProps) => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
    const handleExchangeRoute = () => {
      router.push('/exchange');
    };
    const handleHomeRoute = () => {
      router.push('/dashboard');
    };

    const handleUserProfileRoute = () => {
      router.push('/dashboard/user');
    };

    const router = useRouter();
  return (
    <footer className="mobile-footer">
      <div className={`footer-tab ${activeTab === 'home' ? 'active' : ''}`} onClick={handleHomeRoute}>
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
      
      <div className={`footer-tab ${activeTab === 'exchange' ? 'active' : ''}`} onClick={handleExchangeRoute}>
          <Repeat size={20} />
        <span>Swap</span>
      </div>
      <div className={`footer-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={handleUserProfileRoute}>
        <User size={22} />
        <span>Profile</span>
      </div>
    </footer>
  );
};

export default MobileNav;