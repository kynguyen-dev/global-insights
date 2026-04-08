import {
  Coins,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  Clock,
  DollarSign,
  BarChart3,
  Globe,
  Building2,
  ShieldCheck,
  Scale,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { cn } from '../lib/utils';
import {
  fetchGoldPrices,
  formatVndPrice,
  formatPriceChange,
  getTimeAgo,
  type GoldData,
} from '../services/goldApi';

export const GoldDetailPage = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<GoldData, Error>({
    queryKey: ['gold-prices'],
    queryFn: fetchGoldPrices,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const sjc = data?.sjc;
  const world = data?.worldGold;
  const domesticPrices = data?.allPrices.filter(p => p.currency === 'VND') || [];
  const worldPrices = data?.allPrices.filter(p => p.currency === 'USD') || [];

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 neu-flat">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 font-bold text-lg">Unable to fetch gold prices</p>
        <p className="text-red-500/70">{error.message}</p>
        <button onClick={() => refetch()} className="clay-button bg-primary text-white text-xs uppercase tracking-widest font-black mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", loading && "opacity-80")}>
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-3 px-6">
        <Link to="/markets" className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors font-bold">
          <ArrowLeft className="w-4 h-4" /> Markets
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-sm font-bold text-on-surface">Gold Prices</span>
      </div>

      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden rounded-[2rem] min-h-[360px] shadow-clay-card border border-white/20 bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 dark:from-yellow-700 dark:via-amber-700 dark:to-orange-700">
        {/* Decorative */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute left-1/2 -top-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-16 bottom-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl" />

        <div className="relative z-10 p-10">
          {/* Title row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-[0.3em] font-black">Giá Vàng SJC</p>
                  <h1 className="text-3xl font-plus-jakarta font-extrabold text-white tracking-tight">
                    Gold Price Dashboard
                  </h1>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{data?.date} • {data?.updatedAt}</span>
              </div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                Updated {data ? getTimeAgo(data.timestamp) : '...'}
              </p>
            </div>
          </div>

          {/* Big Price */}
          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="text-sm text-white/60 font-bold uppercase tracking-widest mb-1">SJC 9999 — Sell</p>
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-plus-jakarta font-extrabold text-white leading-none tracking-tighter">
                  {loading ? '...' : sjc ? new Intl.NumberFormat('vi-VN').format(sjc.sell) : 'N/A'}
                </span>
                <span className="text-2xl font-plus-jakarta text-white/50 font-bold">VNĐ</span>
              </div>
              {sjc && (
                <div className={cn(
                  "flex items-center gap-2 mt-3 text-lg font-bold",
                  sjc.changeSell >= 0 ? "text-white" : "text-red-200"
                )}>
                  {sjc.changeSell >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  {sjc.changeSell >= 0 ? '+' : ''}{new Intl.NumberFormat('vi-VN').format(sjc.changeSell)}đ
                  <span className="text-white/50 text-sm ml-1">
                    ({formatPriceChange(sjc.changeSell, sjc.sell)})
                  </span>
                </div>
              )}
            </div>

            {/* World Gold mini */}
            {world && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-right">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-black mb-1">
                  <Globe className="w-3 h-3 inline mr-1" />World Gold (XAU/USD)
                </p>
                <p className="text-3xl font-plus-jakarta font-extrabold text-white">${world.buy.toLocaleString()}</p>
                <p className={cn("text-sm font-bold mt-1", world.changeBuy >= 0 ? "text-emerald-200" : "text-red-200")}>
                  {world.changeBuy >= 0 ? '+' : ''}{world.changeBuy.toFixed(1)} USD
                </p>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 mt-6">
            <HeroChip label="Buy" value={sjc ? formatVndPrice(sjc.buy) : '—'} />
            <HeroChip label="Sell" value={sjc ? formatVndPrice(sjc.sell) : '—'} />
            <HeroChip label="Buy Δ" value={sjc ? `${sjc.changeBuy >= 0 ? '+' : ''}${new Intl.NumberFormat('vi-VN').format(sjc.changeBuy)}đ` : '—'} />
            <HeroChip label="Sell Δ" value={sjc ? `${sjc.changeSell >= 0 ? '+' : ''}${new Intl.NumberFormat('vi-VN').format(sjc.changeSell)}đ` : '—'} />
          </div>
        </div>
      </div>

      {/* ── Summary Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Providers"
          value={`${domesticPrices.length} domestic`}
          sub="Gold shops & banks"
          color="text-amber-600"
          bg="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatCard
          icon={Globe}
          label="World Price"
          value={world ? `$${world.buy.toLocaleString()}` : '—'}
          sub="XAU/USD spot price"
          color="text-blue-600"
          bg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={Scale}
          label="Spread (SJC)"
          value={sjc ? formatVndPrice(sjc.sell - sjc.buy) : '—'}
          sub="Sell − Buy difference"
          color="text-purple-600"
          bg="bg-purple-100 dark:bg-purple-900/30"
        />
        <StatCard
          icon={ShieldCheck}
          label="Data Source"
          value="vang.today"
          sub="Free API • No key required"
          color="text-emerald-600"
          bg="bg-emerald-100 dark:bg-emerald-900/30"
        />
      </div>

      {/* ── Domestic Gold Table ── */}
      <div className="neu-flat p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">
                Vietnam Domestic Gold Prices
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {domesticPrices.length} providers • {data?.date}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black border-b border-white/10 dark:border-slate-700/50">
                  <th className="text-left py-4 px-5 w-[30%]">Provider</th>
                  <th className="text-right py-4 px-5">Buy (VNĐ)</th>
                  <th className="text-right py-4 px-5">Sell (VNĐ)</th>
                  <th className="text-right py-4 px-5">Spread</th>
                  <th className="text-right py-4 px-5">Change (Buy)</th>
                  <th className="text-right py-4 px-5">Change (Sell)</th>
                </tr>
              </thead>
              <tbody>
                {domesticPrices.map(p => (
                  <tr
                    key={p.id}
                    onClick={() => navigate({ to: '/markets/gold/$goldId', params: { goldId: p.id } })}
                    className="border-b border-white/5 dark:border-slate-700/30 last:border-0 hover:bg-white/40 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 flex items-center justify-center flex-shrink-0 border border-yellow-200/50 dark:border-yellow-700/30">
                          <Coins className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors block">{p.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-plus-jakarta font-bold text-sm text-on-surface">
                      {formatVndPrice(p.buy)}
                    </td>
                    <td className="py-4 px-5 text-right font-plus-jakarta font-bold text-sm text-on-surface">
                      {formatVndPrice(p.sell)}
                    </td>
                    <td className="py-4 px-5 text-right text-xs text-slate-400 font-bold">
                      {formatVndPrice(p.sell - p.buy)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <ChangeChip value={p.changeBuy} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ChangeChip value={p.changeSell} />
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── World Gold Section ── */}
      {worldPrices.length > 0 && (
        <div className="neu-flat p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">World Gold (XAU/USD)</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">International spot price</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {worldPrices.map(p => (
              <div key={p.id} className="bg-surface-container-low dark:bg-slate-800/50 rounded-2xl p-6 border border-white/10 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-3">{p.name}</p>
                <p className="text-3xl font-plus-jakarta font-extrabold text-on-surface">${p.buy.toLocaleString()}</p>
                <div className={cn("flex items-center gap-1.5 mt-2 text-sm font-bold", p.changeBuy >= 0 ? "text-emerald-500" : "text-red-500")}>
                  {p.changeBuy >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {p.changeBuy >= 0 ? '+' : ''}{p.changeBuy.toFixed(2)} USD
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Info Section ── */}
      <div className="neu-flat p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Info className="w-5 h-5 text-slate-500" />
          </div>
          <h3 className="font-plus-jakarta font-bold text-base dark:text-white">About Gold Prices in Vietnam</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-xl p-5 space-y-2">
            <p><strong className="text-on-surface">SJC Gold</strong> is the government-regulated gold brand in Vietnam, managed by Saigon Jewelry Company. It is the benchmark for domestic gold trading.</p>
            <p>Prices are quoted in <strong className="text-on-surface">VNĐ per Lượng</strong> (≈ 37.5 grams / 1.2057 troy oz), making them distinct from world gold quoted in USD per troy ounce.</p>
          </div>
          <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-xl p-5 space-y-2">
            <p><strong className="text-on-surface">Multiple providers</strong> sell SJC-branded gold bars but may have slightly different buy/sell spreads based on their distribution costs and demand.</p>
            <p>The <strong className="text-on-surface">spread</strong> (Sell − Buy) represents the dealer's profit margin. Lower spreads generally indicate higher market liquidity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Helper Components ── */

const HeroChip = ({ label, value }: { label: string; value: string }) => (
  <div className="flex-1 text-center bg-white/10 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-white/10">
    <p className="text-[9px] uppercase tracking-widest text-white/60 font-bold">{label}</p>
    <p className="text-sm font-bold text-white mt-0.5 truncate">{value}</p>
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color, bg }: {
  icon: any; label: string; value: string; sub: string; color: string; bg: string;
}) => (
  <div className="neu-flat p-5 flex items-center gap-4">
    <div className={cn("p-3 rounded-xl flex-shrink-0", bg)}>
      <Icon className={cn("w-5 h-5", color)} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold truncate">{label}</p>
      <p className="text-base font-bold dark:text-white truncate">{value}</p>
      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{sub}</p>
    </div>
  </div>
);

const ChangeChip = ({ value }: { value: number }) => {
  const isUp = value > 0;
  const isZero = value === 0;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
      isZero
        ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        : isUp
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    )}>
      {isZero ? '—' : (
        <>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isUp ? '+' : ''}{formatVndPrice(value)}
        </>
      )}
    </span>
  );
};
