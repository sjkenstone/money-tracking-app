import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionItem from '../components/TransactionItem';
import clsx from 'clsx';

const CalendarPage: React.FC = () => {
  const { transactions, categories } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const dailyStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const date = t.date.split('T')[0];
        stats[date] = (stats[date] || 0) + t.amount;
      }
    });
    return stats;
  }, [transactions]);

  const selectedDayTransactions = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return transactions.filter(t => t.date.startsWith(dateStr));
  }, [transactions, selectedDate]);

  const monthStats = useMemo(() => {
    const monthStr = format(currentMonth, 'yyyy-MM');
    return transactions
      .filter(t => t.date.startsWith(monthStr))
      .reduce((acc, t) => {
        if (t.type === 'expense') acc.expense += t.amount;
        if (t.type === 'income') acc.income += t.amount;
        return acc;
      }, { income: 0, expense: 0 });
  }, [transactions, currentMonth]);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  // Calculate padding for first day
  const startDay = getDay(startOfMonth(currentMonth));

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 z-10 bg-white">
        {/* Header */}
        <div className="bg-primary text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft />
            </button>
            <span className="text-lg font-medium">{format(currentMonth, 'yyyy年MM月')}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight />
            </button>
          </div>
          <div className="flex justify-between text-sm opacity-90 px-4">
            <span>总支出: {monthStats.expense.toFixed(2)}</span>
            <span>总收入: {monthStats.income.toFixed(2)}</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-2 border-b border-gray-100">
          <div className="grid grid-cols-7 mb-2 text-center text-xs text-gray-400">
            {weekDays.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-2">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const amount = dailyStats[dateStr];
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(day)}
                  className={clsx(
                    "flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer",
                    isSelected ? "bg-primary/10 text-primary" : "text-gray-700",
                    isToday && !isSelected && "bg-gray-50"
                  )}
                >
                  <span className={clsx("text-sm", isToday && "font-bold text-primary")}>
                    {format(day, 'd')}
                  </span>
                  <span className="text-[10px] h-3 text-gray-400">
                    {amount ? amount.toFixed(0) : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
          <span>{format(selectedDate, 'MM月dd日 EEEE', { locale: zhCN })}</span>
          <span>
            {selectedDayTransactions.length > 0
              ? `支出 ${selectedDayTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}`
              : '无记录'}
          </span>
        </div>
        <div className="space-y-2">
          {selectedDayTransactions.map(t => {
            const category = categories.find(c => c.id === t.categoryId);
            if (!category) return null;
            return <TransactionItem key={t.id} transaction={t} category={category} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
