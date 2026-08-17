import React, { useRef, useState } from 'react';
import { PromptState } from '../types';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface StyleManagerProps {
  state: PromptState;
  updateState: (updates: Partial<PromptState>) => void;
}

const StyleManager: React.FC<StyleManagerProps> = ({ state, updateState }) => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    // Only save style related fields (excluding environment and negative prompts as requested)
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

    const blob = new Blob([JSON.stringify(styleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `styles-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: 'استایل‌ها با موفقیت ذخیره شدند.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Simple validation check: does it have at least one known key?
        if (!('artStyles' in json) && !('lighting' in json)) {
           throw new Error('Invalid format');
        }

        updateState({
          ...json,
          // Ensure we don't overwrite main fields or excluded style fields
          subject: state.subject,
          timePlace: state.timePlace,
          action: state.action,
          environment: state.environment,
          negativePrompts: state.negativePrompts
        });

        setMessage({ type: 'success', text: 'استایل‌ها با موفقیت بارگذاری شدند.' });
      } catch (err) {
        setMessage({ type: 'error', text: 'فایل نامعتبر است یا فرمت اشتباه می‌باشد.' });
      } finally {
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => setMessage(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-app-card border border-app-border rounded-2xl p-8 text-center shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 text-white">مدیریت استایل‌ها</h2>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex-1 flex flex-col items-center justify-center gap-3 p-6 bg-app-bg border border-app-border rounded-xl hover:border-app-primary hover:bg-app-primary/10 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-app-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download size={32} className="text-app-primary" />
            </div>
            <span className="text-lg font-bold">ذخیره استایل‌ها</span>
            <span className="text-xs text-gray-500">دانلود فایل JSON تنظیمات فعلی</span>
          </button>

          {/* Load Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-3 p-6 bg-app-bg border border-app-border rounded-xl hover:border-green-500/50 hover:bg-green-500/10 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={32} className="text-green-500" />
            </div>
            <span className="text-lg font-bold">بارگذاری استایل‌ها</span>
            <span className="text-xs text-gray-500">انتخاب فایل JSON برای اعمال تنظیمات</span>
          </button>
          
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            className="hidden"
            onChange={handleLoad}
          />
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`mt-8 p-4 rounded-xl border flex items-center justify-center gap-2 animate-fadeIn
            ${message.type === 'success' 
              ? 'bg-green-900/20 border-green-500/50 text-green-400' 
              : 'bg-red-900/20 border-red-500/50 text-red-400'
            }`}
          >
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold">{message.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleManager;
