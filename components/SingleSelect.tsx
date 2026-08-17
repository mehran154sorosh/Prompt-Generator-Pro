import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SingleSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const SingleSelect: React.FC<SingleSelectProps> = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <label className="block text-sm font-bold mb-1 text-app-text">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-app-card border border-app-border rounded-lg px-3 py-2 text-right flex justify-between items-center hover:border-app-primary/50 transition-colors"
      >
        <span className={`text-sm ${value ? 'text-white' : 'text-gray-400'}`}>
          {value || 'انتخاب کنید...'}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-app-card border border-app-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-right px-4 py-2 text-sm transition-colors 
                ${value === option ? 'bg-app-primary/20 text-app-primary' : 'text-gray-200 hover:bg-app-primary/10'}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
