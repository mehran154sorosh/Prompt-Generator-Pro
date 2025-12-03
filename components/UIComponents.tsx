import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, AlertCircle } from 'lucide-react';

// --- Types ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  required?: boolean;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  hint?: string;
}

// --- Components ---

export const TextInput: React.FC<InputProps> = ({ label, hint, required, className, ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-purple-200 text-sm font-medium flex gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className="bg-slate-900 border border-purple-900/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all placeholder-purple-800/50"
      />
      {hint && <span className="text-xs text-purple-400/60 font-light pr-1">{hint}</span>}
    </div>
  );
};

export const TextArea: React.FC<TextAreaProps> = ({ label, hint, className, ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-purple-200 text-sm font-medium">{label}</label>
      <textarea
        {...props}
        className="bg-slate-900 border border-purple-900/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all min-h-[100px] placeholder-purple-800/50 resize-y"
      />
      {hint && <span className="text-xs text-purple-400/60 font-light pr-1">{hint}</span>}
    </div>
  );
};

export const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange, hint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      setError(`"${option}" قبلاً انتخاب شده است.`);
      setTimeout(() => setError(null), 2000);
      return;
    }
    onChange([...selected, option]);
    setIsOpen(false);
  };

  const handleRemove = (option: string) => {
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-purple-200 text-sm font-medium">{label}</label>
      
      {/* Selected Tags Area */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {selected.map((item) => (
            <span key={item} className="bg-purple-900/60 border border-purple-700 text-purple-100 px-3 py-1 rounded-full text-xs flex items-center gap-2 animate-fadeIn">
              {item}
              <button onClick={() => handleRemove(item)} className="hover:text-red-400 transition-colors">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 border border-purple-900/50 rounded-lg px-4 py-3 text-white cursor-pointer flex justify-between items-center hover:border-purple-600 transition-colors"
      >
        <span className="text-purple-300/80 text-sm">انتخاب کنید...</span>
        <ChevronDown size={18} className={`text-purple-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-slate-950 border border-purple-800 rounded-lg shadow-2xl shadow-purple-900/20 z-50 max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 text-sm cursor-pointer transition-colors border-b border-purple-900/30 last:border-0
                ${selected.includes(option) 
                  ? 'bg-purple-900/20 text-gray-500 cursor-not-allowed' 
                  : 'text-purple-100 hover:bg-purple-800'}`}
            >
              <div className="flex justify-between items-center">
                {option}
                {selected.includes(option) && <Check size={14} className="text-green-500" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Toast inside component */}
      {error && (
        <div className="absolute -top-8 right-0 bg-red-900/90 text-red-100 text-xs px-3 py-1 rounded shadow-lg flex items-center gap-1 animate-bounce">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      {hint && <span className="text-xs text-purple-400/60 font-light pr-1">{hint}</span>}
    </div>
  );
};

export const SingleSelect: React.FC<{
  label: string; 
  options: string[]; 
  value: string; 
  onChange: (val: string) => void; 
  hint?: string
}> = ({ label, options, value, onChange, hint }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-purple-200 text-sm font-medium">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-purple-900/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none appearance-none cursor-pointer"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {hint && <span className="text-xs text-purple-400/60 font-light pr-1">{hint}</span>}
    </div>
  );
};

export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden shadow-inner border border-slate-700">
      <div 
        className="h-full bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] transition-all duration-300 ease-out flex items-center justify-center"
        style={{ width: `${progress}%` }}
      >
        {/* Shine effect */}
        <div className="w-full h-full bg-white/20 animate-pulse"></div>
      </div>
    </div>
  );
};