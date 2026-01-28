
import React from 'react';
import { User, TransactionType, TransactionStatus } from '../types';
import { db } from '../store';
import { ArrowUpRight, ArrowDownLeft, RefreshCcw, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const Ledger: React.FC<{ user: User }> = ({ user }) => {
  const transactions = [...db.getTransactions()].filter(t => t.userId === user.id).sort((a, b) => b.timestamp - a.timestamp);

  const getIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.RECHARGE: return <ArrowDownLeft className="text-blue-500" />;
      case TransactionType.WITHDRAW: return <ArrowUpRight className="text-red-500" />;
      case TransactionType.STAKE: return <RefreshCcw className="text-indigo-500" />;
      default: return <CheckCircle2 className="text-emerald-500" />;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED: return 'bg-green-500/10 text-green-500';
      case TransactionStatus.PENDING: return 'bg-amber-500/10 text-amber-500';
      case TransactionStatus.CANCELLED: return 'bg-red-500/10 text-red-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Transaction Ledger</h1>
        <p className="text-slate-400 mt-2">History of all activities on the BEP20 ledger.</p>
      </div>

      <div className="glass rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50">
              <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-500">Your ledger is currently empty.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-800 rounded-lg">
                          {getIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tx.type}</p>
                          <p className="text-xs text-slate-500 max-w-[200px] truncate">{tx.details}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-500">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`font-bold text-sm ${
                        tx.type === TransactionType.WITHDRAW ? 'text-red-400' : 
                        tx.type === TransactionType.STAKE ? 'text-slate-300' : 'text-green-400'
                      }`}>
                        {tx.type === TransactionType.WITHDRAW || tx.type === TransactionType.STAKE ? '-' : '+'}{tx.amount.toFixed(2)}
                      </p>
                      <span className="text-[10px] text-slate-500 font-semibold">USDT</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(tx.status)}`}>
                        {tx.status === TransactionStatus.COMPLETED ? <CheckCircle2 size={10} /> : 
                         tx.status === TransactionStatus.CANCELLED ? <XCircle size={10} /> : <Clock size={10} />}
                        {tx.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
