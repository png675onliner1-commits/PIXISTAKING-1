
import { User, Transaction, Stake, TransactionType, TransactionStatus } from './types';

const USERS_KEY = 'pixi_users';
const TRANSACTIONS_KEY = 'pixi_transactions';
const STAKES_KEY = 'pixi_stakes';

export const generateId = () => Math.random().toString(36).substring(2, 15);
export const generateWallet = () => '0x' + Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');

export const db = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  
  getTransactions: (): Transaction[] => JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]'),
  saveTransactions: (txs: Transaction[]) => localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs)),
  
  getStakes: (): Stake[] => JSON.parse(localStorage.getItem(STAKES_KEY) || '[]'),
  saveStakes: (stakes: Stake[]) => localStorage.setItem(STAKES_KEY, JSON.stringify(stakes)),

  updateUser: (userId: string, updates: Partial<User>) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      db.saveUsers(users);
    }
  },

  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const txs = db.getTransactions();
    const newTx = { ...tx, id: generateId(), timestamp: Date.now() };
    txs.push(newTx);
    db.saveTransactions(txs);
    return newTx;
  }
};

// Initialize Admin if not exists
const init = () => {
  const users = db.getUsers();
  if (users.length === 0) {
    users.push({
      id: 'admin',
      username: 'admin',
      email: 'admin@pixistaking.com',
      role: 'ADMIN',
      bep20Address: generateWallet(),
      balance: 1000000,
      referralCode: 'ADMIN_PIXI',
      isPaused: false,
      createdAt: Date.now()
    });
    db.saveUsers(users);
  }
};
init();
