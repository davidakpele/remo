import { ReactElement } from "react";

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

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  country: string;
  referralName: string;
  customerId: string;
  status: 'Active' | 'Suspended' | 'Pending';
  kycLevel: number;
}

export interface KYCDocument {
  id: string;
  type: string;
  verifiedOn: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface LoginHistory {
  id: string;
  device: string;
  browser: string;
  location: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  currency: string;
  amount: number;
  fiatAmount: number;
  status: TransactionStatus;
  date: string;
  description: string;
  transactionId?: string;
  sessionId?: string;
  referenceNo?: string;
  terminalId?: string;
  erId?: string;
  accountHolder?: string;
  previousBalance?: number;
  availableBalance?: number;
  icon: React.ReactElement;
  originalData: any;
}


export interface StatusInfo {
  color: string;
  icon: ReactElement;
  text: string;
}

export type TransactionType = "deposit" | "withdrawal" | "swap" | "transfer" | "credited";
export type TransactionStatus = "completed" | "pending" | "failed";