import { Search, Bell, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Topbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full h-24 sticky top-0 z-40 bg-surface/80 backdrop-blur-2xl flex justify-between items-center px-10 shadow-clay-card border-b border-white/20 transition-all duration-300">
      <div className="flex items-center gap-12 grow">
        <span className="text-3xl font-extrabold text-blue-900 dark:text-blue-100 font-plus-jakarta tracking-tighter">
          Insights <span className="text-primary">Hub</span>
        </span>
        <div className="relative w-[500px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            className="w-full bg-surface-container-low dark:bg-black/20 border-none rounded-full pl-16 pr-8 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/20 neu-inset outline-none dark:text-white transition-all duration-300 placeholder:text-slate-400 placeholder:font-medium"
            placeholder="Explore markets, climate, or news..."
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-4 bg-surface shadow-clay-button rounded-full text-slate-500 active:scale-90 transition-all duration-300 border border-white/40 hover:text-primary"
        >
          {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6 text-yellow-500" />}
        </button>
        <button className="p-4 bg-surface shadow-clay-button rounded-full text-slate-500 active:scale-90 transition-all duration-300 border border-white/40 hover:text-primary">
          <Bell className="w-6 h-6" />
        </button>
        <button className="p-4 bg-surface shadow-clay-button rounded-full text-slate-500 active:scale-90 transition-all duration-300 border border-white/40 hover:text-primary">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};


