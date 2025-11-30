
import React from 'react';
import { LayoutDashboard, BookOpen, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'list' | 'new';
  onTabChange: (tab: 'dashboard' | 'list' | 'new') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 md:pb-0 font-sans">
      {/* Top Navigation (Desktop) */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Smart&Lynn <span className="text-indigo-600">ProTrader</span></h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <button 
              onClick={() => onTabChange('dashboard')}
              className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ภาพรวม (Dashboard)
            </button>
            <button 
              onClick={() => onTabChange('list')}
              className={`text-sm font-medium transition-colors ${activeTab === 'list' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ประวัติการเทรด (History)
            </button>
            <button 
              onClick={() => onTabChange('new')}
              className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-colors ${activeTab === 'new' ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              + บันทึกใหม่
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom">
        <button 
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-xs font-medium">ภาพรวม</span>
        </button>
        <button 
          onClick={() => onTabChange('new')}
          className="flex flex-col items-center gap-1 -mt-8"
        >
          <div className="bg-indigo-600 rounded-full p-4 shadow-lg text-white">
            <PlusCircle className="w-8 h-8" />
          </div>
        </button>
        <button 
          onClick={() => onTabChange('list')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'list' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xs font-medium">ประวัติ</span>
        </button>
      </nav>
    </div>
  );
};
