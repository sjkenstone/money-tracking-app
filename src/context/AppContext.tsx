import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Transaction, Category, BudgetType } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  transactions: Transaction[];
  categories: Category[];
  budget: BudgetType;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (amount: number) => void;
  getTransactionsByDate: (date: Date) => Transaction[];
  getTransactionsByMonth: (date: Date) => Transaction[];
  getCategory: (id: string) => Category | undefined;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Food', icon: 'Utensils', type: 'expense', color: '#ef4444' },
  { id: '2', name: 'Shopping', icon: 'ShoppingBag', type: 'expense', color: '#f97316' },
  { id: '3', name: 'Transport', icon: 'Bus', type: 'expense', color: '#3b82f6' },
  { id: '4', name: 'Entertainment', icon: 'Gamepad2', type: 'expense', color: '#8b5cf6' },
  { id: '5', name: 'Housing', icon: 'Home', type: 'expense', color: '#10b981' },
  { id: '6', name: 'Medical', icon: 'Stethoscope', type: 'expense', color: '#ec4899' },
  { id: '7', name: 'Salary', icon: 'Banknote', type: 'income', color: '#22c55e' },
  { id: '8', name: 'Part-time', icon: 'Briefcase', type: 'income', color: '#14b8a6' },
  { id: '9', name: 'Investment', icon: 'TrendingUp', type: 'income', color: '#f59e0b' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories] = useState<Category[]>(defaultCategories);

  const [budget, setBudget] = useState<BudgetType>(() => {
    const saved = localStorage.getItem('budget');
    return saved ? JSON.parse(saved) : { month: new Date().toISOString().slice(0, 7), totalAmount: 3000 };
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (amount: number) => {
    setBudget(prev => ({ ...prev, totalAmount: amount }));
  };

  const getTransactionsByDate = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return transactions.filter(t => t.date.startsWith(dateStr));
  };

  const getTransactionsByMonth = (date: Date) => {
    const monthStr = date.toISOString().slice(0, 7);
    return transactions.filter(t => t.date.startsWith(monthStr));
  };

  const getCategory = (id: string) => {
    return categories.find(c => c.id === id);
  };

  return (
    <AppContext.Provider value={{
      transactions,
      categories,
      budget,
      addTransaction,
      deleteTransaction,
      updateBudget,
      getTransactionsByDate,
      getTransactionsByMonth,
      getCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
