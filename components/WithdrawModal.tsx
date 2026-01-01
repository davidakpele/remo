'use client';

import React, { useState, useEffect, Suspense, lazy, useRef} from 'react';
import { X, Landmark, Wallet, User, ArrowRight, ShieldCheck, Lock, ArrowLeft, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import Select from 'react-select';
import './WithdrawModal.css';
import { Bank, WalletType, WithdrawModalProps } from '@/app/types/utils';
import { getIdempotencyKey } from '@/app/lib/auth';

const BankerLoader = lazy(() => import('@/components/BankerLoader'));

// Currency configuration
interface Currency {
  name: string;
  code: string;
  symbol: string;
  decimalDigits: number;
  minWithdrawal: number;
  bankFeePercentage: number;
  epayFeePercentage: number;
  minFee: number;
}

const currencies: Currency[] = [
  { name: "US Dollar", code: "USD", symbol: "$", decimalDigits: 2, minWithdrawal: 10, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 0.50 },
  { name: "Euro", code: "EUR", symbol: "€", decimalDigits: 2, minWithdrawal: 10, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 0.50 },
  { name: "Nigerian Naira", code: "NGN", symbol: "₦", decimalDigits: 2, minWithdrawal: 100, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 100 },
  { name: "British Pound", code: "GBP", symbol: "£", decimalDigits: 2, minWithdrawal: 10, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 0.50 },
  { name: "Japanese Yen", code: "JPY", symbol: "¥", decimalDigits: 0, minWithdrawal: 50, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 100 },
  { name: "Australian Dollar", code: "AUD", symbol: "$", decimalDigits: 2, minWithdrawal: 10, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 0.50 },
  { name: "Canadian Dollar", code: "CAD", symbol: "$", decimalDigits: 2, minWithdrawal: 10, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 0.50 },
  { name: "Swiss Franc", code: "CHF", symbol: "Fr", decimalDigits: 2, minWithdrawal: 10, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 0.50 },
  { name: "Chinese Yuan", code: "CNY", symbol: "¥", decimalDigits: 2, minWithdrawal: 100, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 1 },
  { name: "Indian Rupee", code: "INR", symbol: "₹", decimalDigits: 2, minWithdrawal: 100, bankFeePercentage: 0.5, epayFeePercentage: 0.1, minFee: 1 },
];

// React Select custom styles
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'white',
    borderColor: state.isFocused ? '#dc2626' : '#e2e8f0',
    borderRadius: '10px',
    padding: '2px 8px',
    minHeight: '48px',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(220, 38, 38, 0.1)' : 'none',
    borderWidth: '2px',
    '&:hover': {
      borderColor: state.isFocused ? '#dc2626' : '#cbd5e1'
    },
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#fef2f2' : 'white',
    color: state.isSelected ? 'white' : state.isFocused ? '#dc2626' : '#334155',
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    '&:active': {
      backgroundColor: '#b91c1c'
    }
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 9999,
    marginTop: '4px'
  }),
  menuList: (base: any) => ({
    ...base,
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '10px'
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#0f172a',
    fontSize: '14px'
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#94a3b8',
    fontSize: '14px'
  }),
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    color: state.isFocused ? '#dc2626' : '#94a3b8',
    padding: '8px',
    '&:hover': {
      color: '#dc2626'
    }
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    backgroundColor: '#e2e8f0'
  }),
  loadingIndicator: (base: any) => ({
    ...base,
    color: '#dc2626'
  }),
  input: (base: any) => ({
    ...base,
    color: '#0f172a'
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: '2px 8px'
  })
};

// Dark theme styles
const customStylesDark = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: '#0f172a',
    borderColor: state.isFocused ? '#dc2626' : '#334155',
    borderRadius: '10px',
    padding: '2px 8px',
    minHeight: '48px',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(220, 38, 38, 0.2)' : 'none',
    borderWidth: '2px',
    '&:hover': {
      borderColor: state.isFocused ? '#dc2626' : '#475569'
    }
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#1e293b' : '#0f172a',
    color: state.isSelected ? 'white' : state.isFocused ? '#f1f5f9' : '#cbd5e1',
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    '&:active': {
      backgroundColor: '#b91c1c'
    }
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#1e293b',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
    marginTop: '4px'
  }),
  menuList: (base: any) => ({
    ...base,
    padding: '8px',
    backgroundColor: '#1e293b',
    borderRadius: '10px'
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#f1f5f9'
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#64748b'
  }),
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    color: state.isFocused ? '#dc2626' : '#64748b',
    '&:hover': {
      color: '#dc2626'
    }
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    backgroundColor: '#334155'
  }),
  loadingIndicator: (base: any) => ({
    ...base,
    color: '#dc2626'
  }),
  input: (base: any) => ({
    ...base,
    color: '#f1f5f9'
  })
};

