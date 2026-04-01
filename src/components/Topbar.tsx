import { Search, Bell, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Topbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex justify-between items-center px-6 shadow-topbar border-b border-white/20">
      <div className="flex items-center gap-8 grow">
        <span className="text-xl font-bold text-blue-800 dark:text-blue-300 font-plus-jakarta">
          Market Insights
        </span>
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-full pl-12 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 shadow-clay-inset outline-none dark:text-white"
            placeholder="Search markets, weather, or news..."
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-all text-slate-500 active:scale-95 duration-200"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-500" />}
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-all text-slate-500 active:scale-95 duration-200">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-all text-slate-500 active:scale-95 duration-200">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
