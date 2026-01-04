'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Receipt,
  Repeat,
  Send,
  HandCoins,
  FileText,
  UserPlus,
  Landmark,
  User,
  Headphones,
  Settings,
  LogOut,
  Smartphone,
  ScanEyeIcon
} from 'lucide-react';
import "./Sidebar.css";

const Sidebar = () => {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "DASHBOARD",
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', href: '/dashboard' },
      ]
    },
    {
      title: "ACCOUNT",
      items: [  
        { icon: <FileText size={20} />, label: 'Statements', href: '/statements' },
        { icon: <ScanEyeIcon size={20} />, label: 'Wallet Statistic', href: '/overview' },
      ]
    },
    {
      title: "FUND TRANSFER",
      items: [
        { icon: <Send size={20} />, label: 'Payments', href: '/payments' },
        { icon: <Repeat size={20} />, label: 'Exchange', href: '/exchange' },
        { icon: <HandCoins size={20} />, label: 'Loan', href: '/loan' },
      ]
    },
    {
      title: "DEPOSITS",
      items: [
        { icon: <Landmark size={20} />, label: 'Deposit Banks', href: '/banks' },
        { icon: <Wallet size={20} />, label: 'Wallets', href: '/wallet' },
        { icon: <CreditCard size={20} />, label: 'Cards', href: '/cards' },
        { icon: <Receipt size={20} />, label: 'Bills', href: '/bills' },
      ]
    },
    {
      title: "USER",
      items: [
        { icon: <UserPlus size={20} />, label: 'Refer and Earn', href: '/refer' },
        { icon: <User size={20} />, label: 'Profile Settings', href: '/dashboard/user' },
        { icon: <Headphones size={20} />, label: 'Support', href: '/support' },
        { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-icon-wrapper">
          <Smartphone size={24} color="white" />
        </div>
        <span className="logo-text">ePay</span>
      </div>

      <nav className="sidebar-nav-scrollable">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="nav-group">
            <h3 className="group-title">{group.title}</h3>
            {group.items.map((item, idx) => {
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
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link href="/auth/logout" className="nav-item logout-link">
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;