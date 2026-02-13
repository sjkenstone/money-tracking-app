import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import clsx from 'clsx';
import * as Icons from 'lucide-react';

const Charts: React.FC = () => {
  const { transactions, categories } = useAppContext();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [currentDate] = useState(new Date());

  const filteredTransactions = useMemo(() => {
    let start, end;
    if (period === 'week') {
      start = startOfWeek(currentDate, { weekStartsOn: 1 });
      end = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else if (period === 'month') {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    } else {
      start = startOfYear(currentDate);
      end = endOfYear(currentDate);
    }
    const startStr = start.toISOString();
    const endStr = end.toISOString();
    
    return transactions.filter(t => t.type === 'expense' && t.date >= startStr && t.date <= endStr);
  }, [transactions, period, currentDate]);

  const totalExpense = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    const data: { [key: string]: number } = {};
    filteredTransactions.forEach(t => {
      data[t.categoryId] = (data[t.categoryId] || 0) + t.amount;
    });

    return Object.entries(data)
      .map(([id, value]) => {
        const category = categories.find(c => c.id === id);
        return {
          name: category?.name || '未知',
          value,
          color: category?.color || '#ccc',
          icon: category?.icon,
          percent: totalExpense > 0 ? (value / totalExpense) * 100 : 0
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categories, totalExpense]);

  const IconComponent = (iconName: string) => (Icons as any)[iconName] || Icons.HelpCircle;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-primary text-white p-4 pb-8">
        <div className="flex justify-center mb-4">
          <div className="flex bg-primary-600 rounded-lg p-1 border border-white/20">
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={clsx(
                  "px-4 py-1 rounded-md text-xs font-medium transition-colors",
                  period === p ? "bg-white text-primary" : "text-white/70 hover:text-white"
                )}
              >
                {{ week: '周', month: '月', year: '年' }[p]}
              </button>
            ))}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs opacity-70 mb-1">总支出</div>
          <div className="text-2xl font-bold">{totalExpense.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mt-4 bg-white rounded-t-xl px-4 pt-6">
        {/* Pie Chart */}
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ranking List */}
        <div className="space-y-4 pb-8">
          <h3 className="font-bold text-gray-800">支出排行榜</h3>
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: item.color }}
              >
                {item.icon && React.createElement(IconComponent(item.icon), { size: 16 })}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm font-bold">-{item.value.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Charts;
