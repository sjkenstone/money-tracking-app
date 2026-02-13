import React from 'react';
import type { Transaction, Category } from '../types';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  category: Category;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, category }) => {
  const IconComponent = (Icons as any)[category.icon] || Icons.HelpCircle;
  const isExpense = transaction.type === 'expense';

  return (
    <div className="flex items-center justify-between p-4 bg-white mb-1 last:mb-0 active:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: category.color }}
        >
          <IconComponent size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{category.name}</span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{format(new Date(transaction.date), 'HH:mm')}</span>
            {transaction.note && <span>· {transaction.note}</span>}
          </div>
        </div>
      </div>
      <span className={`font-semibold ${isExpense ? 'text-gray-900' : 'text-income'}`}>
        {isExpense ? '-' : '+'}{transaction.amount.toFixed(2)}
      </span>
    </div>
  );
};

export default TransactionItem;
