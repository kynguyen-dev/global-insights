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
    "flex-1 bg-surface-container-highest rounded-3xl p-6 flex items-center justify-between clay-card border-l-4 transition-all hover:scale-[1.02]",
    color
  )}>
    <div className="flex items-center gap-4">
      <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", bgColor)}>
        <Icon className={cn("w-8 h-8", iconColor)} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </h3>
        <p className="text-2xl font-plus-jakarta font-extrabold text-on-surface">{value}</p>
      </div>
    </div>
    <div className="text-right">
      <span className={cn(
        "text-xs font-bold flex items-center gap-1 justify-end",
        isUp ? "text-emerald-600" : "text-error"
      )}>
        {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {change}
      </span>
      <span className="text-[10px] text-on-surface-variant">Last updated: {lastUpdated}</span>
    </div>
  </div>
);
