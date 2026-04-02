import { Link } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Cloud, 
  FileText, 
  BarChart3, 
  HelpCircle, 
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Markets', path: '/markets' },
  { icon: Cloud, label: 'Weather', path: '/weather' },
  { icon: FileText, label: 'News', path: '/news' },
  { icon: BarChart3, label: 'Analysis', path: '/analysis' },
];

export const Sidebar = () => {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-surface flex flex-col py-10 space-y-4 shadow-neu-flat border-r border-white/10 font-manrope text-sm font-bold transition-all duration-300">
      <div className="px-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-clay-button border border-white/30">
            <TrendingUp className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="font-plus-jakarta text-2xl font-extrabold text-blue-900 dark:text-blue-100 leading-tight tracking-tight">
              Global
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-black opacity-80">Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-grow px-4 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            activeProps={{
              className: "neu-inset text-primary scale-[0.98]"
            }}
            inactiveProps={{
              className: "text-slate-400 hover:text-primary hover:bg-white/50 dark:hover:bg-black/20"
            }}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-5 rounded-full transition-all duration-300 ease-in-out group"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-6 h-6 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className="tracking-tight">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </nav>

      <div className="px-6 mt-auto pb-10">
        <div className="pt-8 border-t border-white/20 dark:border-black/20">
          <button className="w-full text-slate-400 px-6 py-4 flex items-center gap-4 hover:text-primary transition-all rounded-full hover:bg-white/50 dark:hover:bg-black/20">
            <HelpCircle className="w-6 h-6" />
            <span className="font-bold">Help Center</span>
          </button>
        </div>
      </div>
    </aside>
  );
};


