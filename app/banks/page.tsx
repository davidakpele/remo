'use client';

import { useState, useEffect, MouseEvent } from 'react';
import DepositModal from '@/components/DepositModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import Sidebar from '@/components/Sidebar';
import "./Banks.css";
import { CheckCircle, Trash2Icon, Trash2 } from 'lucide-react';
import LoadingScreen from '@/components/loader/Loadingscreen';

type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  addedDate: string;
};

type NewBankForm = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  currency: string;
};

const Banks = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [bankToDelete, setBankToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [banks, setBanks] = useState<BankAccount[]>([
    { id: '1', bankName: 'GTBANK', accountNumber: '0123456789', accountName: 'Alan Bola', currency: 'NGN', addedDate: '2024-01-15' },
    { id: '2', bankName: 'UBA', accountNumber: '9876543210', accountName: 'Alan Bola', currency: 'NGN', addedDate: '2024-02-20' },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [newBank, setNewBank] = useState<NewBankForm>({
    bankName: '',
    accountNumber: '',
    accountName: 'Alan Bola',
    currency: 'NGN'
  });
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    // Handle page loading
    const loadingTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
  
      return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      if (newBank.accountNumber.length === 10 && newBank.bankName) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
      setLoading(false);
    }, 1000);
  };

  const handleAddBank = () => {
    if (banks.length >= 5) {
      alert('Maximum 5 banks allowed per currency');
      return;
    }
    
    const newBankAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: newBank.bankName,
      accountNumber: newBank.accountNumber,
      accountName: newBank.accountName,
      currency: newBank.currency,
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    setBanks([...banks, newBankAccount]);
    setShowSuccessModal(true);
    
    setTimeout(() => {
      setNewBank({ bankName: '', accountNumber: '', accountName: 'Alan Bola', currency: 'NGN' });
      setShowForm(false);
      setIsValid(null);
    }, 2000);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setNewBank({ bankName: '', accountNumber: '', accountName: 'Alan Bola', currency: 'NGN' });
    setIsValid(null);
  };

  const handleDeleteClick = (bankId: string, e: MouseEvent) => {
    e.stopPropagation();
    setBankToDelete(bankId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (bankToDelete) {
      setBanks(banks.filter(bank => bank.id !== bankToDelete));
    }
    setShowDeleteConfirm(false);
    setBankToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBankToDelete(null);
  };

  const handleBankClick = (bank: BankAccount) => {
    console.log('Selected bank:', bank);
  };

   if (isPageLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className={`main-content ${isDepositOpen ? 'blur-sm' : ''}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />

        <div className="scrollable-content">
          <div className="banks-page">
            <div className="banks-container">
              <div className="banks-grid">
                {/* Left Column */}
                <div className="banks-card">
                  <h1 className="banks-title">Deposit Bank Account</h1>
                  <p className="banks-subtitle">Deposit your funds into your bank account.</p>
                  <p className="banks-note">
                    <span className="note-bold">Note:</span> You are only allowed to add a total of 5 banks per currency
                  </p>

                  {!showForm ? (
                    <button onClick={() => setShowForm(true)} className="add-bank-placeholder">
                      <span className="placeholder-plus">+</span>
                      <span className="placeholder-title">Add New Bank Account</span>
                      <span className="placeholder-subtitle">Click to add a new bank account</span>
                      <span className="placeholder-count">{banks.length}/5 banks added</span>
                    </button>
                  ) : (
                    <div className="add-bank-form">
                      <div className="form-header">
                        <h2 className="form-title">Add New Bank Account</h2>
                        <button onClick={handleCancelForm} className="bank-cancel-btn">Cancel</button>
                      </div>

                      <p className="form-note">
                        <span className="note-bold">NOTE:</span> Accounts added here are solely for deposits and not for withdrawals. 
                        Make sure it is your own account and the account name matches Alan Bola
                      </p>

                      <div className="form-group">
                        <label className="form-label">Select Your Bank</label>
                        <select
                          className="form-select"
                          value={newBank.bankName}
                          onChange={(e) => setNewBank({...newBank, bankName: e.target.value})}
                        >
                          <option value="">Select...</option>
                          <option value="GTBANK">GTBANK</option>
                          <option value="UBA">UBA</option>
                          <option value="Zenith Bank">Zenith Bank</option>
                          <option value="First Bank">First Bank</option>
                          <option value="Access Bank">Access Bank</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Account Number</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter account number"
                            value={newBank.accountNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 10) {
                                setNewBank({...newBank, accountNumber: value});
                              }
                            }}
                            maxLength={10}
                          />
                      </div>

                      {isValid === false && (
                        <p className="error-message">Invalid bank details provided.</p>
                      )}

                      <button
                        onClick={isValid ? handleAddBank : handleSearch}
                        disabled={loading || !newBank.bankName || !newBank.accountNumber}
                        className="mt-3 submit-button"
                      >
                        {loading ? "Checking..." : isValid ? "Add Bank Details" : "Search"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="banks-card">
                  <div className="banks-list-header">
                    <h2 className="banks-title">Your Bank Accounts</h2>
                    <span className="bank-count">{banks.length}/5</span>
                  </div>

                  {banks.length === 0 ? (
                    <div className="empty-state">
                      <p className="empty-title">No bank accounts added yet</p>
                      <p className="empty-subtitle">Add your first bank account using the form</p>
                    </div>
                  ) : (
                    <div className="bank-list-container">
                      <div className="list-section">
                        <div className="mb-3">
                          {banks.map((bank) => (
                            <div key={bank.id} onClick={() => handleBankClick(bank)}>
                              <div className={`currency1 mb-3 bank-item ${theme === "dark" ? "light-background" : "dark-background"}`}>
                                <div 
                                  className="delete-icon-wrapper" 
                                  onClick={(e) => handleDeleteClick(bank.id, e)}
                                  title="Delete bank account"
                                >
                                  <Trash2Icon size={18} />
                                </div>
                                
                                <div className="currency1__img-block">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67" width="30" height="30">
                                    <path d="M7.722 57.657a.75.75 0 0 0-.75.75V64.5c0 .414.336.75.75.75h51.556a.75.75 0 0 0 .75-.75v-6.093a.75.75 0 0 0-.75-.75h-4.325V27.442h4.325a.75.75 0 0 0 .75-.75v-5.35a.75.75 0 0 0-.75-.75h-.187L33.94 1.899a.75.75 0 0 0-.895 0L7.91 20.593h-.187a.75.75 0 0 0-.75.75v5.349c0 .414.336.75.75.75h4.325v30.215H7.722zm50.806 6.093H8.472v-4.593h50.056v4.593zM24.214 27.442v30.215h-5.761V27.442h5.761zm12.167 0v30.215H30.62V27.442h5.761zm12.166 0v30.215h-5.761V27.442h5.761zm-7.261 30.215H37.88V27.442h3.405v30.215zm-12.166 0h-3.406V27.442h3.406v30.215zm24.333 0h-3.406V27.442h3.406v30.215zM33.493 3.435l23.083 17.158H10.423l23.07-17.158zM8.474 22.098h50.055v3.844H8.472v-3.844zm5.074 5.344h3.406v30.215h-3.406V27.442z"></path>
                                    <path d="M33.5 12.448a1.167 1.167 0 0 1-1.166-1.166c0-.653.512-1.165 1.166-1.165.642 0 1.166.523 1.166 1.165a.75.75 0 0 0 1.5 0 2.66 2.66 0 0 0-1.916-2.544v-.415a.75.75 0 0 0-1.5 0v.415a2.66 2.66 0 0 0-1.916 2.544 2.668 2.668 0 0 0 2.666 2.666c.642 0 1.166.523 1.166 1.165s-.524 1.166-1.166 1.166-1.166-.523-1.166-1.166a.75.75 0 0 0-1.5 0 2.66 2.66 0 0 0 1.916 2.545v.477a.75.75 0 0 0 1.5 0v-.477a2.66 2.66 0 0 0 1.916-2.545 2.669 2.669 0 0 0-2.666-2.665z"></path>
                                  </svg>
                                </div>
                                <div className="currency1__main">
                                  <span className="currency1__abbr">{bank.bankName}</span>
                                  <div className="d-flex justify-content-between">
                                    <span className="currency1__name">
                                      {bank.accountName}
                                    </span>
                                    <span className="verified-text">verified</span>
                                  </div>
                                  <span className="currency1__name">{bank.accountNumber}</span>
                                </div>
                                <span className="currency1__check">
                                  <CheckCircle className="check-icon" />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="modal-overlay">
              <div className="modal success-modal">
                <div className="success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="modal-title">Bank Account Added Successfully!</h3>
                <p className="modal-text">Your bank account has been added and verified.</p>
                <button className="modal-btn success-btn" onClick={() => setShowSuccessModal(false)}>Done</button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="modal-overlay">
              <div className="modal delete-modal">
                 <div className="bm-modal-icon delete">
                  <Trash2 size={50} style={{justifyItems:"center",
                     justifyContent:"center",
                      justifySelf:"center",
                      textAlign:"center",}}/>
                    </div>
                 <h3 className="modal-title" style={{textAlign:"center"}}> Delete Bank Account</h3>
                <p className="modal-text">Are you sure you want to delete this bank account? This action cannot be undone.</p>
                <div className="modal-actions">
                  <button className="modal-btn cancel-modal-btn" onClick={cancelDelete}>Cancel</button>
                  <button className="modal-btn delete-btn" onClick={confirmDelete}>Delete</button>
                </div>
              </div>
            </div>
          )}

          <Footer theme={theme} />
        </div>
      </main>

      <MobileNav activeTab="none" onPlusClick={() => setIsDepositOpen(true)} />
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        theme={theme}
        
      />
    </div>
  );
};

export default Banks;