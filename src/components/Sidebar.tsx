import { Link } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Cloud, 
  FileText, 
  HelpCircle, 
  Coins,
  Fuel,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Coins, label: 'Gold', path: '/markets' },
  { icon: Fuel, label: 'Petrol', path: '/petrol' },
  { icon: Cloud, label: 'Weather', path: '/weather' },
  { icon: FileText, label: 'News', path: '/news' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "h-screen w-64 fixed left-0 top-0 z-[70] bg-surface flex flex-col py-10 space-y-4 shadow-neu-flat border-r border-white/10 font-manrope text-sm font-bold transition-all duration-300",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-5 right-4 p-2 rounded-full hover:bg-white/50 dark:hover:bg-black/20 text-slate-400 hover:text-primary transition-all"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-clay-button border border-white/30">
              <Coins className="text-white w-8 h-8" />
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
              onClick={onClose}
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
    </>
  );
};
