import React, { useState } from 'react';
import { PromptState } from '../types';
import { Code, Copy, Check, Download, ArrowDownToLine, AlertCircle } from 'lucide-react';

interface ExtractorProps {
  state: PromptState;
  updateState: (updates: Partial<PromptState>) => void;
}

const Extractor: React.FC<ExtractorProps> = ({ state, updateState }) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter state for display/edit (exclude environment/negative per requirements)
  const styleData = {
    artStyles: state.artStyles,
    lighting: state.lighting,
    colorPalette: state.colorPalette,
    customColor: state.customColor,
    useCustomColor: state.useCustomColor,
    mood: state.mood,
    quality: state.quality,
    boosters: state.boosters,
    aspectRatio: state.aspectRatio,
    cameraAngle: state.cameraAngle,
    cameraLens: state.cameraLens
  };

  const [jsonInput, setJsonInput] = useState(JSON.stringify(styleData, null, 2));

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Basic validation
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('فرمت JSON نامعتبر است');
      }

      updateState(parsed);
      setError('');
      setSuccess('استایل‌ها با موفقیت در منوی اصلی اعمال شدند!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError('خطا در پردازش کد. لطفاً از صحیح بودن فرمت JSON اطمینان حاصل کنید.');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-app-card border border-app-border rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-app-primary/20 p-2 rounded-lg">
                <Code className="text-app-primary" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">ویرایشگر و استخراج کد استایل</h2>
                <p className="text-xs text-gray-500 mt-1">
                  می‌توانید کد استایل را کپی کنید یا کد جدیدی را جایگذاری و اعمال نمایید.
                  <br/>
                  (محیط و کلمات منفی شامل نمی‌شوند)
                </p>
             </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handleApply}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold text-sm"
            >
              <ArrowDownToLine size={16} />
              اعمال تغییرات
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-app-primary hover:bg-app-primaryHover text-white rounded-lg transition-colors font-bold text-sm"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  کپی شد!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  کپی کد
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea 
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-96 bg-[#0b0412] p-4 rounded-xl border border-app-border text-sm text-green-400 font-mono focus:border-app-primary focus:ring-1 focus:ring-app-primary outline-none transition-all scrollbar-thin resize-none"
            spellCheck={false}
            dir="ltr"
          />
          <div className="absolute top-2 right-4 text-xs text-gray-600 select-none bg-[#0b0412]/80 px-2 rounded">JSON / JS Object</div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm animate-fadeIn">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400 text-sm animate-fadeIn">
            <Check size={18} />
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default Extractor;