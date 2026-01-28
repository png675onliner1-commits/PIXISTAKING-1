
import React, { useState } from 'react';
import { db, generateId, generateWallet } from '../store';
import { User } from '../types';
import { Coins, Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Just UI, not used for actual security in this demo
  const [refCode, setRefCode] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = db.getUsers();

    if (isRegistering) {
      if (!username || !email) {
        setError('Please fill all fields');
        return;
      }
      if (users.find(u => u.username === username || u.email === email)) {
        setError('User already exists');
        return;
      }

      const newUser: User = {
        id: generateId(),
        username,
        email,
        role: 'USER',
        bep20Address: generateWallet(),
        balance: 0,
        referralCode: username.toUpperCase() + '_' + Math.floor(Math.random() * 1000),
        referredBy: refCode || undefined,
        isPaused: false,
        createdAt: Date.now()
      };

      const updatedUsers = [...users, newUser];
      db.saveUsers(updatedUsers);
      onLogin(newUser);
    } else {
      const user = users.find(u => (u.username === username || u.email === username));
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-lg z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-2xl shadow-indigo-600/40">
            <Coins size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">PIXI STAKING</h1>
          <p className="text-slate-400 font-medium">14% Daily Yield • BEP20 Protocol • Secure Ledger</p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[40px]">
          <div className="flex bg-slate-800/50 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setIsRegistering(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isRegistering ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsRegistering(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isRegistering ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Identity</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder={isRegistering ? "Choose Username" : "Username or Email"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Passkey</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Referral Code (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Enter Code"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {error && <p className="text-red-400 text-xs font-bold text-center bg-red-400/10 py-2 rounded-lg">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group"
            >
              {isRegistering ? 'Register & Start Earning' : 'Secure Sign In'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              Auto-Pilot
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" />
              Verified BEP20
            </div>
          </div>
        </div>
        
        <p className="mt-10 text-center text-slate-500 text-xs">
          By continuing, you agree to PIXI's Terms of Staking and yield distribution policies.
        </p>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
