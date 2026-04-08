import { Coins, Fuel, TrendingUp, TrendingDown, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useMarkets, type MarketSignal } from '../hooks/useDashboardData';

export const MarketSignals = () => {
  const { signals } = useMarkets();

  return (
    <div className="flex flex-col gap-4 h-full">
      {signals.map((signal) => (
        <SignalCard
          key={signal.id}
          signal={signal}
          icon={signal.id === 'gold' ? Coins : Fuel} 
          color={signal.id === 'gold' ? "border-yellow-500" : "border-primary"}
          bgColor={signal.id === 'gold' ? "bg-yellow-100" : "bg-blue-100"}
          iconColor={signal.id === 'gold' ? "text-yellow-700" : "text-blue-700"}
          isLoading={signal.value === 'Loading...'}
          hasError={signal.value === 'N/A'}
        />
      ))}
    </div>
  );
};

interface SignalCardProps {
  signal: MarketSignal;
  icon: any;
  color: string;
  bgColor: string;
  iconColor: string;
  isLoading?: boolean;
  hasError?: boolean;
}

const SignalCard = ({ signal, icon: Icon, color, bgColor, iconColor, isLoading, hasError }: SignalCardProps) => (
  <div className={cn(
    "flex-1 neu-flat p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-l-[6px] transition-all hover:scale-[1.02] duration-500 gap-3",
    color
  )}>
    <div className="flex items-center gap-3 sm:gap-5">
      <div className={cn("w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-clay-button border border-white/40 flex-shrink-0", bgColor)}>
        {isLoading ? (
          <Loader2 className={cn("w-5 h-5 sm:w-7 sm:h-7 animate-spin", iconColor)} />
        ) : hasError ? (
          <AlertTriangle className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600" />
        ) : (
          <Icon className={cn("w-5 h-5 sm:w-7 sm:h-7", iconColor)} />
        )}
      </div>
      <div>
        <h3 className="text-[10px] sm:text-xs font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1 opacity-60">
          {signal.label}
        </h3>
        {signal.type && (
          <span className="text-[9px] sm:text-[10px] font-bold text-primary/70 dark:text-primary/50 uppercase tracking-widest mb-1 block">
            {signal.type}
          </span>
        )}
        <p className={cn(
          "text-xl sm:text-3xl font-plus-jakarta font-black text-on-surface tracking-tighter",
          isLoading && "animate-pulse text-on-surface-variant"
        )}>
          {signal.value}
        </p>
      </div>
    </div>
    <div className="text-right ml-auto sm:ml-0">
      <span className={cn(
        "text-sm sm:text-base font-black flex items-center gap-1 justify-end mb-1 tracking-tight",
        signal.isUp ? "text-emerald-500" : "text-error"
      )}>
        {signal.isUp ? <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" /> : <TrendingDown className="w-4 h-4 sm:w-6 sm:h-6" />}
        {signal.change}
      </span>
      <span className="text-[9px] sm:text-[10px] text-on-surface-variant opacity-50 font-black uppercase tracking-[0.1em]">Verified: {signal.lastUpdated}</span>
    </div>
  </div>
);
