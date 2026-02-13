import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { Settings, CreditCard, LogOut, Edit2, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const Profile: React.FC = () => {
  const { budget, transactions, updateBudget } = useAppContext();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.totalAmount.toString());

  const currentMonthStr = format(new Date(), 'yyyy-MM');
  
  const totalExpense = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonthStr))
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions, currentMonthStr]);

  const percentage = Math.min((totalExpense / budget.totalAmount) * 100, 100);
  const remaining = budget.totalAmount - totalExpense;
  
  const today = new Date();
  const daysLeft = differenceInDays(endOfMonth(today), today);
  const dailyBudget = daysLeft > 0 ? remaining / daysLeft : 0;

  let progressColor = 'bg-primary';
  if (percentage >= 100) progressColor = 'bg-expense';
  else if (percentage >= 80) progressColor = 'bg-orange-500';

  const handleSaveBudget = () => {
    const amount = parseFloat(newBudget);
    if (!isNaN(amount) && amount > 0) {
      updateBudget(amount);
      setIsEditingBudget(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
          🐱
        </div>
        <div>
          <h2 className="text-xl font-bold">我的记账本</h2>
          <p className="text-sm text-gray-500">坚持记账第 1 天</p>
        </div>
      </div>

      {/* Budget Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">本月预算</h3>
          <button 
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="text-primary text-sm flex items-center gap-1"
          >
            <Edit2 size={14} />
            {isEditingBudget ? '取消' : '修改'}
          </button>
        </div>

        {isEditingBudget ? (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 flex-1"
            />
            <button 
              onClick={handleSaveBudget}
              className="bg-primary text-white px-4 rounded"
            >
              保存
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2 flex justify-between items-end">
              <div>
                <span className="text-sm text-gray-500">已支出 </span>
                <span className="font-bold text-gray-900">{totalExpense.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">总预算 </span>
                <span className="font-medium text-gray-900">{budget.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className={clsx("h-full rounded-full transition-all duration-500", progressColor)}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                <span>剩余预算</span>
                <span className={clsx("text-lg font-bold", remaining < 0 ? "text-expense" : "text-primary")}>
                  {remaining.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span>剩余 {daysLeft} 天</span>
                <span>建议日均 {dailyBudget > 0 ? dailyBudget.toFixed(2) : '0.00'}</span>
              </div>
            </div>

            {percentage >= 80 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                <AlertTriangle size={14} />
                <span>预算已使用 {percentage.toFixed(0)}%，请注意控制消费！</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-gray-50 active:bg-gray-50">
          <CreditCard size={20} className="text-primary" />
          <span className="flex-1">资产管理</span>
        </div>
        <div className="flex items-center gap-3 p-4 border-b border-gray-50 active:bg-gray-50">
          <Settings size={20} className="text-gray-500" />
          <span className="flex-1">设置</span>
        </div>
        <div className="flex items-center gap-3 p-4 active:bg-gray-50 text-expense">
          <LogOut size={20} />
          <span className="flex-1">退出登录</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