const WithdrawModal = ({ isOpen, onClose, theme = 'light' }: WithdrawModalProps) => {
  const [step, setStep] = useState<'selection' | 'bank' | 'epay'>('selection');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [amount, setAmount] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientUsername, setRecipientUsername] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [selectedBankOption, setSelectedBankOption] = useState<any>(null);
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);
  const idempotencyKeyRef = useRef<string | null>(null);
  const [pendingTransaction, setPendingTransaction] = useState(false);
  // User wallets with all currencies
  const userWallets: WalletType[] = [
    {
      id: 1,
      name: 'Main Wallet',
      balance: 1500000,
      currency: 'NGN',
      isDefault: true
    },
    {
      id: 2,
      name: 'Savings Wallet',
      balance: 500000,
      currency: 'NGN',
      isDefault: false
    },
    {
      id: 3,
      name: 'USD Wallet',
      balance: 5000,
      currency: 'USD',
      isDefault: false
    },
    {
      id: 4,
      name: 'Euro Wallet',
      balance: 3000,
      currency: 'EUR',
      isDefault: false
    },
    {
      id: 5,
      name: 'GBP Wallet',
      balance: 2000,
      currency: 'GBP',
      isDefault: false
    },
    {
      id: 6,
      name: 'Yen Wallet',
      balance: 500000,
      currency: 'JPY',
      isDefault: false
    },
    {
      id: 7,
      name: 'AUD Wallet',
      balance: 3000,
      currency: 'AUD',
      isDefault: false
    },
    {
      id: 8,
      name: 'CAD Wallet',
      balance: 2500,
      currency: 'CAD',
      isDefault: false
    },
    {
      id: 9,
      name: 'CHF Wallet',
      balance: 2800,
      currency: 'CHF',
      isDefault: false
    },
    {
      id: 10,
      name: 'Yuan Wallet',
      balance: 20000,
      currency: 'CNY',
      isDefault: false
    },
    {
      id: 11,
      name: 'INR Wallet',
      balance: 150000,
      currency: 'INR',
      isDefault: false
    }
  ];

  // Bank list with react-select options format
  const bankOptions = [
    { value: '044', label: 'Access Bank' },
    { value: '058', label: 'Guaranty Trust Bank' },
    { value: '057', label: 'Zenith Bank' },
    { value: '011', label: 'First Bank' },
    { value: '033', label: 'United Bank for Africa' },
    { value: '039', label: 'Stanbic IBTC Bank' },
    { value: '214', label: 'First City Monument Bank' },
    { value: '032', label: 'Union Bank' },
    { value: '232', label: 'Sterling Bank' },
    { value: '035', label: 'Wema Bank' },
    { value: '050', label: 'Ecobank' },
    { value: '030', label: 'Heritage Bank' },
    { value: '215', label: 'Unity Bank' },
    { value: '082', label: 'Keystone Bank' },
    { value: 'OPY', label: 'OPay' },
    { value: 'KDA', label: 'Kuda Bank' },
    { value: 'PAL', label: 'Palmpay' },
  ];

  const getCurrencyInfo = (currencyCode: string): Currency => {
    return currencies.find(c => c.code === currencyCode) || currencies[2];
  };

  const formatNumberWithCommas = (value: string): string => {
    const cleanValue = value.replace(/,/g, '');
    if (!cleanValue) return '';
    
    const currency = selectedWallet ? getCurrencyInfo(selectedWallet.currency) : currencies[2];
    const parts = cleanValue.split('.');
    
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    if (parts[1]) {
      parts[1] = parts[1].slice(0, currency.decimalDigits);
    }
    
    return parts.join('.');
  };

  const formatBalance = (balance: number, currencyCode: string): string => {
    const currency = getCurrencyInfo(currencyCode);
    const formattedBalance = balance.toLocaleString('en-US', {
      minimumFractionDigits: currency.decimalDigits,
      maximumFractionDigits: currency.decimalDigits
    });
    return `${currency.symbol}${formattedBalance}`;
  };

  const calculateProcessingFee = () => {
    if (!rawAmount || !selectedWallet) return 0;
    
    const amountNum = parseFloat(rawAmount);
    if (isNaN(amountNum)) return 0;
    
    const currency = getCurrencyInfo(selectedWallet.currency);
    
    if (step === 'bank') {
      const fee = (amountNum * currency.bankFeePercentage) / 100;
      return fee < currency.minFee ? currency.minFee : fee;
    } else {
      const fee = (amountNum * currency.epayFeePercentage) / 100;
      return fee < currency.minFee ? currency.minFee : fee;
    }
  };

  const calculateTotal = () => {
    if (!rawAmount) return 0;
    const amountNum = parseFloat(rawAmount);
    if (isNaN(amountNum)) return 0;
    const fee = calculateProcessingFee();
    return amountNum + fee;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const defaultWallet = userWallets.find(w => w.isDefault);
      if (defaultWallet) {
        setSelectedWallet(defaultWallet);
      }
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
      setSelectedBank(null);
      setAmount('');
      setRawAmount('');
      setAccountNumber('');
      setRecipientUsername('');
      setErrors({});
      setShowPinModal(false);
      setPin(['', '', '', '']);
      setShowSuccessModal(false);
      setShowFailModal(false);
      setErrorMessage('');
      setBankName('');
      setAccountName('');
      setSelectedBankOption(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchUserBanks = async () => {
      setIsLoadingBanks(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userBanks: Bank[] = [
        {
          id: 1,
          bankName: "ACCESS BANK PLC",
          accountName: "DAVID AKPELE",
          accountNumber: "0123456789",
          bankCode: "044",
          isVerified: true
        },
        {
          id: 2,
          bankName: "GUARANTY TRUST BANK PLC",
          accountName: "DAVID AKPELE",
          accountNumber: "0987654321",
          bankCode: "058",
          isVerified: true
        },
        {
          id: 3,
          bankName: "ZENITH BANK PLC",
          accountName: "AKPELE DAVID",
          accountNumber: "2234567890",
          bankCode: "057",
          isVerified: false
        }
      ];
      setBanks(userBanks);
      setIsLoadingBanks(false);
    };

    if (step === 'bank') {
      fetchUserBanks();
    }
  }, [step]);

  const generateIdempotencyKey = () => {
    const newKey = getIdempotencyKey();
    idempotencyKeyRef.current = newKey;
    return newKey;
  };

  const clearIdempotencyKey = () => {
    idempotencyKeyRef.current = null;
    setPendingTransaction(false);
  };

  const hasPendingTransaction = () => {
    return pendingTransaction && idempotencyKeyRef.current !== null;
  };

  const handleQuickAmount = (value: string) => {
    const rawValue = value.replace(/,/g, '');
    setRawAmount(rawValue);
    setAmount(formatNumberWithCommas(value));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const refactorAmount = (value: string): string => {
    return formatNumberWithCommas(value.replace(/,/g, ''));
  };


  const resetTransactionState = () => {
    clearIdempotencyKey();
    generateIdempotencyKey();
    setPendingTransaction(false);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (pendingTransaction) {
      timeout = setTimeout(() => {
        if (pendingTransaction) {
          console.warn('Auto-resetting pending transaction state after timeout');
          resetTransactionState();
          setErrorMessage('Transaction was reset due to timeout. You can retry now.');
        }
      }, 2 * 60 * 1000); 
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [pendingTransaction]);

  useEffect(() => {
    if (isOpen) {
      generateIdempotencyKey();
      setPendingTransaction(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      clearIdempotencyKey();
    }
  }, [isOpen]);


  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedWallet) {
      newErrors.wallet = 'Please select a wallet';
    }

    if (!rawAmount || rawAmount.trim() === '') {
      newErrors.amount = 'Please enter an amount';
    } else {
      const numericAmount = parseFloat(rawAmount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        newErrors.amount = 'Please enter a valid amount greater than 0';
      } else if (numericAmount > (selectedWallet?.balance || 0)) {
        newErrors.amount = 'Insufficient balance in selected wallet';
      } else if (selectedWallet) {
        const currency = getCurrencyInfo(selectedWallet.currency);
        if (numericAmount < currency.minWithdrawal) {
          newErrors.amount = `Minimum withdrawal amount is ${currency.symbol}${currency.minWithdrawal}`;
        }
      }
    }

    if (step === 'bank') {
      if (!bankName) {
        newErrors.bankName = 'Please select a bank';
      }
      if (!accountNumber || accountNumber.trim().length < 10) {
        newErrors.accountNumber = 'Please enter a valid account number';
      }
    } else if (step === 'epay') {
      if (!recipientUsername || recipientUsername.trim().length < 3) {
        newErrors.recipientUsername = 'Please enter a valid recipient username';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue.replace(/,/g, ''))) {
      const rawValue = inputValue.replace(/,/g, '');
      
      if (selectedWallet) {
        const currency = getCurrencyInfo(selectedWallet.currency);
        const parts = rawValue.split('.');
        if (parts[1] && parts[1].length > currency.decimalDigits) {
          return;
        }
      }
      
      setRawAmount(rawValue);
      setAmount(formatNumberWithCommas(inputValue));
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: '' }));
      }
    }
  };

  const handleBankChange = (selectedOption: any) => {
    setSelectedBankOption(selectedOption);
    setBankName(selectedOption ? selectedOption.label : '');
    if (errors.bankName) {
      setErrors(prev => ({ ...prev, bankName: '' }));
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleBack = () => {
    if (hasPendingTransaction()) {
      setErrorMessage('Cannot close while transaction is in progress');
      return;
    }
    if (showPinModal) {
      setShowPinModal(false);
      setPin(['', '', '', '']);
    } else if (step !== 'selection') {
      setStep('selection');
      setSelectedBank(null);
      setAmount('');
      setRawAmount('');
      setAccountNumber('');
      setRecipientUsername('');
      setErrors({});
      setSelectedBankOption(null);
    } else {
      onClose();
    }
  };

  const handleWithdraw = async () => {
    if (!validateForm()) return;
    
    if (hasPendingTransaction()) {
      setErrorMessage('Duplicate transfer detected! Please wait for the current transaction to complete.');
      return;
    }
    
    setShowPinModal(true);
  };

  const handlePinSubmit = async () => {
    setShowPinModal(false);
    const enteredPin = pin.join('');
    if (enteredPin.length !== 4) {
      setErrorMessage('Please enter a 4-digit PIN');
      return;
    }

    if (hasPendingTransaction()) {
      setErrorMessage('Transaction already in progress');
      return;
    }

    setPendingTransaction(true);
    setIsProcessing(true);
    setIsSubmittingPin(true);
    
    try {
      const payload = {
        userId: "user_12345",
        walletId: selectedWallet?.id,
        amount: rawAmount,
        currency: selectedWallet?.currency,
        processingFee: calculateProcessingFee(),
        totalAmount: calculateTotal(),
        method: step === 'bank' ? 'BANK_TRANSFER' : 'EPAY_TRANSFER',
        ...(step === 'bank' ? {
          bankName,
          accountNumber,
          accountName,
        } : {
          recipientUsername,
        }),
        pin: enteredPin,
        idempotencyKey: idempotencyKeyRef.current,
        timestamp: new Date().toISOString(),
      };

      console.log('Withdrawal Payload:', payload);
      await new Promise(resolve => setTimeout(resolve, 2000));

        setShowSuccessModal(true);
        setShowPinModal(false);
        generateIdempotencyKey();
        setPendingTransaction(false);
        
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "An unexpected error occurred";
      setErrorMessage(message);
      setShowFailModal(true);
      setShowPinModal(false);
    } finally {
      setIsProcessing(false);
      setIsSubmittingPin(false);
      setPin(['', '', '', '']);
      if (!pendingTransaction) {
        clearIdempotencyKey();
      }
    }
  };

  const renderTransactionStatus = () => {
    if (hasPendingTransaction()) {
      return (
        <div className="transaction-status">
          <div className="status-warning">
            <div className="spinner-small" />
            <span>Transaction in progress... Please don't close this window.</span>
          </div>
          <button 
            className="reset-transaction-btn"
            onClick={resetTransactionState}
            type="button"
            disabled={isProcessing}
          >
            Reset Transaction
          </button>
        </div>
      );
    }
    return null;
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleFailClose = () => {
    setShowFailModal(false);
  };

  const resolveAccountNumber = async (bankCode: string, accNum: string) => {
    if (!bankCode || !accNum || accNum.length < 10) return;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (accNum === '0123456789') {
      setAccountName('DAVID AKPELE');
    } else if (accNum === '0987654321') {
      setAccountName('JOHN DOE');
    } else {
      setAccountName('UNKNOWN ACCOUNT');
    }
  };

  useEffect(() => {
    if (selectedBankOption && accountNumber.length >= 10) {
      resolveAccountNumber(selectedBankOption.value, accountNumber);
    }
  }, [selectedBankOption, accountNumber]);

  const availableWallets = userWallets.filter(wallet => wallet.name !== 'Savings Wallet');

  if (!isOpen) return null;

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`withdraw-drawer ${isOpen ? 'open' : ''} ${theme}`}>
        <div className="drawer-header">
          <div className="header-content">
            {step !== 'selection' && (
              <button className="back-button" onClick={handleBack}>
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="header-icon-wrapper">
              {step === 'selection' ? <Wallet size={20} /> : 
               step === 'bank' ? <Landmark size={20} /> :
               <User size={20} />}
            </div>
            <div>
              <h2 className="drawer-title">
                {step === 'selection' ? 'Withdraw Funds' :
                 step === 'bank' ? 'Transfer to Bank' :
                 'Transfer to Epay Account'}
              </h2>
              <p className="drawer-subtitle">
                {step === 'selection' ? 'Choose your withdrawal method' :
                 step === 'bank' ? 'Withdraw funds to your bank account' :
                 'Transfer to another epay user'}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>
        <div className="drawer-main-section">
          <div className="drawer-body">
            {step === 'selection' ? (
              <div className="options-list">
                <div className="withdraw-option-card" onClick={() => setStep('bank')}>
                  <div className="option-icon-wrapper blue-bg">
                    <Landmark size={24} />
                  </div>
                  <div className="option-content">
                    <h4 className="option-title">Transfer to Bank</h4>
                    <p className="option-desc">Withdraw funds to your bank account</p>
                  </div>
                  <ArrowRight size={20} className="option-arrow" />
                </div>
                <div className="withdraw-option-card" onClick={() => setStep('epay')}>
                  <div className="option-icon-wrapper green-bg">
                    <User size={24} />
                  </div>
                  <div className="option-content">
                    <h4 className="option-title">Transfer to Epay Account</h4>
                    <p className="option-desc">Send funds to another epay user</p>
                  </div>
                  <ArrowRight size={20} className="option-arrow" />
                </div>
              </div>
            ) : step === 'bank' ? (
              <>
                <div className="wallet-selector">
                  <label className="section-label" style={{marginBottom:"5px"}}>From Wallet</label>
                  <button 
                    className="wallet-select-btn"
                    onClick={() => setShowWalletModal(true)}
                  >
                    {selectedWallet ? (
                      <div className="wallet-info">
                        <Wallet size={16} />
                        <span className="wallet-name">{selectedWallet.name}</span>
                        <span className="wallet-balance">
                          {formatBalance(selectedWallet.balance, selectedWallet.currency)}
                        </span>
                      </div>
                    ) : (
                      <div className="wallet-info">
                        <Wallet size={16} />
                        <span>Select Wallet</span>
                      </div>
                    )}
                    <ChevronDown size={18} />
                  </button>
                  {errors.wallet && <span className="error-message">{errors.wallet}</span>}
                </div>

                <div className="form-section">
                  <label className="section-label" style={{marginBottom:"5px"}}>Bank Name</label>
                  <Select
                    options={bankOptions}
                    value={selectedBankOption}
                    onChange={handleBankChange}
                    isDisabled={isProcessing}
                    isLoading={isLoadingBanks}
                    styles={theme === 'dark' ? customStylesDark : customStyles}
                    placeholder={isLoadingBanks ? "Loading banks..." : "Select Bank"}
                    noOptionsMessage={() => "No banks available"}
                    className={`react-select-container ${errors.bankName ? 'error-form' : ''}`}
                    classNamePrefix="react-select"
                  />
                  {errors.bankName && <span className="error-message">{errors.bankName}</span>}
                </div>

                <div className="form-section">
                  <label className="section-label" style={{marginBottom:"5px"}}>Account Number</label>
                  <input
                    type="text"
                    className={`form-input ${errors.accountNumber ? 'error' : ''}`}
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setAccountNumber(value);
                      if (errors.accountNumber) {
                        setErrors(prev => ({ ...prev, accountNumber: '' }));
                      }
                    }}
                    maxLength={10}
                    disabled={isProcessing}
                  />
                  {errors.accountNumber && <span className="error-message">{errors.accountNumber}</span>}
                </div>

                <div className="form-section">
                  <label className="section-label" style={{marginBottom:"5px"}}>Account Name</label>
                  <input
                    type="text"
                    className="form-input disabled"
                    value={accountName}
                    placeholder="Will auto-fill from account number"
                    disabled
                  />
                </div>
              </>
            ) : step === 'epay' ? (
              <>
                <div className="wallet-selector">
                  <label className="section-label" style={{marginBottom:"5px"}}>From Wallet</label>
                  <button 
                    className="wallet-select-btn"
                    onClick={() => setShowWalletModal(true)}
                  >
                    {selectedWallet ? (
                      <div className="wallet-info">
                        <Wallet size={16} />
                        <span className="wallet-name">{selectedWallet.name}</span>
                        <span className="wallet-balance">
                          {formatBalance(selectedWallet.balance, selectedWallet.currency)}
                        </span>
                      </div>
                    ) : (
                      <div className="wallet-info">
                        <Wallet size={16} />
                        <span>Select Wallet</span>
                      </div>
                    )}
                    <ChevronDown size={18} />
                  </button>
                  {errors.wallet && <span className="error-message">{errors.wallet}</span>}
                </div>

                <div className="form-section">
                  <label className="section-label" style={{marginBottom:"5px"}}>Recipient Username</label>
                  <input
                    type="text"
                    className={`form-input ${errors.recipientUsername ? 'error' : ''}`}
                    placeholder="Enter recipient's username"
                    value={recipientUsername}
                    onChange={(e) => {
                      setRecipientUsername(e.target.value);
                      if (errors.recipientUsername) {
                        setErrors(prev => ({ ...prev, recipientUsername: '' }));
                      }
                    }}
                    disabled={isProcessing}
                  />
                  {errors.recipientUsername && <span className="error-message">{errors.recipientUsername}</span>}
                </div>
              </>
            ) : null}

            {(step === 'bank' || step === 'epay') && (
              <>
                <div className="amount-section">
                  <label className="section-label" htmlFor='amount'>Amount</label>
                  <div className="amount-input-wrapper">
                    <span className="currency-symbol">
                      {selectedWallet ? getCurrencyInfo(selectedWallet.currency).symbol : '₦'}
                    </span>
                    <input
                      name='amount'
                      id='amount'
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
                    <span className="summary-value">
                      {selectedWallet ? getCurrencyInfo(selectedWallet.currency).symbol : '₦'}{amount || '0.00'}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Processing Fee</span>
                    <span className="summary-value">
                      {selectedWallet ? getCurrencyInfo(selectedWallet.currency).symbol : '₦'}{calculateProcessingFee().toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row total-row">
                    <span className="summary-label">Total to Withdraw</span>
                    <span className="summary-value total-value">
                      {selectedWallet ? getCurrencyInfo(selectedWallet.currency).symbol : '₦'}{refactorAmount(calculateTotal().toFixed(2))}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {step !== 'selection' && (
            <div className="drawer-footer">
              <div className="security-note">
                <ShieldCheck size={14} />
                <span>Secured with 256-bit encryption</span>
              </div>
              <div className="footer-buttons">
                <button 
                  className="cancel-btn" 
                  onClick={handleBack} 
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-btn" 
                  onClick={handleWithdraw} 
                  disabled={isProcessing || !selectedWallet}
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Complete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <>
          <div className="status-modal-overlay" onClick={() => setShowWalletModal(false)} />
          <div className={`status-modal wallet-modal ${theme}`}>
            <div className="status-modal-content">
              <h3 className="status-modal-title">Select Wallet</h3>
              <div className="wallets-list">
                {availableWallets.map(wallet => (
                  <div
                    key={wallet.id}
                    className={`wallet-item ${selectedWallet?.id === wallet.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedWallet(wallet);
                      setShowWalletModal(false);
                      if (errors.wallet) {
                        setErrors(prev => ({ ...prev, wallet: '' }));
                      }
                    }}
                  >
                    <div className="wallet-icon">
                      <Wallet size={20} />
                    </div>
                    <div className="wallet-details">
                      <h4>{wallet.name}</h4>
                      <p>{formatBalance(wallet.balance, wallet.currency)}</p>
                    </div>
                    {selectedWallet?.id === wallet.id && (
                      <CheckCircle size={20} className="selected-icon" />
                    )}
                  </div>
                ))}
              </div>
              <button 
                className="status-modal-btn secondary-btn" 
                onClick={() => setShowWalletModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <>
          <div className="status-modal-overlay" onClick={() => !isProcessing && setShowPinModal(false)} />
            <div className={`status-modal pin-modal ${theme}`}>
              <div className="status-modal-content">
                <h3 className="status-modal-title">Enter Transfer PIN</h3>
                <p className="status-modal-message">
                  Please enter your 4-digit transfer PIN to complete the withdrawal
                </p>
                
                <div className="pin-inputs">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      id={`pin-input-${index}`}
                      type="password"
                      className="pin-input"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(index, e)}
                      disabled={isProcessing}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <div className="status-modal-actions">
                  <button 
                    className="status-modal-btn secondary-btn" 
                    onClick={() => setShowPinModal(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button 
                    className="status-modal-btn confirm-btn" 
                    onClick={handlePinSubmit}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="spinner-small" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      'Confirm Withdrawal'
                    )}
                  </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="status-modal-overlay" onClick={handleSuccessClose} />
          <div className={`status-modal success-modal ${theme}`}>
            <div className="status-modal-content">
              <div className="status-icon-wrapper success-icon">
                <CheckCircle size={48} />
              </div>
              <h3 className="status-modal-title">Withdrawal Successful!</h3>
              <p className="status-modal-message">
                Your withdrawal request has been processed successfully. 
                {step === 'bank' ? ' Funds will be transferred to your bank account within 24 hours.' : 
                 ' Funds have been transferred to the recipient.'}
              </p>
              <div className="status-modal-details">
                <div className="status-detail-row">
                  <span className="status-detail-label">Amount</span>
                  <span className="status-detail-value">
                    {selectedWallet ? getCurrencyInfo(selectedWallet.currency).symbol : '₦'}{amount}
                  </span>
                </div>
                <div className="status-detail-row">
                  <span className="status-detail-label">Method</span>
                  <span className="status-detail-value">
                    {step === 'bank' ? 'Bank Transfer' : 'Epay Transfer'}
                  </span>
                </div>
                <div className="status-detail-row">
                  <span className="status-detail-label">Transaction ID</span>
                  <span className="status-detail-value">TX{Date.now().toString().slice(-8)}</span>
                </div>
              </div>
              <button className="status-modal-btn confirm-btn" onClick={handleSuccessClose}>
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
              <h3 className="status-modal-title">Withdrawal Failed</h3>
              <p className="status-modal-message">
                {errorMessage}
              </p>
              <div className="status-modal-actions">
                <button className="status-modal-btn secondary-btn" onClick={handleFailClose}>
                  Cancel
                </button>
                <button className="status-modal-btn fail-btn" onClick={() => {
                  setShowFailModal(false);
                  setShowPinModal(true);
                }}>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* When processing */}
      {isProcessing &&(
        <>
         <div className="status-modal-overlay" onClick={() => !isProcessing && setShowPinModal(false)} />
            <div className={`status-modal pin-modal ${theme}`}>
              <div className="status-modal-content">
                <h3 className="status-modal-title">Monitoring Tracking Progress</h3>
                {renderTransactionStatus()}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WithdrawModal;