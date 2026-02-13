import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { TransactionType } from "../types";
import Keypad from "../components/Keypad";
import * as Icons from "lucide-react";
import {
  X,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const { categories, addTransaction } = useAppContext();

  const [type, setType] = useState<TransactionType>("expense");
  const [amountStr, setAmountStr] = useState("0");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [note, setNote] = useState("");
  const [date] = useState(new Date());

  // Filter categories by type
  const currentCategories = categories.filter((c) => c.type === type);

  // Set default category when type changes
  useEffect(() => {
    if (currentCategories.length > 0) {
      setSelectedCategoryId(currentCategories[0].id);
    }
  }, [type]);

  const handleDigit = (digit: string) => {
    if (amountStr === "0" && digit !== ".") {
      setAmountStr(digit);
    } else {
      if (digit === "." && amountStr.includes(".")) return;
      if (amountStr.includes(".") && amountStr.split(".")[1].length >= 2)
        return; // Max 2 decimals
      setAmountStr((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    if (amountStr.length === 1) {
      setAmountStr("0");
    } else {
      setAmountStr((prev) => prev.slice(0, -1));
    }
  };

  const handleOperation = (op: string) => {
    // Simple implementation: just append for now, but real calc logic is better
    // For MVP, let's assume the user enters the final amount or does simple addition
    // To keep it simple and "3 seconds entry", let's ignore complex calc for now or implement eval safely
    // Or just treat it as a digit but prevent multiple ops
    if (amountStr.endsWith("+") || amountStr.endsWith("-")) return;
    setAmountStr((prev) => prev + op);
  };

  const calculateResult = (): number => {
    try {
      // Safe eval for simple math
      // eslint-disable-next-line no-new-func
      const result = new Function("return " + amountStr)();
      return Number(parseFloat(result).toFixed(2));
    } catch (e) {
      return parseFloat(amountStr);
    }
  };

  const handleSubmit = () => {
    if (!selectedCategoryId) return;
    const finalAmount = calculateResult();
    if (finalAmount <= 0) return;

    addTransaction({
      amount: finalAmount,
      type,
      categoryId: selectedCategoryId,
      date: date.toISOString(),
      note: note || undefined,
    });

    navigate("/");
  };

  const IconComponent = (iconName: string) =>
    (Icons as any)[iconName] || Icons.HelpCircle;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header / Tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary text-white">
        <button onClick={() => navigate(-1)} className="p-2">
          <X size={24} />
        </button>
        <div className="flex gap-4">
          {(["expense", "income", "transfer"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={clsx(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                type === t
                  ? "bg-white text-primary"
                  : "text-white/70 hover:text-white"
              )}
            >
              {{ expense: "支出", income: "收入", transfer: "转账" }[t]}
            </button>
          ))}
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Amount Display */}
      <div className="px-6 py-8 flex items-center justify-end bg-primary text-white">
        <span className="text-4xl font-bold">{amountStr}</span>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-4">
          {currentCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={clsx(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  selectedCategoryId === cat.id
                    ? "bg-primary text-white scale-110 shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {React.createElement(IconComponent(cat.icon), { size: 24 })}
              </div>
              <span
                className={clsx(
                  "text-xs",
                  selectedCategoryId === cat.id
                    ? "text-primary font-medium"
                    : "text-gray-500"
                )}
              >
                {cat.name}
              </span>
            </button>
          ))}
          {/* Add custom category button placeholder */}
          <button className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
              <Icons.Plus size={24} />
            </div>
            <span className="text-xs text-gray-400">设置</span>
          </button>
        </div>
      </div>

      {/* Extra Inputs Bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 bg-gray-50 text-gray-500">
        <button className="flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-full border border-gray-200">
          <CalendarIcon size={14} />
          {format(date, "MM/dd")}
        </button>
        <div className="flex-1 flex items-center bg-white px-3 py-1.5 rounded-full border border-gray-200">
          <MessageSquare size={14} className="mr-2" />
          <input
            type="text"
            placeholder="写备注..."
            className="w-full bg-transparent text-xs outline-none text-gray-700 placeholder-gray-400"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button className="p-1.5 rounded-full bg-white border border-gray-200">
          <ImageIcon size={16} />
        </button>
      </div>

      {/* Keypad */}
      <Keypad
        onDigit={handleDigit}
        onDelete={handleDelete}
        onOperation={handleOperation}
        onSubmit={handleSubmit}
        onDate={() => {}} // TODO: Date picker
        onClear={() => setAmountStr("0")}
      />
    </div>
  );
};

export default AddTransaction;
