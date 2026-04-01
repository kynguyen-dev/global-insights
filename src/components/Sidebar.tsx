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
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col py-6 space-y-2 shadow-sidebar font-be-vietnam text-sm font-semibold">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-plus-jakarta text-lg font-extrabold text-blue-900 dark:text-blue-200 leading-tight">
              Global Insights
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Soft UI v1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-grow px-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            activeProps={{
              className: "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-clay-inset"
            }}
            inactiveProps={{
              className: "text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100/50 dark:hover:bg-slate-900/50"
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ease-in-out"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "")} />
                <span>{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </nav>

      <div className="px-4 mt-auto space-y-2">
        <div className="pt-4 border-t border-slate-100/50">
          <button className="w-full text-slate-500 px-4 py-2 flex items-center gap-3 hover:text-primary transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
