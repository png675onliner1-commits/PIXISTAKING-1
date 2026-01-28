
import React, { useMemo } from 'react';
import { User, TransactionType, TransactionStatus } from '../types';
import { db } from '../store';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  Plus,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const transactions = db.getTransactions().filter(t => t.userId === user.id).slice(-5);
  const stakes = db.getStakes().filter(s => s.userId === user.id && s.isActive);
  
  const totalStaked = useMemo(() => stakes.reduce((sum, s) => sum + s.amount, 0), [stakes]);
  
  // Mock data for chart - based on user balance and recent earnings
  const chartData = [
    { name: 'Mon', balance: user.balance * 0.8 },
    { name: 'Tue', balance: user.balance * 0.85 },
    { name: 'Wed', balance: user.balance * 0.9 },
    { name: 'Thu', balance: user.balance * 0.92 },
    { name: 'Fri', balance: user.balance * 0.95 },
    { name: 'Sat', balance: user.balance * 0.98 },
    { name: 'Sun', balance: user.balance },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.username}</h1>
          <p className="text-slate-400 mt-1">Here's your investment overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Active Staking: {stakes.length}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <CreditCard size={60} className="text-indigo-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Available Balance</p>
          <div className="flex items-end gap-2 mt-2">
            <h2 className="text-3xl font-bold">{user.balance.toFixed(2)}</h2>
            <span className="text-slate-500 font-semibold mb-1">USDT</span>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm font-medium">
            <TrendingUp size={16} className="mr-1" />
            +14% Daily Payout
          </div>
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={60} className="text-emerald-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Total Staked</p>
          <div className="flex items-end gap-2 mt-2">
            <h2 className="text-3xl font-bold">{totalStaked.toFixed(2)}</h2>
            <span className="text-slate-500 font-semibold mb-1">USDT</span>
          </div>
          <div className="mt-4 flex items-center text-slate-400 text-sm">
            Across {stakes.length} active plans
          </div>
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Plus size={60} className="text-amber-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Total Earnings</p>
          <div className="flex items-end gap-2 mt-2">
            <h2 className="text-3xl font-bold">
              {db.getTransactions()
                .filter(t => t.userId === user.id && (t.type === TransactionType.EARNING || t.type === TransactionType.REFERRAL))
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </h2>
            <span className="text-slate-500 font-semibold mb-1">USDT</span>
          </div>
          <div className="mt-4 flex items-center text-amber-400 text-sm font-medium">
            Accumulated Profit
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl h-[400px]">
          <h3 className="text-lg font-bold mb-6">Growth Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Ledger</h3>
            <button className="text-indigo-400 text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-10 text-slate-500">No recent transactions.</div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === TransactionType.EARNING ? 'bg-green-500/10 text-green-500' :
                      tx.type === TransactionType.RECHARGE ? 'bg-blue-500/10 text-blue-500' :
                      tx.type === TransactionType.WITHDRAW ? 'bg-red-500/10 text-red-500' :
                      'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {tx.type === TransactionType.RECHARGE ? <ArrowDownLeft size={18} /> : 
                       tx.type === TransactionType.WITHDRAW ? <ArrowUpRight size={18} /> : 
                       <Clock size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{tx.type}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${
                      tx.type === TransactionType.WITHDRAW ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {tx.type === TransactionType.WITHDRAW ? '-' : '+'}{tx.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {tx.status === TransactionStatus.COMPLETED ? (
                        <CheckCircle2 size={12} className="text-green-500" />
                      ) : (
                        <Clock size={12} className="text-amber-500" />
                      )}
                      <span className="text-[10px] text-slate-500">{tx.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
