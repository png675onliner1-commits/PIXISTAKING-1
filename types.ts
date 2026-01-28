
export enum TransactionType {
  RECHARGE = 'RECHARGE',
  WITHDRAW = 'WITHDRAW',
  STAKE = 'STAKE',
  EARNING = 'EARNING',
  REFERRAL = 'REFERRAL'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  bep20Address: string;
  balance: number;
  referralCode: string;
  referredBy?: string;
  isPaused: boolean;
  createdAt: number;
}

export interface Stake {
  id: string;
  userId: string;
  amount: number;
  durationDays: number;
  dailyRate: number; // 0.14 for 14%
  startDate: number;
  endDate: number;
  lastClaimDate: number;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  timestamp: number;
  details?: string;
}

export interface StakingPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  duration: number;
  maxStakes: number;
}
