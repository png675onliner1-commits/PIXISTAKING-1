
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../store';
import { Copy, Users, Gift, Share2, TrendingUp, Check } from 'lucide-react';

export const Referrals: React.FC<{ user: User }> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const referrals = db.getUsers().filter(u => u.referredBy === user.referralCode);
  const refLink = `${window.location.origin}/#/?ref=${user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Program</h1>
          <p className="text-slate-400 mt-2">Earn 5% commission on every stake made by your team.</p>
          
          <div className="mt-8 space-y-6">
            <div className="glass p-6 rounded-3xl space-y-4">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Your Referral Link</p>
              <div className="flex items-center gap-2 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <code className="flex-1 text-sm text-indigo-300 truncate">{refLink}</code>
                <button 
                  onClick={copyLink}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold uppercase mb-2">Total Team</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Users size={20} />
                  </div>
                  <span className="text-2xl font-bold">{referrals.length}</span>
                </div>
              </div>
              <div className="glass p-6 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold uppercase mb-2">Commission Rate</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-2xl font-bold">5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block relative">
          <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative glass p-8 rounded-[40px] border-slate-700">
             <div className="aspect-square bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                <Share2 size={80} className="text-indigo-500" />
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Invite Friends</h3>
                <p className="text-sm text-slate-400">The more you share, the more you earn. Passive income at your fingertips.</p>
             </div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Gift className="text-indigo-400" />
          My Referrals
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-800">
                <th className="pb-4 font-medium">User ID</th>
                <th className="pb-4 font-medium">Joined Date</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-slate-500 italic">No referrals yet. Share your link to start building your team!</td>
                </tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref.id} className="text-sm">
                    <td className="py-4 font-bold">{ref.username}</td>
                    <td className="py-4 text-slate-400">{new Date(ref.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-[10px] font-bold">ACTIVE</span>
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
