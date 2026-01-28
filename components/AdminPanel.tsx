
import React, { useState } from 'react';
import { db } from '../store';
import { User, Transaction, TransactionStatus, TransactionType } from '../types';
import { Users, ShieldCheck, CheckCircle, XCircle, Pause, Play, Trash2, Search } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [transactions, setTransactions] = useState<Transaction[]>(db.getTransactions());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'withdrawals'>('users');

  const handleApproveWithdrawal = (txId: string) => {
    const allTxs = db.getTransactions();
    const txIndex = allTxs.findIndex(t => t.id === txId);
    if (txIndex !== -1) {
      allTxs[txIndex].status = TransactionStatus.COMPLETED;
      db.saveTransactions(allTxs);
      setTransactions([...allTxs]);
    }
  };

  const handleCancelWithdrawal = (txId: string) => {
    const allTxs = db.getTransactions();
    const txIndex = allTxs.findIndex(t => t.id === txId);
    if (txIndex !== -1) {
      const tx = allTxs[txIndex];
      tx.status = TransactionStatus.CANCELLED;
      
      // Return funds to user
      const allUsers = db.getUsers();
      const userIndex = allUsers.findIndex(u => u.id === tx.userId);
      if (userIndex !== -1) {
        allUsers[userIndex].balance += tx.amount;
        db.saveUsers(allUsers);
        setUsers([...allUsers]);
      }
      
      db.saveTransactions(allTxs);
      setTransactions([...allTxs]);
    }
  };

  const toggleUserPause = (userId: string) => {
    const allUsers = db.getUsers();
    const userIndex = allUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      allUsers[userIndex].isPaused = !allUsers[userIndex].isPaused;
      db.saveUsers(allUsers);
      setUsers([...allUsers]);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingWithdrawals = transactions.filter(t => 
    t.type === TransactionType.WITHDRAW && t.status === TransactionStatus.PENDING
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck className="text-indigo-500" />
            Control Hub
          </h1>
          <p className="text-slate-400 mt-1">Platform management and fund approvals.</p>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeAdminTab === 'users' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveAdminTab('withdrawals')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${activeAdminTab === 'withdrawals' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
          >
            Withdrawals
            {pendingWithdrawals.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center animate-bounce">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeAdminTab === 'users' ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50">
                  <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold uppercase">
                            {u.username[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{u.username}</p>
                            <p className="text-[10px] text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm">
                        {u.balance.toFixed(2)} <span className="text-slate-500">USDT</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${u.isPaused ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                          {u.isPaused ? 'PAUSED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toggleUserPause(u.id)}
                          className={`p-2 rounded-lg transition-colors ${u.isPaused ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                          title={u.isPaused ? "Resume User" : "Pause User"}
                        >
                          {u.isPaused ? <Play size={18} /> : <Pause size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50">
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Requester</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pendingWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-500 italic">No pending withdrawal requests.</td>
                  </tr>
                ) : (
                  pendingWithdrawals.map((tx) => {
                    const user = users.find(u => u.id === tx.userId);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-sm">{user?.username || 'Unknown'}</p>
                          <p className="text-[10px] text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-red-400">
                          {tx.amount.toFixed(2)} USDT
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-400 max-w-[200px] truncate">{tx.details}</p>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleApproveWithdrawal(tx.id)}
                            className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleCancelWithdrawal(tx.id)}
                            className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-lg transition-all"
                            title="Reject & Refund"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
