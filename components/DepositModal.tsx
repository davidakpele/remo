'use client';

import React, { useState, useEffect, Suspense, lazy  } from 'react';
import { X, Landmark, CreditCard, Smartphone, ArrowRight, ShieldCheck, Copy, CheckCircle, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import './DepositModal.css';
import { DepositModalProps } from '@/app/types/utils';

const BankerLoader = lazy(() => import('@/components/BankerLoader'));

const DepositModal = ({ isOpen, onClose, theme }: DepositModalProps) => {
  const [step, setStep] = useState<'selection' | 'bank' | 'card' | 'ussd'>('selection');
  const [bankStep, setBankStep] = useState<'select' | 'details'>('select');
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);

  const userBankAccounts = [
    {
      id: 1,
      bankName: "OPAY DIGITAL SERVICES LIMITED (OPAY)",
      accountName: "DAVID AKPELE",
      accountNumber: "9019384496",
      bankCode: "OPY",
      isVerified: true
    },
    {
      id: 2,
      bankName: "ACCESS BANK PLC",
      accountName: "DAVID AKPELE",
      accountNumber: "0123456789",
      bankCode: "044",
      isVerified: true
    },
    {
      id: 3,
      bankName: "GUARANTY TRUST BANK PLC",
      accountName: "DAVID AKPELE",
      accountNumber: "0987654321",
      bankCode: "058",
      isVerified: true
    },
    {
      id: 4,
      bankName: "ZENITH BANK PLC",
      accountName: "AKPELE DAVID",
      accountNumber: "2234567890",
      bankCode: "057",
      isVerified: false
    }
  ];

  const filteredBanks = userBankAccounts.filter(bank => 
    bank.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.accountNumber.includes(searchQuery)
  );

  const formatNumberWithCommas = (value: string): string => {
    const cleanValue = value.replace(/,/g, '');
    if (!cleanValue) return '';
    const parts = cleanValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStep('selection');
      setBankStep('select');
      setSelectedBank(null);
      setAmount('');
      setRawAmount('');
      setErrors({});
      setSearchQuery('');
      setShowSuccessModal(false);
      setShowFailModal(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  const fetchBanks = async () => {
    setIsLoadingBanks(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoadingBanks(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateAmount = (): boolean => {
    const newErrors: { amount?: string } = {};
    if (!rawAmount || rawAmount.trim() === '') {
      newErrors.amount = 'Please enter an amount';
      setErrors(newErrors);
      return false;
    }
    const numericAmount = parseFloat(rawAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
      setErrors(newErrors);
      return false;
    }
    if (numericAmount < 100) {
      newErrors.amount = 'Minimum deposit amount is ₦100';
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleDeposit = async () => {
    if (!validateAmount()) return;
    setIsProcessing(true);
    try {
      const formattedAmount = parseFloat(rawAmount).toFixed(2);
      
      // Dynamic payload based on deposit method
      let payload: any = {
        userId: "user_12345",
        email: "david@example.com",
        username: "David",
        walletId: "wallet_67890",
        amount: formattedAmount,
        type: "DEPOSIT",
        currencyType: "NGN",
        currencySymbol: "₦",
      };

      // Add method-specific fields
      if (step === 'bank') {
        payload = {
          ...payload,
          depositSystem: "BANK_TRANSFER",
          depositMethod: "BANK",
          accountHolderName: selectedBank.accountName,
          accountNumber: selectedBank.accountNumber,
          bankCode: selectedBank.bankCode,
          bankName: selectedBank.bankName,
          bankAccountId: selectedBank.id,
        };
      } else if (step === 'card') {
        const cardFee = (parseFloat(rawAmount) * 0.015).toFixed(2);
        const totalAmount = (parseFloat(rawAmount) * 1.015).toFixed(2);
        payload = {
          ...payload,
          depositSystem: "CARD",
          depositMethod: "CARD",
          processingFee: cardFee,
          totalAmount: totalAmount,
        };
      } else if (step === 'ussd') {
        payload = {
          ...payload,
          depositSystem: "USSD",
          depositMethod: "USSD",
          ussdCode: `*737*50*${rawAmount}#`,
        };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.3; // 70% success rate
      
      if (isSuccess) {
        console.log('Deposit Payload:', payload);
        setShowSuccessModal(true);
      } else {
        throw new Error('Network error occurred. Please try again.');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "An unexpected error occurred";
      setErrorMessage(message);
      setShowFailModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue.replace(/,/g, ''))) {
      const rawValue = inputValue.replace(/,/g, '');
      setRawAmount(rawValue);
      setAmount(formatNumberWithCommas(inputValue));
      if (errors.amount) {
        setErrors({});
      }
    }
  };

  const handleQuickAmount = (value: string) => {
    const rawValue = value.replace(/,/g, '');
    setRawAmount(rawValue);
    setAmount(formatNumberWithCommas(value));
    if (errors.amount) {
      setErrors({});
    }
  };

  const handleBack = () => {
    if (step === 'bank' && bankStep === 'details') {
      setBankStep('select');
      setAmount('');
      setRawAmount('');
      setErrors({});
    } else {
      setStep('selection');
      setBankStep('select');
      setSelectedBank(null);
      setAmount('');
      setRawAmount('');
      setErrors({});
      setSearchQuery('');
    }
  };

  const handleBankClick = (bank: any) => {
    if (selectedBank?.id === bank.id) {
      setSelectedBank(null);
    } else {
      setSelectedBank(bank);
      setBankStep('details');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleFailClose = () => {
    setShowFailModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`deposit-drawer ${isOpen ? 'open' : ''} ${theme}`}>
        <div className="drawer-header">
          <div className="header-content">
            {(step !== 'selection') && (
              <button className="back-button" onClick={handleBack}>
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="header-icon-wrapper">
              {step === 'selection' ? <Landmark size={20} /> : 
               step === 'bank' ? <Landmark size={20} /> :
               step === 'card' ? <CreditCard size={20} /> :
               <Smartphone size={20} />}
            </div>
            <div>
              <h2 className="drawer-title">
                {step === 'selection' ? 'Fund Your Wallet' :
                 step === 'bank' && bankStep === 'select' ? 'Select Bank Account' :
                 step === 'bank' && bankStep === 'details' ? 'Bank Transfer' :
                 step === 'card' ? 'Debit Card' :
                 'USSD Deposit'}
              </h2>
              <p className="drawer-subtitle">
                {step === 'selection' ? 'Choose your preferred deposit method' :
                 step === 'bank' && bankStep === 'select' ? 'Choose which account to fund' :
                 step === 'bank' && bankStep === 'details' ? 'Transfer to your unique account number' :
                 step === 'card' ? 'Top up instantly using your card' :
                 'Dial a code to deposit from your bank'}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="drawer-body">
          {step === 'selection' ? (
            <div className="options-list">
              <div className="deposit-option-card" onClick={async () => {
                setStep('bank');
                await fetchBanks();
              }}>
                <div className="option-icon-wrapper blue-bg">
                  <Landmark size={24} />
                </div>
                <div className="option-content">
                  <h4 className="option-title">Bank Transfer</h4>
                  <p className="option-desc">Deposit via your unique account number</p>
                </div>
                <ArrowRight size={20} className="option-arrow" />
              </div>
              <div className="deposit-option-card" onClick={() => setStep('card')}>
                <div className="option-icon-wrapper green-bg">
                  <CreditCard size={24} />
                </div>
                <div className="option-content">
                  <h4 className="option-title">Debit Card</h4>
                  <p className="option-desc">Top up instantly using your card</p>
                </div>
                <ArrowRight size={20} className="option-arrow" />
              </div>
              <div className="deposit-option-card" onClick={() => setStep('ussd')}>
                <div className="option-icon-wrapper orange-bg">
                  <Smartphone size={24} />
                </div>
                <div className="option-content">
                  <h4 className="option-title">USSD</h4>
                  <p className="option-desc">Dial a code to deposit from your bank</p>
                </div>
                <ArrowRight size={20} className="option-arrow" />
              </div>
            </div>
          ) : step === 'bank' && bankStep === 'select' ? (
            <>
              {isLoadingBanks ? (
                  <Suspense>
                    <BankerLoader />
                  </Suspense>
              ) : (
                <>
                  <div className="search-container">
                    <div className="search-input-wrapper">
                      <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                      <input 
                        type="text" 
                        className="search-input"
                        placeholder="Search by bank name, account name, or number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="bank-accounts-list">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <div 
                          key={bank.id} 
                          className={`bank-account-item ${selectedBank?.id === bank.id ? 'selected' : ''}`}
                          onClick={() => handleBankClick(bank)}
                        >
                          <div className="bank-icon-box">
                            {selectedBank?.id === bank.id ? <CheckCircle size={20} className="selected-check" /> : <Landmark size={20} />}
                          </div>
                          <div className="bank-account-info">
                            <h4 className="bank-name">{bank.bankName}</h4>
                            <p className="account-holder">{bank.accountName}</p>
                            <p className="account-number">{bank.accountNumber}</p>
                          </div>
                          {bank.isVerified && (
                            <div className="verified-badge">
                              <ShieldCheck size={14} />
                              <span>verified</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-results">
                        <Landmark size={40} className="no-results-icon" />
                        <p className="no-results-text">No bank accounts found</p>
                        <p className="no-results-subtext">Try a different search term</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : step === 'bank' && bankStep === 'details' ? (
            <>
              <div className="info-card">
                <div className="info-header">
                  <ShieldCheck size={18} className="shield-icon" />
                  <span>Bank Transfer Details</span>
                </div>
                <div className="bank-detail-row">
                  <div className="detail-icon-box">
                    <Landmark size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Bank Name</span>
                    <p className="detail-value">{selectedBank?.bankName}</p>
                  </div>
                </div>
                <div className="bank-detail-row">
                  <div className="detail-icon-box">
                    <CreditCard size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Account Number</span>
                    <div className="detail-value-row">
                      <p className="detail-value">{selectedBank?.accountNumber}</p>
                      <button className="copy-button" onClick={() => handleCopy(selectedBank?.accountNumber)}>
                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bank-detail-row">
                  <div className="detail-icon-box">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Account Name</span>
                    <p className="detail-value">{selectedBank?.accountName}</p>
                  </div>
                </div>
              </div>
              <div className="amount-section">
                <label className="section-label">Enter Amount</label>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">₦</span>
                  <input 
                    type="text" 
                    className={`amount-input ${errors.amount ? 'error' : ''}`}
                    placeholder="0.00" 
                    value={amount} 
                    onChange={handleAmountChange}
                    disabled={isProcessing}
                  />
                </div>
                {errors.amount && <span className="error-message">{errors.amount}</span>}
                <div className="quick-amounts">
                  {['50,000', '100,000', '200,000', '500,000', '1,000,000'].map(val => (
                    <button key={val} className="quick-amount-btn" onClick={() => handleQuickAmount(val)} disabled={isProcessing}>₦{val}</button>
                  ))}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-row">
                  <span className="summary-label">Amount</span>
                  <span className="summary-value">₦{amount || '0.00'}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span className="summary-label">Total to Deposit</span>
                  <span className="summary-value total-value">₦{amount || '0.00'}</span>
                </div>
              </div>
            </>
          ) : step === 'card' ? (
            <>
              <div className="info-card">
                <div className="info-header">
                  <CreditCard size={18} className="shield-icon" />
                  <span>Card Payment</span>
                </div>
                <p className="card-info-text">Enter the amount you want to deposit. You'll be redirected to complete the card payment securely.</p>
              </div>
              <div className="amount-section">
                <label className="section-label">Enter Amount</label>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">₦</span>
                  <input 
                    type="text" 
                    className={`amount-input ${errors.amount ? 'error' : ''}`}
                    placeholder="0.00" 
                    value={amount} 
                    onChange={handleAmountChange}
                    disabled={isProcessing}
                  />
                </div>
                {errors.amount && <span className="error-message">{errors.amount}</span>}
                <div className="quick-amounts">
                  {['50,000', '100,000', '200,000', '500,000', '1,000,000'].map(val => (
                    <button key={val} className="quick-amount-btn" onClick={() => handleQuickAmount(val)} disabled={isProcessing}>₦{val}</button>
                  ))}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-row">
                  <span className="summary-label">Amount</span>
                  <span className="summary-value">₦{amount || '0.00'}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Card Processing Fee (1.5%)</span>
                  <span className="summary-value">₦{rawAmount ? (parseFloat(rawAmount) * 0.015).toFixed(2) : '0.00'}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span className="summary-label">Total to Pay</span>
                  <span className="summary-value total-value">
                    ₦{rawAmount ? formatNumberWithCommas((parseFloat(rawAmount) * 1.015).toFixed(2)) : '0.00'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="info-card">
                <div className="info-header">
                  <Smartphone size={18} className="shield-icon" />
                  <span>USSD Deposit</span>
                </div>
                <p className="card-info-text">Dial the USSD code from your registered phone number to complete this deposit.</p>
                <div className="ussd-code-box">
                  <span className="ussd-label">USSD Code</span>
                  <div className="ussd-code-display">
                    <span className="ussd-code">*737*50*{rawAmount || 'AMOUNT'}#</span>
                    <button className="copy-button-small" onClick={() => handleCopy(`*737*50*${rawAmount || '0'}#`)}>
                      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="amount-section">
                <label className="section-label">Enter Amount</label>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">₦</span>
                  <input 
                    type="text" 
                    className={`amount-input ${errors.amount ? 'error' : ''}`}
                    placeholder="0.00" 
                    value={amount} 
                    onChange={handleAmountChange}
                    disabled={isProcessing}
                  />
                </div>
                {errors.amount && <span className="error-message">{errors.amount}</span>}
                <div className="quick-amounts">
                  {['50,000', '100,000', '200,000', '500,000', '1,000,000'].map(val => (
                    <button key={val} className="quick-amount-btn" onClick={() => handleQuickAmount(val)} disabled={isProcessing}>₦{val}</button>
                  ))}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-row">
                  <span className="summary-label">Amount</span>
                  <span className="summary-value">₦{amount || '0.00'}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span className="summary-label">Total to Deposit</span>
                  <span className="summary-value total-value">₦{amount || '0.00'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {step !== 'selection' && !(step === 'bank' && bankStep === 'select') && (
          <div className="drawer-footer">
            <div className="security-note">
              <ShieldCheck size={14} />
              <span>Secured with 256-bit encryption</span>
            </div>
            <div className="footer-buttons">
              <button className="cancel-btn" onClick={handleBack} disabled={isProcessing}>Back</button>
              <button className="confirm-btn" onClick={handleDeposit} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Complete Deposit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="status-modal-overlay" onClick={handleSuccessClose} />
          <div className={`status-modal success-modal ${theme}`}>
            <div className="status-modal-content">
              <div className="status-icon-wrapper success-icon">
                <CheckCircle size={48} />
              </div>
              <h3 className="status-modal-title">Deposit Successful!</h3>
              <p className="status-modal-message">
                Your deposit of ₦{amount} has been processed successfully. 
                The funds will reflect in your wallet shortly.
              </p>
              <div className="status-modal-details">
                <div className="status-detail-row">
                  <span className="status-detail-label">Amount</span>
                  <span className="status-detail-value">₦{amount}</span>
                </div>
                <div className="status-detail-row">
                  <span className="status-detail-label">Method</span>
                  <span className="status-detail-value">
                    {step === 'bank' ? 'Bank Transfer' : step === 'card' ? 'Debit Card' : 'USSD'}
                  </span>
                </div>
              </div>
              <button className="status-modal-btn success-btn" onClick={handleSuccessClose}>
                Done
              </button>
            </div>
          </div>
        </>
      )}

      {/* Failure Modal */}
      {showFailModal && (
        <>
          <div className="status-modal-overlay" onClick={handleFailClose} />
          <div className={`status-modal fail-modal ${theme}`}>
            <div className="status-modal-content">
              <div className="status-icon-wrapper fail-icon">
                <AlertCircle size={48} />
              </div>
              <h3 className="status-modal-title">Deposit Failed</h3>
              <p className="status-modal-message">
                {errorMessage}
              </p>
              <div className="status-modal-actions">
                <button className="status-modal-btn secondary-btn" onClick={handleFailClose}>
                  Cancel
                </button>
                <button className="status-modal-btn fail-btn" onClick={() => {
                  setShowFailModal(false);
                  handleDeposit();
                }}>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DepositModal;