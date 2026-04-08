import { Search, Bell, Settings, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar = ({ onMenuToggle }: TopbarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full h-16 lg:h-24 sticky top-0 z-40 bg-surface/80 backdrop-blur-2xl flex justify-between items-center px-4 sm:px-6 lg:px-10 shadow-clay-card border-b border-white/20 transition-all duration-300">
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-12 grow min-w-0">
        {/* Hamburger — mobile only, inline in the topbar */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2.5 bg-surface shadow-clay-button rounded-xl text-slate-500 active:scale-90 transition-all duration-300 border border-white/40 hover:text-primary flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-xl lg:text-3xl font-extrabold text-blue-900 dark:text-blue-100 font-plus-jakarta tracking-tighter whitespace-nowrap">
          Insights <span className="text-primary">Hub</span>
        </span>
        <div className="relative flex-1 max-w-[500px] hidden sm:block group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            className="w-full bg-surface-container-low dark:bg-black/20 border-none rounded-full pl-16 pr-8 py-3 lg:py-4 text-sm font-bold focus:ring-4 focus:ring-primary/20 neu-inset outline-none dark:text-white transition-all duration-300 placeholder:text-slate-400 placeholder:font-medium"
            placeholder="Explore markets, climate, or news..."
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-shrink-0">
        <button 
          onClick={toggleTheme}
          className="p-2.5 lg:p-4 bg-surface shadow-clay-button rounded-full text-slate-500 active:scale-90 transition-all duration-300 border border-white/40 hover:text-primary"
        >
          {theme === 'light' ? <Moon className="w-5 h-5 lg:w-6 lg:h-6" /> : <Sun className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />}
        </button>
        <button className="p-2.5 lg:p-4 bg-surface shadow-clay-button rounded-full text-slate-500 active:scale-90 transition-all duration-300 border border-white/40 hover:text-primary hidden sm:flex">
          <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        <button className="p-2.5 lg:p-4 bg-surface shadow-clay-button rounded-full text-slate-500 active:scale-90 transition-all duration-300 border border-white/40 hover:text-primary hidden sm:flex">
          <Settings className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      </div>
    </header>
  );
};
