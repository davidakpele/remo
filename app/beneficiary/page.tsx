'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  User, 
  Building2,
  ArrowLeft,
  Filter,
  X
} from 'lucide-react';
import './BeneficiaryManager.css';

interface Beneficiary {
  id: string;
  fullName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  email?: string;
  addedDate: string;
  lastUsed?: string;
}

const BeneficiaryManager = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBank, setFilterBank] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  // Mock beneficiaries data
  const allBeneficiaries: Beneficiary[] = [
    {
      id: '1',
      fullName: 'John Doe',
      accountNumber: '1234567890',
      bankName: 'Access Bank',
      bankCode: '044',
      email: 'john@example.com',
      addedDate: '2024-01-15',
      lastUsed: '2 days ago'
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      accountNumber: '0987654321',
      bankName: 'GTBank',
      bankCode: '058',
      email: 'jane@example.com',
      addedDate: '2024-02-20',
      lastUsed: '1 week ago'
    },
    {
      id: '3',
      fullName: 'Michael Johnson',
      accountNumber: '5678901234',
      bankName: 'Zenith Bank',
      bankCode: '057',
      addedDate: '2024-03-10',
      lastUsed: '3 days ago'
    },
    {
      id: '4',
      fullName: 'Sarah Williams',
      accountNumber: '4321098765',
      bankName: 'First Bank',
      bankCode: '011',
      email: 'sarah@example.com',
      addedDate: '2024-01-05',
      lastUsed: '1 day ago'
    },
    {
      id: '5',
      fullName: 'David Brown',
      accountNumber: '6789012345',
      bankName: 'UBA',
      bankCode: '033',
      addedDate: '2024-02-28',
      lastUsed: '5 days ago'
    },
    {
      id: '6',
      fullName: 'Emily Davis',
      accountNumber: '3456789012',
      bankName: 'Access Bank',
      bankCode: '044',
      email: 'emily@example.com',
      addedDate: '2024-03-15',
      lastUsed: '2 weeks ago'
    }
  ];

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(allBeneficiaries);

  // Get unique banks for filter
  const banks = ['all', ...Array.from(new Set(allBeneficiaries.map(b => b.bankName)))];

  // Filter beneficiaries
  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = 
      beneficiary.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.accountNumber.includes(searchTerm) ||
      beneficiary.bankName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBank = filterBank === 'all' || beneficiary.bankName === filterBank;
    
    return matchesSearch && matchesBank;
  });

  const handleDeleteClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBeneficiary) {
      setBeneficiaries(beneficiaries.filter(b => b.id !== selectedBeneficiary.id));
      setShowDeleteModal(false);
      setSelectedBeneficiary(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedBeneficiary(null);
  };

  const handleBack = () => {
    // Handle navigation back
    console.log('Navigate back');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`beneficiary-manager ${theme}`}>
      {/* Header */}
      <div className="bm-header">
        <div className="bm-header-content">
          <button className="bm-back-btn" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="bm-header-text">
            <h1 className="bm-title">Beneficiary List</h1>
            <p className="bm-subtitle">Manage your saved beneficiaries</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bm-stats-card">
        <div className="bm-stat">
          <div className="bm-stat-icon">
            <User size={24} />
          </div>
          <div className="bm-stat-content">
            <p className="bm-stat-label">Total Beneficiaries</p>
            <h3 className="bm-stat-value">{beneficiaries.length}</h3>
          </div>
        </div>
        <div className="bm-stat">
          <div className="bm-stat-icon">
            <Building2 size={24} />
          </div>
          <div className="bm-stat-content">
            <p className="bm-stat-label">Unique Banks</p>
            <h3 className="bm-stat-value">{banks.length - 1}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bm-controls">
        <div className="bm-search-container">
          <Search size={18} className="bm-search-icon" />
          <input
            type="text"
            placeholder="Search by name, account number, or bank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bm-search-input"
          />
          {searchTerm && (
            <button 
              className="bm-clear-search"
              onClick={() => setSearchTerm('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="bm-filter-container">
          <Filter size={18} className="bm-filter-icon" />
          <select
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
            className="bm-filter-select"
          >
            <option value="all">All Banks</option>
            {banks.slice(1).map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="bm-results-info">
        <p>
          Showing <strong>{filteredBeneficiaries.length}</strong> of{' '}
          <strong>{beneficiaries.length}</strong> beneficiaries
        </p>
      </div>

      {/* Beneficiaries List */}
      {filteredBeneficiaries.length > 0 ? (
        <div className="bm-list">
          {filteredBeneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="bm-list-card">
              <div className="bm-list-left">
                <div className="bm-list-icon">
                  <Building2 size={32} />
                </div>
                <div className="bm-list-content">
                  <div className="bm-list-header">
                    <h3 className="bm-list-bank">{beneficiary.bankName}</h3>
                    <span className="bm-verified-badge">verified</span>
                  </div>
                  <p className="bm-list-name">{beneficiary.fullName}</p>
                  <p className="bm-list-account">{beneficiary.accountNumber}</p>
                </div>
              </div>
              <button
                className="bm-list-delete-btn"
                onClick={() => handleDeleteClick(beneficiary)}
                title="Delete beneficiary"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bm-empty-state">
          <div className="bm-empty-icon">
            <User size={64} />
          </div>
          <h3 className="bm-empty-title">No beneficiaries found</h3>
          <p className="bm-empty-text">
            {searchTerm || filterBank !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'You haven\'t added any beneficiaries yet'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBeneficiary && (
        <>
          <div className="bm-modal-overlay" onClick={handleCancelDelete} />
          <div className="bm-modal">
            <div className="bm-modal-content">
              <div className="bm-modal-icon delete">
                <Trash2 size={48} />
              </div>
              <h3 className="bm-modal-title">Delete Beneficiary</h3>
              <p className="bm-modal-text">
                Are you sure you want to delete <strong>{selectedBeneficiary.fullName}</strong> from your beneficiary list?
              </p>
              <div className="bm-modal-beneficiary-info">
                <p>Account: {selectedBeneficiary.accountNumber}</p>
                <p>Bank: {selectedBeneficiary.bankName}</p>
              </div>
              <div className="bm-modal-actions">
                <button className="bm-btn-secondary" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button className="bm-btn-danger" onClick={handleConfirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BeneficiaryManager;