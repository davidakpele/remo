export interface MobileNavProps {
  activeTab?: string;
}

export interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export interface Bank {
  id: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  isVerified: boolean;
}

export interface WalletType {
  id: number;
  name: string;
  balance: number;
  currency: string;
  isDefault: boolean;
}

export interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
  userId?: string;
  userEmail?: string;
  userBalance?: number;
  wallets?: Array<{
    id: number;
    name: string;
    balance: number;
    currency: string;
    isDefault: boolean;
  }>;
  banks?: Array<{
    id: number;
    bankName: string;
    accountName: string;
    accountNumber: string;
    bankCode: string;
    isVerified: boolean;
  }>;
  maxWithdrawalAmount?: number;
  minWithdrawalAmount?: number;
  processingFee?: {
    bank: number;
    epay: number;
    minFee: number;
  };
  onWithdrawSuccess?: (data: {
    amount: number;
    method: 'bank' | 'epay';
    transactionId: string;
    timestamp: string;
  }) => void;
  onWithdrawError?: (error: string) => void;
  pinLength?: number;
}

export interface ExchangeCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}