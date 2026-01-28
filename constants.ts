
import { StakingPlan } from './types';

export const DAILY_PAYOUT_RATE = 0.14; // 14%
export const REFERRAL_COMMISSION = 0.05; // 5%

export const STAKING_PLANS: StakingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    minAmount: 10,
    maxAmount: 10,
    duration: 3,
    maxStakes: 1
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    minAmount: 10.01,
    maxAmount: 20,
    duration: 7,
    maxStakes: 30
  },
  {
    id: 'silver',
    name: 'Silver Plan',
    minAmount: 20.01,
    maxAmount: 50,
    duration: 14,
    maxStakes: 30
  },
  {
    id: 'gold',
    name: 'Gold Plan',
    minAmount: 50.01,
    maxAmount: 100,
    duration: 30,
    maxStakes: 30
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    minAmount: 100.01,
    maxAmount: 50000,
    duration: 90, // User can select 90 - 365, defaults to 90
    maxStakes: 30
  }
];
