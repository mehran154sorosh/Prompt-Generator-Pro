import React, { useState } from 'react';
import { PromptState } from '../types';
import * as Constants from '../constants';
import MultiSelect from '../components/MultiSelect';
import SingleSelect from '../components/SingleSelect';
import LoadingBar from '../components/LoadingBar';
import { Wand2, Copy, Settings, Info } from 'lucide-react';

interface BuilderProps {
  state: PromptState;
  updateState: (updates: Partial<PromptState>) => void;
}

const Builder: React.FC<BuilderProps> = ({ state, updateState }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Validation
  const isValid = state.subject.trim().length > 0 && 
                  state.timePlace.trim().length > 0 && 
                  state.action.trim().length > 0;

  const handleGenerate = () => {
    if (!isValid) {
      setError('لطفاً تمام فیلدهای ستاره‌دار را پر کنید.');
      return;
    }
    setError('');
    setIsGenerating(true);
    setGeneratedPrompt('');
    setCopied(false);
  };

  const onGenerationComplete = () => {
    setIsGenerating(false);
    constructPrompt();
  };

  const constructPrompt = () => {
    // Construct the prompt string
    const parts = [
      state.subject,
      state.action,
      state.timePlace,
      state.environment,
      ...state.artStyles,
      ...state.lighting,
      state.useCustomColor ? `Color: ${state.customColor}` : state.colorPalette,
      ...state.mood,
      state.quality,
      ...state.boosters,
      ...state.cameraAngle,
      ...state.cameraLens
    ].filter(p => p && p.trim() !== '');

    let prompt = parts.join(', ');

    // Add technical parameters
    if (state.aspectRatio) prompt += ` --ar ${state.aspectRatio}`;
    if (state.negativePrompts) prompt += ` --no ${state.negativePrompts}`;

    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Right Panel: Main Info (Primary) - Order 1 (Top/Right) */}
      <div className="lg:w-1/2 order-1">
        <div className="bg-app-card/80 backdrop-blur-md p-6 rounded-2xl border border-app-primary/30 shadow-lg shadow-app-primary/5 sticky top-6">
          <div className="flex items-center gap-2 mb-6 text-white">
            <Info size={20} className="text-app-primary" />
            <h2 className="text-xl font-bold">اطلاعات اصلی</h2>
          </div>

          {/* Subject Field */}
          <div className="mb-6">
            <label className="block text-base font-bold mb-2 text-white">
              سوژه <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.subject}
              onChange={(e) => updateState({ subject: e.target.value })}
              placeholder="مثلا: یک گربه فضانورد..."
              className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-white focus:border-app-primary focus:ring-1 focus:ring-app-primary outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">موضوع اصلی صحنه یا چیزی که می‌خواهید مدل روی آن تمرکز کند را وارد کنید.</p>
          </div>

          {/* Time & Place Field */}
          <div className="mb-6">
            <label className="block text-base font-bold mb-2 text-white">
              زمان و مکان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.timePlace}
              onChange={(e) => updateState({ timePlace: e.target.value })}
              placeholder="مثلا: سیاره مریخ در هنگام غروب..."
              className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-white focus:border-app-primary focus:ring-1 focus:ring-app-primary outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">زمان و مکان دقیق رخداد را بنویسید</p>
          </div>

          {/* Action Field */}
          <div className="mb-8">
            <label className="block text-base font-bold mb-2 text-white">
              فعل و موقعیت کاری <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.action}
              onChange={(e) => updateState({ action: e.target.value })}
              placeholder="مثلا: در حال تعمیر سفینه فضایی..."
              className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-white focus:border-app-primary focus:ring-1 focus:ring-app-primary outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">بنویسید سوژه در حال انجام چه کاری است یا چه وضعیتی دارد.</p>
          </div>

          {/* Generate Button */}
          {!isGenerating && !generatedPrompt && (
            <button
              onClick={handleGenerate}
              disabled={!isValid}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300
                ${isValid 
                  ? 'bg-gradient-to-r from-app-primary to-purple-600 hover:from-app-primaryHover hover:to-purple-500 text-white shadow-lg shadow-purple-900/40 transform hover:-translate-y-1' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
            >
              <Wand2 size={24} />
              ساخت پرامپت
            </button>
          )}

          {/* Error Message */}
          {error && (
            <p className="mt-3 text-red-500 text-sm text-center font-bold bg-red-900/20 py-2 rounded-lg border border-red-900/50">
              {error}
            </p>
          )}

          <p className="text-xs text-gray-600 mt-3 text-center">* برای فعال شدن دکمه، فیلدهای ستاره‌دار را پر کنید</p>

          {/* Loading State */}
          {isGenerating && (
            <div className="mt-6 animate-fadeIn">
              <p className="text-center text-green-400 mb-2 text-sm font-mono">در حال پردازش...</p>
              <LoadingBar onComplete={onGenerationComplete} />
            </div>
          )}

          {/* Result State */}
          {generatedPrompt && !isGenerating && (
            <div className="mt-8 animate-slideUp">
              <div className="bg-black/40 border border-green-500/30 rounded-xl p-4 relative group">
                <label className="text-xs text-green-500 uppercase font-mono mb-2 block tracking-wider">Generated Prompt</label>
                <p className="text-gray-200 text-sm leading-relaxed font-mono break-words" dir="ltr">
                  {generatedPrompt}
                </p>
                
                <button
                  onClick={copyToClipboard}
                  className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-lg py-2 flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? (
                    <>
                      <span className="text-green-400 font-bold">کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      کپی پرامپت
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setGeneratedPrompt('')}
                className="mt-4 text-gray-500 text-sm hover:text-white underline w-full text-center"
              >
                ساخت یک پرامپت جدید
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Left Panel: Styles & Settings (Secondary) - Order 2 (Bottom/Left) */}
      <div className="lg:w-1/2 order-2 bg-app-card/50 backdrop-blur-sm p-6 rounded-2xl border border-app-border h-fit">
        <div className="flex items-center gap-2 mb-6 text-app-primary">
          <Settings size={20} />
          <h2 className="text-xl font-bold">تنظیمات و استایل‌ها</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiSelect 
            label="سبک هنری" 
            options={Constants.ART_STYLES} 
            selected={state.artStyles} 
            onChange={(val) => updateState({ artStyles: val })} 
          />
          <MultiSelect 
            label="نورپردازی" 
            options={Constants.LIGHTING} 
            selected={state.lighting} 
            onChange={(val) => updateState({ lighting: val })} 
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-1 text-app-text">محیط و پس‌زمینه</label>
          <input
            type="text"
            value={state.environment}
            onChange={(e) => updateState({ environment: e.target.value })}
            placeholder="توصیف جزئیات محیط..."
            className="w-full bg-app-card border border-app-border rounded-lg px-3 py-2 text-sm text-white focus:border-app-primary outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SingleSelect 
              label="پالت رنگی" 
              options={Constants.COLOR_PALETTES} 
              value={state.colorPalette} 
              onChange={(val) => updateState({ colorPalette: val, useCustomColor: false })} 
            />
          </div>
          <div className="flex flex-col justify-end mb-4">
             <label className="flex items-center gap-2 cursor-pointer bg-app-bg border border-app-border p-2 rounded-lg hover:border-app-primary/50 transition-colors">
               <input 
                 type="checkbox" 
                 checked={state.useCustomColor} 
                 onChange={(e) => updateState({ useCustomColor: e.target.checked })}
                 className="w-4 h-4 accent-app-primary"
               />
               <span className="text-sm text-gray-300">رنگ خاص:</span>
               <input 
                 type="color" 
                 value={state.customColor}
                 disabled={!state.useCustomColor}
                 onChange={(e) => updateState({ customColor: e.target.value })}
                 className="bg-transparent w-8 h-8 rounded cursor-pointer"
               />
               <span className="text-xs font-mono text-gray-400">{state.customColor}</span>
             </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiSelect 
            label="فضا و حس و حال" 
            options={Constants.MOODS} 
            selected={state.mood} 
            onChange={(val) => updateState({ mood: val })} 
          />
          <SingleSelect 
            label="کیفیت" 
            options={Constants.QUALITIES} 
            value={state.quality} 
            onChange={(val) => updateState({ quality: val })} 
          />
        </div>
        
        <MultiSelect 
          label="کلمات شتاب‌دهنده" 
          options={Constants.BOOSTERS} 
          selected={state.boosters} 
          onChange={(val) => updateState({ boosters: val })} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SingleSelect 
            label="ابعاد تصویر" 
            options={Constants.ASPECT_RATIOS} 
            value={state.aspectRatio} 
            onChange={(val) => updateState({ aspectRatio: val })} 
          />
          <MultiSelect 
            label="زاویه دوربین" 
            options={Constants.CAMERA_ANGLES} 
            selected={state.cameraAngle} 
            onChange={(val) => updateState({ cameraAngle: val })} 
          />
        </div>

        <MultiSelect 
          label="لنز دوربین" 
          options={Constants.CAMERA_LENSES} 
          selected={state.cameraLens} 
          onChange={(val) => updateState({ cameraLens: val })} 
        />

        <div className="mt-4">
          <label className="block text-sm font-bold mb-1 text-app-text">کلمات سلبی (Negative Prompts)</label>
          <textarea
            value={state.negativePrompts}
            onChange={(e) => updateState({ negativePrompts: e.target.value })}
            placeholder="چیزهایی که نمی‌خواهید در تصویر باشد..."
            rows={3}
            className="w-full bg-app-card border border-app-border rounded-lg px-3 py-2 text-sm text-white focus:border-app-primary outline-none transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Builder;