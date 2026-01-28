
import React, { useState } from 'react';
import { User, TransactionType, TransactionStatus, Stake } from '../types';
import { db, generateId } from '../store';
import { STAKING_PLANS, DAILY_PAYOUT_RATE, REFERRAL_COMMISSION } from '../constants';
// Added Clock to the imports from lucide-react to fix the "Cannot find name 'Clock'" error on line 216.
import { Shield, Timer, Rocket, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface StakingProps {
  user: User;
  refreshUser: () => void;
}

export const Staking: React.FC<StakingProps> = ({ user, refreshUser }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [customDuration, setCustomDuration] = useState<number>(90);

  const stakes = db.getStakes();
  const userStakes = stakes.filter(s => s.userId === user.id);

  const handleStake = () => {
    const plan = STAKING_PLANS.find(p => p.id === selectedPlanId);
    if (!plan) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < plan.minAmount || parsedAmount > plan.maxAmount) {
      setMessage({ type: 'error', text: `Amount must be between ${plan.minAmount} and ${plan.maxAmount} USDT` });
      return;
    }

    if (user.balance < parsedAmount) {
      setMessage({ type: 'error', text: 'Insufficient balance' });
      return;
    }

    const planStakesCount = userStakes.filter(s => {
      const p = STAKING_PLANS.find(p => parsedAmount >= p.minAmount && parsedAmount <= p.maxAmount);
      return p?.id === plan.id;
    }).length;

    if (planStakesCount >= plan.maxStakes) {
      setMessage({ type: 'error', text: `You have reached the limit of ${plan.maxStakes} stakes for this plan.` });
      return;
    }

    const finalDuration = plan.id === 'premium' ? customDuration : plan.duration;

    // Execute Stake
    const newStake: Stake = {
      id: generateId(),
      userId: user.id,
      amount: parsedAmount,
      durationDays: finalDuration,
      dailyRate: DAILY_PAYOUT_RATE,
      startDate: Date.now(),
      endDate: Date.now() + (finalDuration * 24 * 60 * 60 * 1000),
      lastClaimDate: Date.now(),
      isActive: true
    };

    const allStakes = db.getStakes();
    allStakes.push(newStake);
    db.saveStakes(allStakes);

    // Update Balance
    const newBalance = user.balance - parsedAmount;
    db.updateUser(user.id, { balance: newBalance });
    
    // Ledger entry
    db.addTransaction({
      userId: user.id,
      type: TransactionType.STAKE,
      amount: parsedAmount,
      status: TransactionStatus.COMPLETED,
      details: `Staked in ${plan.name} for ${finalDuration} days`
    });

    // Referral Commission Logic
    if (user.referredBy) {
      const referrer = db.getUsers().find(u => u.referralCode === user.referredBy);
      if (referrer) {
        const commission = parsedAmount * REFERRAL_COMMISSION;
        db.updateUser(referrer.id, { balance: referrer.balance + commission });
        db.addTransaction({
          userId: referrer.id,
          type: TransactionType.REFERRAL,
          amount: commission,
          status: TransactionStatus.COMPLETED,
          details: `5% Commission from ${user.username}'s staking`
        });
      }
    }

    setMessage({ type: 'success', text: 'Staking successful! Your 14% daily payouts have started.' });
    setAmount('');
    refreshUser();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invest & Grow</h1>
          <p className="text-slate-400 mt-1">Select a high-yield USDT staking plan.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <Shield className="text-indigo-400 w-5 h-5" />
          <span className="text-sm font-medium">Secured BEP20 Protocol</span>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAKING_PLANS.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => {
              setSelectedPlanId(plan.id);
              if (plan.id === 'starter') setAmount('10');
            }}
            className={`glass p-6 rounded-3xl cursor-pointer transition-all border-2 relative overflow-hidden group ${
              selectedPlanId === plan.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-transparent hover:border-slate-700'
            }`}
          >
            {plan.id === 'premium' && (
              <div className="absolute top-0 right-0 bg-indigo-600 px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-widest uppercase">
                Best Value
              </div>
            )}
            
            <div className="flex items-start justify-between mb-6">
              <div className={`p-3 rounded-2xl ${
                plan.id === 'starter' ? 'bg-slate-700/50' : 
                plan.id === 'basic' ? 'bg-blue-500/10 text-blue-400' :
                plan.id === 'silver' ? 'bg-slate-400/10 text-slate-300' :
                plan.id === 'gold' ? 'bg-amber-400/10 text-amber-400' :
                'bg-indigo-500/10 text-indigo-400'
              }`}>
                {plan.id === 'starter' ? <Timer size={24} /> : <Rocket size={24} />}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">14%</p>
                <p className="text-slate-500 text-xs font-semibold">Daily Return</p>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
            <p className="text-slate-400 text-sm mb-6">
              Duration: {plan.id === 'premium' ? '90-365' : plan.duration} Days
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Min. Deposit</span>
                <span className="font-semibold">{plan.minAmount} USDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Max. Deposit</span>
                <span className="font-semibold">{plan.maxAmount === 50000 ? '50,000' : plan.maxAmount} USDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Staking Limit</span>
                <span className="font-semibold">{plan.maxStakes} Times</span>
              </div>
            </div>

            {selectedPlanId === plan.id && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                {plan.id === 'premium' && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Duration (90 - 365 Days)</label>
                    <input 
                      type="number"
                      min="90"
                      max="365"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(parseInt(e.target.value) || 90)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Enter USDT Amount</label>
                  <input 
                    type="number"
                    disabled={plan.id === 'starter'}
                    placeholder={`e.g. ${plan.minAmount}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button 
                  onClick={handleStake}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                >
                  Start Staking Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Clock className="text-indigo-400" />
          My Active Stakes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-800">
                <th className="pb-4 font-medium">Staked Amount</th>
                <th className="pb-4 font-medium">Daily Payout</th>
                <th className="pb-4 font-medium">Progress</th>
                <th className="pb-4 font-medium">End Date</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {userStakes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 italic">No active stakes found. Start investing to see them here.</td>
                </tr>
              ) : (
                userStakes.map((stake) => {
                  const progress = Math.min(100, ((Date.now() - stake.startDate) / (stake.endDate - stake.startDate)) * 100);
                  return (
                    <tr key={stake.id} className="text-sm">
                      <td className="py-4 font-bold">{stake.amount.toFixed(2)} USDT</td>
                      <td className="py-4 text-green-400">{(stake.amount * stake.dailyRate).toFixed(2)} USDT</td>
                      <td className="py-4 pr-6">
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block">{progress.toFixed(1)}% Completed</span>
                      </td>
                      <td className="py-4 text-slate-400">{new Date(stake.endDate).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-[10px] font-bold">ACTIVE</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
