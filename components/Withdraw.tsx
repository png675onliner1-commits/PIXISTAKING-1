
import React, { useState } from 'react';
import { User, TransactionType, TransactionStatus } from '../types';
import { db } from '../store';
import { Wallet, Info, ArrowUpRight, Clock, ShieldAlert } from 'lucide-react';

export const Withdraw: React.FC<{ user: User }> = ({ user }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    
    if (isNaN(val) || val < 1) {
      setMsg({ type: 'error', text: 'Minimum withdrawal is 1 USDT' });
      return;
    }

    if (val > user.balance) {
      setMsg({ type: 'error', text: 'Insufficient balance' });
      return;
    }

    if (!address || address.length < 20) {
      setMsg({ type: 'error', text: 'Please enter a valid BEP20 address' });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      // Deduct balance immediately
      db.updateUser(user.id, { balance: user.balance - val });
      
      // Create pending transaction
      db.addTransaction({
        userId: user.id,
        type: TransactionType.WITHDRAW,
        amount: val,
        status: TransactionStatus.PENDING,
        details: `Withdrawal request to ${address}`
      });

      setMsg({ type: 'success', text: 'Withdrawal request submitted! Pending admin approval.' });
      setAmount('');
      setAddress('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Withdraw Funds</h1>
            <p className="text-slate-400 mt-2">Transfer your earnings to your external wallet.</p>
          </div>

          <div className="glass p-6 rounded-3xl bg-indigo-500/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm font-medium">Available for Withdrawal</span>
              <Wallet className="text-indigo-400" size={20} />
            </div>
            <div className="flex items-end gap-2">
              <h2 className="text-4xl font-bold">{user.balance.toFixed(2)}</h2>
              <span className="text-slate-500 font-semibold mb-1">USDT</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">Withdrawal Amount</label>
              <div className="relative">
                <input 
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  type="button"
                  onClick={() => setAmount(user.balance.toString())}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 text-xs font-bold hover:text-indigo-300"
                >
                  MAX
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-2">Recipient BEP20 Address</label>
              <input 
                type="text"
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {msg && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                msg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {msg.text}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  <ArrowUpRight size={20} />
                  Confirm Withdrawal
                </>
              )}
            </button>
          </form>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Clock className="text-amber-500" size={18} />
              Policy
            </h3>
            <ul className="space-y-4 text-xs text-slate-400">
              <li className="flex gap-2">
                <Info size={14} className="shrink-0 text-slate-500" />
                <span>Withdrawals are processed manually by administrators.</span>
              </li>
              <li className="flex gap-2">
                <Info size={14} className="shrink-0 text-slate-500" />
                <span>Approval usually takes 1-24 hours.</span>
              </li>
              <li className="flex gap-2">
                <Info size={14} className="shrink-0 text-slate-500" />
                <span>Network fee (Gas) is 0.5 USDT per transaction.</span>
              </li>
              <li className="flex gap-2">
                <ShieldAlert size={14} className="shrink-0 text-red-500" />
                <span>Incorrect addresses will result in loss of funds. PIXI does not provide refunds.</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Audit Status</p>
            <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Verified Safe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
