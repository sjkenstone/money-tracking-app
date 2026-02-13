import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronDown, Eye, EyeOff, FileText } from 'lucide-react';
import * as Icons from 'lucide-react';

const Home: React.FC = () => {
  const { transactions, categories, budget } = useAppContext();
  const [showBalance, setShowBalance] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith(format(currentMonth, 'yyyy-MM')));
  }, [transactions, currentMonth]);

  const sortedTransactions = useMemo(() => {
    return [...monthlyTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [monthlyTransactions]);

  const { totalIncome, totalExpense } = useMemo(() => {
    return monthlyTransactions.reduce(
      (acc, t) => {
        if (t.type === 'expense') acc.totalExpense += t.amount;
        if (t.type === 'income') acc.totalIncome += t.amount;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [monthlyTransactions]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof transactions } = {};
    sortedTransactions.forEach(t => {
      const date = t.date.split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return groups;
  }, [sortedTransactions]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-primary text-white p-6 pb-12 rounded-b-[2rem] shadow-md z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1 opacity-90">
            <span className="text-sm font-medium">{format(currentMonth, 'yyyy年MM月')}</span>
            <ChevronDown size={16} />
          </div>
          <button onClick={() => setShowBalance(!showBalance)} className="opacity-80">
            {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <span className="text-sm opacity-80 mb-1">本月结余</span>
          <span className="text-4xl font-bold tracking-tight">
            {showBalance ? (totalIncome - totalExpense).toFixed(2) : '****'}
          </span>
        </div>

        <div className="flex justify-between w-full px-4">
          <div className="flex flex-col">
            <span className="text-xs opacity-70 mb-1">本月收入</span>
            <span className="text-lg font-semibold">
              {showBalance ? totalIncome.toFixed(2) : '****'}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs opacity-70 mb-1">本月支出</span>
            <span className="text-lg font-semibold">
              {showBalance ? totalExpense.toFixed(2) : '****'}
            </span>
          </div>
        </div>
      </header>

      {/* Transaction List */}
      <div className="flex-1 -mt-6 px-4 pb-4 overflow-y-auto">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map(date => (
            <div key={date} className="mb-4 overflow-hidden rounded-xl shadow-sm border border-gray-100 bg-white">
              <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  {format(parseISO(date), 'MM月dd日 EEEE', { locale: zhCN })}
                </span>
                {/* Optional: Daily summary */}
              </div>
              <div>
                {groupedTransactions[date].map(t => {
                  const category = categories.find(c => c.id === t.categoryId);
                  if (!category) return null;
                  return <TransactionItem key={t.id} transaction={t} category={category} />;
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 mt-6 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="text-gray-300" />
            </div>
            <p>本月暂无账单</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
