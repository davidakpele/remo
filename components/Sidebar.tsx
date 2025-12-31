'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Wallet, CreditCard, History, Receipt,
  Send, HandCoins, FileText, UserPlus, Landmark,
  Headphones, Settings, LogOut, Smartphone
} from 'lucide-react';
import "./Sidebar.css";

const Sidebar = () => {
  const pathname = usePathname();

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Wallet size={20} />, label: 'Wallets', href: '/wallets' },
    { icon: <CreditCard size={20} />, label: 'Cards', href: '/cards' },
    { icon: <Receipt size={20} />, label: 'Bills', href: '/bills' },
    { icon: <Receipt size={20} />, label: 'Exchange', href: '/exchange' },
    { icon: <Send size={20} />, label: 'Payments', href: '/payments' },
    { icon: <HandCoins size={20} />, label: 'Loan', href: '/loan' },
    { icon: <History size={20} />, label: 'History Transaction', href: '/transactions' },
    { icon: <FileText size={20} />, label: 'Account Statement', href: '/statements' },
    { icon: <UserPlus size={20} />, label: 'Refer and Earn', href: '/refer' },
    { icon: <Landmark size={20} />, label: 'Deposit Banks', href: '/banks' },
    { icon: <Headphones size={20} />, label: 'Support', href: '/support' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
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
        {sidebarItems.map((item, idx) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={idx}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link href="/logout" className="nav-item logout-item">
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
