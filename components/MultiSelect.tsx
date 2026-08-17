import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelection?: number;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      // Allow deselecting via dropdown
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option: string) => {
    onChange(selected.filter((item) => item !== option));
  };

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <label className="block text-sm font-bold mb-1 text-app-text">{label}</label>
      
      {/* Selected Chips */}
      <div className="flex flex-wrap gap-2 mb-2 min-h-[24px]">
        {selected.map((item) => (
          <span
            key={item}
            className="inline-flex items-center bg-app-primary/20 text-app-primary border border-app-primary/40 px-2 py-1 rounded-md text-xs"
          >
            {item}
            <button
              onClick={() => removeOption(item)}
              className="mr-1 hover:text-white focus:outline-none"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-app-card border border-app-border rounded-lg px-3 py-2 text-right flex justify-between items-center hover:border-app-primary/50 transition-colors"
      >
        <span className="text-sm text-gray-400">
          {selected.length > 0 ? `${selected.length} مورد انتخاب شده` : 'انتخاب کنید...'}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-app-card border border-app-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                disabled={isSelected} // "انتخاب تکراری قفل است"
                className={`w-full text-right px-4 py-2 text-sm transition-colors flex justify-between items-center
                  ${isSelected 
                    ? 'text-gray-500 cursor-not-allowed bg-app-bg/50' 
                    : 'text-gray-200 hover:bg-app-primary/20 hover:text-app-primary'
                  }`}
              >
                {option}
                {isSelected && <span className="text-xs text-app-primary">(انتخاب شده)</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
