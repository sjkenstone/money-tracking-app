import React from 'react';
import { Delete } from 'lucide-react';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void; // Long press delete? Or separate button? Requirement says "simple calc".
  onOperation: (op: string) => void;
  onSubmit: () => void;
  onDate: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onDigit, onDelete, onOperation, onSubmit, onDate }) => {
  const buttons = [
    '7', '8', '9', 'date',
    '4', '5', '6', '+',
    '1', '2', '3', '-',
    '.', '0', 'DEL', 'OK'
  ];

  const renderContent = (btn: string) => {
    if (btn === 'DEL') return <Delete size={24} />;
    if (btn === 'OK') return <span className="font-bold">完成</span>;
    if (btn === 'date') return <span className="text-sm font-medium">今天</span>; // Should update with selected date
    return <span className="text-xl font-medium">{btn}</span>;
  };

  const handleClick = (btn: string) => {
    if (btn === 'DEL') onDelete();
    else if (btn === 'OK') onSubmit();
    else if (btn === 'date') onDate();
    else if (['+', '-'].includes(btn)) onOperation(btn);
    else onDigit(btn);
  };

  return (
    <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 pb-safe">
      {buttons.map((btn) => (
        <button
          key={btn}
          onClick={() => handleClick(btn)}
          className={`
            h-14 flex items-center justify-center rounded-md active:scale-95 transition-transform
            ${btn === 'OK' ? 'bg-primary text-white row-span-1' : 'bg-white text-gray-900'}
            ${btn === 'date' ? 'text-gray-500' : ''}
          `}
        >
          {renderContent(btn)}
        </button>
      ))}
    </div>
  );
};

export default Keypad;
