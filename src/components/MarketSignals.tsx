import { Coins, Fuel, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useMarkets } from '../hooks/useDashboardData';

export const MarketSignals = () => {
  const { signals } = useMarkets();

  return (
    <div className="flex flex-col gap-6 h-full">
      {signals.map((signal) => (
        <SignalCard
          key={signal.id}
          icon={signal.id === 'gold' ? Coins : Fuel} 
          label={signal.label}
          value={signal.value}
          change={signal.change}
          isUp={signal.isUp}
          color={signal.id === 'gold' ? "border-yellow-500" : "border-primary"}
          bgColor={signal.id === 'gold' ? "bg-yellow-100" : "bg-blue-100"}
          iconColor={signal.id === 'gold' ? "text-yellow-700" : "text-blue-700"}
          lastUpdated={signal.lastUpdated}
        />
      ))}
    </div>
  );
};

interface SignalCardProps {
  icon: any;
  label: string;
  value: string;
  change: string;
  isUp: boolean;
  color: string;
  bgColor: string;
  iconColor: string;
  lastUpdated: string;
}

const SignalCard = ({ icon: Icon, label, value, change, isUp, color, bgColor, iconColor, lastUpdated }: SignalCardProps) => (
  <div className={cn(
    "flex-1 neu-flat p-10 flex items-center justify-between border-l-[8px] transition-all hover:scale-[1.03] duration-500",
    color
  )}>
    <div className="flex items-center gap-8">
      <div className={cn("w-20 h-20 rounded-full flex items-center justify-center shadow-clay-button border border-white/40", bgColor)}>
        <Icon className={cn("w-10 h-10", iconColor)} />
      </div>
      <div>
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.3em] mb-2 opacity-60">
          {label}
        </h3>
        <p className="text-4xl font-plus-jakarta font-black text-on-surface tracking-tighter">{value}</p>
      </div>
    </div>
    <div className="text-right">
      <span className={cn(
        "text-lg font-black flex items-center gap-1 justify-end mb-2 tracking-tight",
        isUp ? "text-emerald-500" : "text-error"
      )}>
        {isUp ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
        {change}
      </span>
      <span className="text-[10px] text-on-surface-variant opacity-50 font-black uppercase tracking-[0.1em]">Verified: {lastUpdated}</span>
    </div>
  </div>
);
