
import React from 'react';
import { User } from '../types';
import { 
  LayoutDashboard, 
  Coins, 
  Wallet, 
  ArrowUpRight, 
  Users, 
  History, 
  ShieldCheck, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, activeTab, setActiveTab, onLogout, children }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'staking', icon: Coins, label: 'Staking' },
    { id: 'recharge', icon: Wallet, label: 'Recharge' },
    { id: 'withdraw', icon: ArrowUpRight, label: 'Withdraw' },
    { id: 'referrals', icon: Users, label: 'Referrals' },
    { id: 'ledger', icon: History, label: 'Transaction Ledger' },
  ];

  if (user.role === 'ADMIN') {
    menuItems.push({ id: 'admin', icon: ShieldCheck, label: 'Admin Hub' });
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-slate-800 p-6 fixed h-full z-20">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Coins className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            PIXI STAKING
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <header className="md:hidden flex items-center justify-between p-4 glass sticky top-0 z-20 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Coins className="text-indigo-500 w-6 h-6" />
          <span className="font-bold text-lg">PIXI</span>
        </div>
        <button onClick={onLogout} className="p-2 text-slate-400"><LogOut className="w-5 h-5" /></button>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-800 flex justify-around p-2 z-20">
        {menuItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              activeTab === item.id ? 'text-indigo-500' : 'text-slate-500'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
