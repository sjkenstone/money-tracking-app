export type TransactionType = 'expense' | 'income' | 'transfer';

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // ISO string
  note?: string;
  imageUrl?: string;
}

export interface BudgetType {
  month: string; // YYYY-MM
  totalAmount: number;
}
