
import React, { useState } from 'react';
import { User } from '../types';
import { Copy, Check, QrCode, AlertTriangle } from 'lucide-react';

export const Recharge: React.FC<{ user: User }> = ({ user }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.bep20Address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Recharge Wallet</h1>
        <p className="text-slate-400 mt-2">Add USDT to your account via BEP20 (Binance Smart Chain)</p>
      </div>

      <div className="space-y-6">
        <div className="glass p-8 rounded-3xl flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl mb-8 shadow-2xl">
            {/* Mock QR Code */}
            <div className="w-48 h-48 bg-slate-100 flex items-center justify-center relative group">
              <QrCode size={160} className="text-slate-800" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-xl">
                 <p className="text-indigo-600 font-bold text-xs text-center px-4 uppercase tracking-wider">PIXI Secure Gateway</p>
              </div>
            </div>
          </div>
          
          <div className="w-full space-y-6">
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block text-center">Your Unique BEP20 Address</label>
              <div className="flex items-center gap-2 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <code className="flex-1 text-sm font-mono truncate text-indigo-300 text-center">{user.bep20Address}</code>
                <button 
                  onClick={copyToClipboard}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all text-slate-300 hover:text-white"
                  title="Copy Address"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            </div>
            
            <button 
              onClick={copyToClipboard}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={20} />
                  Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copy Deposit Address
                </>
              )}
            </button>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border-l-4 border-amber-500 bg-amber-500/5">
          <div className="flex gap-4">
            <div className="text-amber-500 shrink-0"><AlertTriangle /></div>
            <div>
              <h4 className="font-bold text-amber-500">Security Warning</h4>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                Send only <span className="text-white font-bold">USDT</span> to this address via <span className="text-white font-bold">BEP20 (BSC)</span> network. 
                Tokens sent via other networks (like ERC20 or TRC20) or other assets will be <span className="text-red-400 font-bold underline">permanently lost</span>. 
                Balances update automatically after 12 network confirmations.
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
          Powered by PIXI Automated Ledger Engine
        </p>
      </div>
    </div>
  );
};
