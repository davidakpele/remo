'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Landmark, X, Copy, CheckCircle2 } from 'lucide-react';
import './History.css';

interface Transaction {
  id: number;
  type: 'credit' | 'debit';
  title: string;
  category: string;
  amount: string;
  date: string;
  icon: React.ReactNode;
  ref: string;
  status: string;
}

interface HistoryProps {
  theme: 'light' | 'dark';
}

const History = ({ theme }: HistoryProps) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const transactions: Transaction[] = [
    { id: 1, type: 'credit', title: 'Salary Deposit', category: 'Income', amount: '+₦450,000.00', date: 'Dec 28, 2025', icon: <Landmark size={18} />, ref: 'TRX-992837465', status: 'Successful' },
    { id: 2, type: 'debit', title: 'Netflix Subscription', category: 'Entertainment', amount: '-₦5,500.00', date: 'Dec 27, 2025', icon: <ShoppingBag size={18} />, ref: 'TRX-112233445', status: 'Successful' },
    { id: 3, type: 'credit', title: 'Transfer from John', category: 'Transfer', amount: '+₦12,000.00', date: 'Dec 26, 2025', icon: <ArrowDownLeft size={18} />, ref: 'TRX-556677889', status: 'Successful' },
    { id: 4, type: 'debit', title: 'Electricity Bill', category: 'Utility', amount: '-₦10,000.00', date: 'Dec 25, 2025', icon: <ArrowUpRight size={18} />, ref: 'TRX-443322110', status: 'Pending' },
  ];

  const themeClass = theme === "dark" ? "color-dark" : "color-light";

  return (
    <div className="history-container">
      <div className="section-header">
        <h3 className={`history-title ${theme === "dark" ? "color-light" : "color-dark"}`}>Recent Transactions</h3>
        <button className="view-all">View All</button>
      </div>

      <div className="transaction-list">
        {transactions.map((tx) => (
          <div key={tx.id} className="transaction-item" onClick={() => setSelectedTx(tx)}>
            <div className={`tx-icon-box ${tx.type}`}>
              {tx.icon}
            </div>
            <div className={`tx-details ${themeClass}`}>
              <p className="tx-title">{tx.title}</p>
              <p className="tx-meta">{tx.category} • {tx.date}</p>
            </div>
            <div className="tx-amount-box">
              <p className={`tx-amount ${tx.type}`}>{tx.amount}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedTx && (
        <div className="tx-modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="tx-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="tx-modal-close" onClick={() => setSelectedTx(null)}>
              <X size={20} />
            </button>

            <div className="tx-modal-header">
              <div className={`tx-modal-icon-wrapper ${selectedTx.type}`}>
                {selectedTx.icon}
              </div>
              <h4 className={`${theme === "dark" ? "color-light" : "color-dark"}`}>Transaction Details</h4>
              <p className={`tx-status-badge ${selectedTx.status.toLowerCase()}`}>
                {selectedTx.status}
              </p>
            </div>

            <div className="tx-modal-body">
              <div className="tx-receipt-amount">
                <span className={selectedTx.type}>{selectedTx.amount}</span>
              </div>

              <div className="tx-info-grid">
                <div className="tx-info-row">
                  <span className="label">Transaction Type</span>
                  <span className={`value ${theme === "dark" ? "color-light" : "color-dark"}`}>{selectedTx.type === 'credit' ? 'Inbound' : 'Outbound'}</span>
                </div>
                <div className="tx-info-row">
                  <span className="label">Category</span>
                  <span className={`value ${theme === "dark" ? "color-light" : "color-dark"}`}>{selectedTx.category}</span>
                </div>
                <div className="tx-info-row">
                  <span className="label">Date & Time</span>
                  <span className={`value ${theme === "dark" ? "color-light" : "color-dark"}`}>{selectedTx.date}</span>
                </div>
                <div className="tx-info-row">
                  <span className="label">Reference</span>
                  <span className={`value ${theme === "dark" ? "color-light" : "color-dark"} ref-code`}>
                    {selectedTx.ref} <Copy size={14} style={{ marginLeft: '4px', cursor: 'pointer' }} />
                  </span>
                </div>
              </div>

              <button className="tx-download-btn">
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;