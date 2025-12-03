import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Save, 
  Code, 
  Copy, 
  Upload, 
  Download, 
  Wand2, 
  Palette, 
  AlertTriangle,
  Check 
} from 'lucide-react';

import * as CONSTANTS from './constants';
import { PromptState, PageType } from './types';
import { generateImagePrompt } from './services/geminiService';
import { TextInput, TextArea, MultiSelect, SingleSelect, ProgressBar } from './components/UIComponents';

const App: React.FC = () => {
  // --- State ---
  const [activePage, setActivePage] = useState<PageType>('builder');
  const [formData, setFormData] = useState<PromptState>(CONSTANTS.INITIAL_STATE);
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  // Notification State
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // --- Handlers ---

  const showNotification = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdate = <K extends keyof PromptState>(key: K, value: PromptState[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // --- Validation ---
  const isFormValid = formData.subject.trim() !== '' && 
                      formData.timePlace.trim() !== '' && 
                      formData.actionJob.trim() !== '';

  const handleGenerateClick = async () => {
    if (!isFormValid) {
      showNotification('لطفاً تمام فیلدهای ستاره‌دار را پر کنید.', 'error');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedPrompt('');

    // Simulate "Windows Copy" loading bar (3-4 seconds)
    const duration = 3500; 
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, intervalTime);

    // Call API (happens in parallel with animation, but we wait for animation to finish before showing)
    try {
      const prompt = await generateImagePrompt(formData);
      
      // Ensure we wait for the animation to complete
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratedPrompt(prompt);
      }, duration);
      
    } catch (e) {
      setIsGenerating(false);
      showNotification('خطا در تولید پرامپت', 'error');
    }
  };

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(msg);
      setTimeout(() => setCopySuccess(null), 2000);
    });
  };

  // --- Style Manager Logic ---

  const saveStyles = () => {
    // Exclude environment and negativeWords
    const { environment, negativeWords, subject, timePlace, actionJob, ...stylesToSave } = formData;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stylesToSave));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "styles.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    showNotification('استایل‌ها با موفقیت ذخیره شدند.', 'success');
  };

  const loadStyles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
            if (e.target?.result && typeof e.target.result === 'string') {
                const loadedStyles = JSON.parse(e.target.result);
                // Merge with current state, but keep main fields intact
                setFormData(prev => ({
                    ...prev,
                    ...loadedStyles,
                    // Ensure main fields are NOT overwritten
                    subject: prev.subject,
                    timePlace: prev.timePlace,
                    actionJob: prev.actionJob,
                    // Ensure excluded fields are NOT overwritten by file (if they exist in file by mistake)
                    environment: prev.environment,
                    negativeWords: prev.negativeWords
                }));
                showNotification('استایل‌ها با موفقیت بارگذاری شدند.', 'success');
            }
        } catch (error) {
            showNotification('فایل نامعتبر یا فرمت اشتباه است.', 'error');
        }
      };
    }
  };

  const getJsSnippet = () => {
    const { environment, negativeWords, subject, timePlace, actionJob, ...styles } = formData;
    return `const promptStyles = ${JSON.stringify(styles, null, 2)};`;
  };

  // --- Render Helpers ---

  const renderNav = () => (
    <nav className="flex justify-center gap-4 mb-8 bg-slate-900/50 p-2 rounded-2xl border border-purple-900/30 backdrop-blur-sm sticky top-4 z-50 shadow-xl w-full max-w-lg mx-auto">
      <button 
        onClick={() => setActivePage('builder')}
        className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activePage === 'builder' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-300 hover:bg-purple-900/40'}`}
      >
        <Wand2 size={18} />
        <span>ساخت پرامپت</span>
      </button>
      <button 
        onClick={() => setActivePage('manager')}
        className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activePage === 'manager' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-300 hover:bg-purple-900/40'}`}
      >
        <Save size={18} />
        <span>مدیریت استایل</span>
      </button>
      <button 
        onClick={() => setActivePage('extractor')}
        className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activePage === 'extractor' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-300 hover:bg-purple-900/40'}`}
      >
        <Code size={18} />
        <span>استخراج کد</span>
      </button>
    </nav>
  );

  const renderBuilder = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      {/* Left Panel: Main Inputs (Sticky on Desktop) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900/80 border border-purple-900/50 p-6 rounded-2xl shadow-xl sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-purple-300 border-b border-purple-800/50 pb-2">
            <Sparkles size={20} />
            <h2 className="font-bold text-lg">اطلاعات اصلی</h2>
          </div>
          
          <TextInput 
            label="سوژه" 
            value={formData.subject}
            onChange={(e) => handleUpdate('subject', e.target.value)}
            required
            placeholder="مثلا: یک گربه فضانورد..."
            hint="موضوع اصلی صحنه یا چیزی که می‌خواهید مدل روی آن تمرکز کند را وارد کنید."
          />
          
          <TextInput 
            label="زمان و مکان" 
            value={formData.timePlace}
            onChange={(e) => handleUpdate('timePlace', e.target.value)}
            required
            placeholder="مثلا: سیاره مریخ در هنگام غروب..."
            hint="زمان و مکان دقیق رخداد را بنویسید"
            className="mt-4"
          />
          
          <TextInput 
            label="فعل و موقعیت کاری" 
            value={formData.actionJob}
            onChange={(e) => handleUpdate('actionJob', e.target.value)}
            required
            placeholder="مثلا: در حال تعمیر سفینه فضایی..."
            hint="بنویسید سوژه در حال انجام چه کاری است یا چه وضعیتی دارد."
            className="mt-4"
          />

          <button
            onClick={handleGenerateClick}
            disabled={!isFormValid || isGenerating}
            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg
              ${!isFormValid 
                ? 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/50 hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
             {isGenerating ? 'در حال پردازش...' : 'ساخت پرامپت'}
             {!isGenerating && <Wand2 size={20} />}
          </button>
          
          {!isFormValid && (
             <div onClick={handleGenerateClick} className="mt-2 text-red-400 text-xs text-center opacity-80">
               * برای فعال شدن دکمه، فیلدهای ستاره‌دار را پر کنید
             </div>
          )}
        </div>
      </div>

      {/* Right Panel: Styles & Output */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Output Section (Visible when generating or generated) */}
        {(isGenerating || generatedPrompt) && (
           <div className="bg-slate-900 border border-green-900/50 p-6 rounded-2xl shadow-2xl animate-fadeIn">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-green-400 text-sm font-mono">
                    <span>Creating masterpiece...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <ProgressBar progress={progress} />
                  <p className="text-center text-slate-400 text-sm animate-pulse pt-2">در حال ترجمه و بهینه‌سازی توسط هوش مصنوعی...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="text-green-400 font-bold flex items-center gap-2">
                      <Check size={18} />
                      پرامپت نهایی
                    </h3>
                    <button 
                      onClick={() => copyToClipboard(generatedPrompt, 'کپی شد!')}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm bg-slate-800 px-3 py-1 rounded-lg"
                    >
                      {copySuccess === 'کپی شد!' ? <span className="text-green-400">کپی شد!</span> : <><Copy size={14} /> کپی</>}
                    </button>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-slate-800 font-mono text-gray-300 leading-relaxed text-left" dir="ltr">
                    {generatedPrompt}
                  </div>
                </div>
              )}
           </div>
        )}

        {/* Styles Form */}
        <div className="bg-slate-900/80 border border-purple-900/50 p-6 rounded-2xl shadow-xl">
           <div className="flex items-center gap-2 mb-6 text-purple-300 border-b border-purple-800/50 pb-2">
            <Palette size={20} />
            <h2 className="font-bold text-lg">تنظیمات و استایل‌ها</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MultiSelect 
              label="سبک هنری"
              options={CONSTANTS.STYLES}
              selected={formData.styles}
              onChange={(val) => handleUpdate('styles', val)}
            />
            
            <MultiSelect 
              label="نورپردازی"
              options={CONSTANTS.LIGHTING}
              selected={formData.lighting}
              onChange={(val) => handleUpdate('lighting', val)}
            />
            
            <div className="md:col-span-2">
              <TextInput 
                label="محیط و بک‌گراند"
                value={formData.environment}
                onChange={(e) => handleUpdate('environment', e.target.value)}
                placeholder="توصیف جزئیات محیط..."
              />
            </div>

            <div className="flex flex-col gap-2">
               <MultiSelect 
                label="پالت رنگی"
                options={CONSTANTS.PALETTE}
                selected={formData.palette}
                onChange={(val) => handleUpdate('palette', val)}
              />
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-purple-900/30 mt-1">
                 <input 
                   type="color" 
                   value={formData.customColor}
                   onChange={(e) => handleUpdate('customColor', e.target.value)}
                   className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                 />
                 <span className="text-xs text-purple-400">رنگ خاص: {formData.customColor}</span>
              </div>
            </div>

            <MultiSelect 
              label="فضا و حس و حال"
              options={CONSTANTS.MOOD}
              selected={formData.mood}
              onChange={(val) => handleUpdate('mood', val)}
            />

            <MultiSelect 
              label="کیفیت"
              options={CONSTANTS.QUALITY}
              selected={formData.quality}
              onChange={(val) => handleUpdate('quality', val)}
            />

            <MultiSelect 
              label="کلمات شتاب‌دهنده"
              options={CONSTANTS.ACCELERATORS}
              selected={formData.accelerators}
              onChange={(val) => handleUpdate('accelerators', val)}
            />

            <SingleSelect 
               label="ابعاد تصویر"
               options={CONSTANTS.ASPECT_RATIOS}
               value={formData.aspectRatio}
               onChange={(val) => handleUpdate('aspectRatio', val)}
            />

            <MultiSelect 
              label="زاویه دوربین"
              options={CONSTANTS.CAMERA_ANGLES}
              selected={formData.cameraAngles}
              onChange={(val) => handleUpdate('cameraAngles', val)}
            />

            <MultiSelect 
              label="لنز دوربین"
              options={CONSTANTS.CAMERA_LENSES}
              selected={formData.cameraLenses}
              onChange={(val) => handleUpdate('cameraLenses', val)}
            />
            
            <div className="md:col-span-2">
              <TextArea 
                label="کلمات سلبی (Negative Prompts)"
                value={formData.negativeWords}
                onChange={(e) => handleUpdate('negativeWords', e.target.value)}
                placeholder="چیزهایی که نمی‌خواهید در تصویر باشد..."
                hint="با کاما جدا کنید"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManager = () => (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-slate-900/80 border border-purple-900/50 p-8 rounded-3xl shadow-xl text-center">
        <Save size={48} className="mx-auto text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">ذخیره استایل‌ها</h2>
        <p className="text-purple-300 mb-6">تنظیمات فرعی (به جز محیط و کلمات سلبی) را در یک فایل ذخیره کنید.</p>
        <button 
          onClick={saveStyles}
          className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all shadow-lg shadow-purple-600/20"
        >
          <Download size={20} />
          ذخیره فایل استایل
        </button>
      </div>

      <div className="bg-slate-900/80 border border-purple-900/50 p-8 rounded-3xl shadow-xl text-center">
        <Upload size={48} className="mx-auto text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">بارگذاری استایل‌ها</h2>
        <p className="text-purple-300 mb-6">فایل استایل ذخیره شده را انتخاب کنید تا تنظیمات اعمال شوند.</p>
        <div className="relative inline-block">
          <input 
            type="file" 
            accept=".json"
            onChange={loadStyles}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all">
            <Upload size={20} />
            انتخاب فایل JSON
          </button>
        </div>
      </div>
    </div>
  );

  const renderExtractor = () => (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-slate-900/80 border border-purple-900/50 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Code size={24} className="text-yellow-400" />
          <h2 className="text-xl font-bold text-white">استخراج کد جاوااسکریپت</h2>
        </div>
        <p className="text-purple-300 mb-6 leading-relaxed">
          از این بخش می‌توانید آبجکت تنظیمات فعلی (به جز موارد متنی خاص) را به صورت کد جاوااسکریپت دریافت کنید.
          این کد برای توسعه‌دهندگان یا ذخیره در دیتابیس‌های شخصی کاربرد دارد.
        </p>

        <div className="relative bg-black rounded-xl p-4 border border-slate-800 group">
          <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap" dir="ltr">
            {getJsSnippet()}
          </pre>
          <button 
            onClick={() => copyToClipboard(getJsSnippet(), 'کد استایل‌ها کپی شد!')}
            className="absolute top-4 right-4 bg-slate-800 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700"
            title="کپی کد"
          >
            <Copy size={16} />
          </button>
        </div>

        <button 
           onClick={() => copyToClipboard(getJsSnippet(), 'کد استایل‌ها کپی شد!')}
           className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl border border-slate-700 transition-all flex justify-center gap-2"
        >
          <Copy size={18} />
          کپی کردن کد در کلیپ‌بورد
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0518] text-gray-100 p-4 font-vazir relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-8 pt-6">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2 drop-shadow-lg">
            پرامپت‌ساز حرفه‌ای
          </h1>
          <p className="text-purple-300/60 text-sm md:text-base">ابزار پیشرفته تولید پرامپت برای هوش مصنوعی</p>
        </header>

        {renderNav()}

        <main className="min-h-[600px]">
          {activePage === 'builder' && renderBuilder()}
          {activePage === 'manager' && renderManager()}
          {activePage === 'extractor' && renderExtractor()}
        </main>
      </div>

      {/* Global Notification Toast */}
      {notification && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-slideUp
          ${notification.type === 'success' ? 'bg-green-900/90 text-green-100 border border-green-700' : 'bg-red-900/90 text-red-100 border border-red-700'}
        `}>
          {notification.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          <span className="font-medium">{notification.msg}</span>
        </div>
      )}

      {/* Copy Success Toast (Floating) */}
      {copySuccess && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 z-[60] animate-bounce">
          <Check size={14} className="text-green-400" />
          <span className="text-sm">{copySuccess}</span>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: #0f0518; }
        .custom-scrollbar::-webkit-scrollbar-thumb { bg: #4c1d95; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;