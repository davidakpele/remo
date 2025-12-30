'use client';

import { 
  LayoutDashboard, Wallet, CreditCard, History, Receipt, 
  Send, HandCoins, FileText, UserPlus, Landmark, 
  Headphones, Settings, LogOut, Smartphone 
} from 'lucide-react';
import "./Sidebar.css"

const Sidebar = () => {
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <Wallet size={20} />, label: 'Wallets' },
    { icon: <CreditCard size={20} />, label: 'Cards' },
    { icon: <History size={20} />, label: 'History Transaction' },
    { icon: <Receipt size={20} />, label: 'Bills' },
    { icon: <Send size={20} />, label: 'Payments' },
    { icon: <HandCoins size={20} />, label: 'Loan' },
    { icon: <FileText size={20} />, label: 'Account Statement' },
    { icon: <UserPlus size={20} />, label: 'Refer and Earn' },
    { icon: <Landmark size={20} />, label: 'Deposit Banks' },
    { icon: <Headphones size={20} />, label: 'Support' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div style={{ backgroundColor: 'var(--bg-main)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
          <Smartphone size={24} color="white" />
        </div>
        e-pay
      </div>
      
      <nav className="sidebar-nav-scrollable">
        {sidebarItems.map((item, idx) => (
          <div key={idx} className={`nav-item ${item.active ? 'active' : ''}`}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item logout-item">
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;