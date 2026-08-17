import React, { useState } from 'react';
import { PromptState, TabType } from './types';
import { INITIAL_STATE } from './constants';
import Builder from './pages/Builder';
import StyleManager from './pages/StyleManager';
import Extractor from './pages/Extractor';
import { Wand2, Save, Code, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('builder');
  const [formData, setFormData] = useState<PromptState>(INITIAL_STATE);

  const updateState = (updates: Partial<PromptState>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text p-4 pb-12 selection:bg-app-primary selection:text-white">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 pt-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-2 drop-shadow-lg tracking-tight">
          پرامپت‌ساز حرفه‌ای
        </h1>
        <p className="text-app-muted text-sm md:text-base">ابزار پیشرفته تولید پرامپت برای هوش مصنوعی</p>
      </header>

      {/* Navigation */}
      <nav className="max-w-2xl mx-auto mb-10">
        <div className="bg-app-card border border-app-border rounded-2xl p-1 flex justify-between gap-1 shadow-lg">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold text-sm sm:text-base
              ${activeTab === 'builder' 
                ? 'bg-app-primary text-white shadow-lg shadow-app-primary/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Zap size={18} />
            ساخت پرامپت
          </button>

          <button
            onClick={() => setActiveTab('styles')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold text-sm sm:text-base
              ${activeTab === 'styles' 
                ? 'bg-app-primary text-white shadow-lg shadow-app-primary/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Save size={18} />
            مدیریت استایل
          </button>

          <button
            onClick={() => setActiveTab('extract')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold text-sm sm:text-base
              ${activeTab === 'extract' 
                ? 'bg-app-primary text-white shadow-lg shadow-app-primary/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Code size={18} />
            استخراج کد
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto animate-fadeIn">
        {activeTab === 'builder' && (
          <Builder state={formData} updateState={updateState} />
        )}
        {activeTab === 'styles' && (
          <StyleManager state={formData} updateState={updateState} />
        )}
        {activeTab === 'extract' && (
          <Extractor state={formData} updateState={updateState} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-700 mt-16 pb-4">
        طراحی شده با React و Tailwind
      </footer>

      {/* Global CSS styles for simple animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;