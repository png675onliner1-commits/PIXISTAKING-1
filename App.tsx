
import React, { useState, useEffect, useCallback } from 'react';
import { User, Transaction, Stake, TransactionType, TransactionStatus } from './types';
import { db, generateId, generateWallet } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Staking } from './components/Staking';
import { Recharge } from './components/Recharge';
import { Withdraw } from './components/Withdraw';
import { Referrals } from './components/Referrals';
import { Ledger } from './components/Ledger';
import { AdminPanel } from './components/AdminPanel';
import { Login } from './components/Login';
import { DAILY_PAYOUT_RATE } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login from local storage for demo purposes
  useEffect(() => {
    const savedUserId = localStorage.getItem('pixi_logged_in_user');
    if (savedUserId) {
      const user = db.getUsers().find(u => u.id === savedUserId);
      if (user) setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  // background earnings calculator simulation
  useEffect(() => {
    if (!currentUser || currentUser.isPaused) return;

    const interval = setInterval(() => {
      const stakes = db.getStakes().filter(s => s.userId === currentUser.id && s.isActive);
      const now = Date.now();
      let totalEarnings = 0;

      const updatedStakes = stakes.map(stake => {
        const msPerDay = 24 * 60 * 60 * 1000;
        const timePassedSinceLastClaim = now - stake.lastClaimDate;
        
        // Calculate earnings for the time passed (simulated 14% daily rate)
        if (timePassedSinceLastClaim > 60000) { // Every 1 minute for simulation purposes in UI
          const dailyEarn = stake.amount * DAILY_PAYOUT_RATE;
          const earnings = (dailyEarn / (24 * 60)) * (timePassedSinceLastClaim / 60000); 
          totalEarnings += earnings;
          
          return { ...stake, lastClaimDate: now };
        }
        return stake;
      });

      if (totalEarnings > 0) {
        const allStakes = db.getStakes();
        const finalStakes = allStakes.map(s => {
          const updated = updatedStakes.find(us => us.id === s.id);
          return updated || s;
        });
        db.saveStakes(finalStakes);

        const updatedUser = { ...currentUser, balance: currentUser.balance + totalEarnings };
        setCurrentUser(updatedUser);
        db.updateUser(currentUser.id, { balance: updatedUser.balance });
        
        db.addTransaction({
          userId: currentUser.id,
          type: TransactionType.EARNING,
          amount: totalEarnings,
          status: TransactionStatus.COMPLETED,
          details: `Staking dividend distribution`
        });
      }
    }, 10000); // Check every 10s

    return () => clearInterval(interval);
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('pixi_logged_in_user', user.id);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pixi_logged_in_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser.isPaused) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="glass p-8 rounded-2xl text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Account Paused</h1>
          <p className="text-slate-300 mb-6">Your account has been temporarily paused by administration. Please contact support for more information.</p>
          <button onClick={handleLogout} className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg transition">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'dashboard' && <Dashboard user={currentUser} />}
      {activeTab === 'staking' && <Staking user={currentUser} refreshUser={() => {
        const u = db.getUsers().find(x => x.id === currentUser.id);
        if(u) setCurrentUser(u);
      }} />}
      {activeTab === 'recharge' && <Recharge user={currentUser} />}
      {activeTab === 'withdraw' && <Withdraw user={currentUser} />}
      {activeTab === 'referrals' && <Referrals user={currentUser} />}
      {activeTab === 'ledger' && <Ledger user={currentUser} />}
      {activeTab === 'admin' && currentUser.role === 'ADMIN' && <AdminPanel />}
    </Layout>
  );
};

export default App;
