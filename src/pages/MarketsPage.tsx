import {
  Coins,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  DollarSign,
  BarChart3,
  ChevronRight,
  Globe,
  Building2,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '../lib/utils';
import {
  fetchGoldPrices,
  formatVndPrice,
  formatPriceChange,
  getTimeAgo,
  type GoldData,
  type GoldPrice,
} from '../services/goldApi';

// ── Gold Board Page ──
export const MarketsPage = () => {
  const {
    data: goldData,
    isLoading: goldLoading,
    error: goldError,
    refetch: refetchGold,
  } = useQuery<GoldData, Error>({
    queryKey: ['gold-prices'],
    queryFn: fetchGoldPrices,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const sjc = goldData?.sjc;
  const world = goldData?.worldGold;
  const domesticPrices = goldData?.allPrices.filter(p => p.currency === 'VND') || [];
  const worldPrices = goldData?.allPrices.filter(p => p.currency === 'USD') || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6">
        <div>
          <h2 className="text-5xl font-plus-jakarta font-black text-blue-900 dark:text-blue-100 tracking-tighter">
            Gold Board
          </h2>
          <p className="text-slate-500 font-bold mt-2 opacity-70">
            Real-time gold prices — Vietnam domestic & world markets
          </p>
        </div>
        <button
          onClick={() => refetchGold()}
          className="flex items-center gap-3 bg-primary text-white clay-button shadow-clay-card hover:scale-[1.05] transition-all uppercase tracking-widest text-xs font-black"
        >
          <RefreshCw className={cn("w-4 h-4 stroke-[3px]", goldLoading && "animate-spin")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ═══ Hero Card ═══ */}
      <GoldHeroCard data={goldData} loading={goldLoading} error={goldError} />

      {/* ═══ Summary Stats ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Nhà cung cấp"
          value={`${domesticPrices.length} providers`}
          sub="SJC, DOJI, PNJ, Bảo Tín..."
          color="text-amber-600"
          bg="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatCard
          icon={Globe}
          label="Giá Thế Giới"
          value={world ? `$${world.buy.toLocaleString()}` : '—'}
          sub="XAU/USD spot price"
          color="text-blue-600"
          bg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={Scale}
          label="Spread (SJC)"
          value={sjc ? formatVndPrice(sjc.sell - sjc.buy) : '—'}
          sub="Chênh lệch Bán − Mua"
          color="text-purple-600"
          bg="bg-purple-100 dark:bg-purple-900/30"
        />
        <StatCard
          icon={ShieldCheck}
          label="Nguồn dữ liệu"
          value="vang.today"
          sub="Free API • Cập nhật 5 phút"
          color="text-emerald-600"
          bg="bg-emerald-100 dark:bg-emerald-900/30"
        />
      </div>

      {/* ═══ Gold Price Table ═══ */}
      <GoldPriceTable data={goldData} loading={goldLoading} error={goldError} />

      {/* ═══ World Gold Section ═══ */}
      {worldPrices.length > 0 && (
        <div className="neu-flat p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">Giá Vàng Thế Giới (XAU/USD)</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">International spot price</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {worldPrices.map(p => (
              <WorldGoldCard key={p.id} price={p} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Gold Info ═══ */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <MarketInfoCard
            title="Thông tin giao dịch vàng"
            icon={Coins}
            iconColor="text-yellow-600"
            iconBg="bg-yellow-100 dark:bg-yellow-900/30"
            items={[
              { label: 'Thị trường', value: 'Việt Nam nội địa' },
              { label: 'Đơn vị', value: 'VND / Lượng' },
              { label: 'Nguồn', value: 'vang.today API' },
              { label: 'Tần suất cập nhật', value: 'Mỗi 5 phút' },
              { label: 'Tham chiếu', value: 'SJC, DOJI, PNJ, Bao Tin' },
            ]}
          />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <MarketInfoCard
            title="Kiến thức vàng"
            icon={Globe}
            iconColor="text-blue-600"
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            items={[
              { label: 'SJC Gold', value: 'Vàng miếng quốc gia Việt Nam' },
              { label: 'Trọng lượng', value: '1 Lượng ≈ 37.5g (1.2 troy oz)' },
              { label: 'XAU/USD', value: 'Giá vàng thế giới theo USD' },
              { label: 'Spread', value: 'Chênh lệch giữa giá Bán và Mua' },
              { label: 'DOJI / PNJ', value: 'Các thương hiệu vàng uy tín' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════
// Gold Hero Card
// ════════════════════════════════════════════════════
const GoldHeroCard = ({ data, loading, error }: { data?: GoldData; loading: boolean; error: Error | null }) => {
  const sjc = data?.sjc;
  const world = data?.worldGold;
  const isUp = sjc ? sjc.changeSell >= 0 : true;

  if (error && !data) {
    return (
      <div className="neu-flat p-8 flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-500 font-bold">Không thể tải dữ liệu giá vàng</p>
        <p className="text-slate-400 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] p-8 lg:p-10 min-h-[340px] flex flex-col justify-between shadow-clay-card border border-white/20 bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 dark:from-yellow-700 dark:via-amber-700 dark:to-orange-700">
      {/* Decorative */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute left-1/2 -top-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -left-16 bottom-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl" />

      {/* Top */}
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-[0.3em] font-black">Giá Vàng SJC</p>
              <h1 className="text-3xl font-plus-jakarta font-extrabold text-white tracking-tight">
                Gold Price Board
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
            Cập nhật {data ? getTimeAgo(data.timestamp) : '...'}
          </p>
        </div>
      </div>

      {/* Big Price */}
      <div className="relative z-10 mt-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-white/60 font-bold uppercase tracking-widest mb-1">SJC 9999 — Giá Bán</p>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl lg:text-7xl font-plus-jakarta font-extrabold text-white leading-none tracking-tighter">
              {loading ? '...' : sjc ? new Intl.NumberFormat('vi-VN').format(sjc.sell) : 'N/A'}
            </span>
            <span className="text-2xl font-plus-jakarta text-white/50 font-bold">VNĐ</span>
          </div>
          {sjc && (
            <div className={cn(
              "flex items-center gap-2 mt-3 text-lg font-bold",
              isUp ? "text-white" : "text-red-200"
            )}>
              {isUp ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
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

      {/* Bottom Stats */}
      <div className="relative z-10 flex gap-3 mt-6 flex-wrap">
        <HeroStat label="Mua" value={sjc ? formatVndPrice(sjc.buy) : '—'} loading={loading} />
        <HeroStat label="Bán" value={sjc ? formatVndPrice(sjc.sell) : '—'} loading={loading} />
        <HeroStat label="Δ Mua" value={sjc ? `${sjc.changeBuy >= 0 ? '+' : ''}${new Intl.NumberFormat('vi-VN').format(sjc.changeBuy)}đ` : '—'} loading={loading} />
        <HeroStat label="Δ Bán" value={sjc ? `${sjc.changeSell >= 0 ? '+' : ''}${new Intl.NumberFormat('vi-VN').format(sjc.changeSell)}đ` : '—'} loading={loading} />
        <HeroStat label="Updated" value={data ? getTimeAgo(data.timestamp) : '—'} loading={loading} />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════
// Gold Price Full Table
// ════════════════════════════════════════════════════
const GoldPriceTable = ({ data, loading, error }: { data?: GoldData; loading: boolean; error: Error | null }) => {
  if (error && !data) {
    return (
      <div className="neu-flat p-8 flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-500 font-bold">Không thể tải dữ liệu</p>
        <p className="text-slate-400 text-sm">{error.message}</p>
      </div>
    );
  }

  const domesticPrices = data?.allPrices.filter(p => p.currency === 'VND') || [];

  return (
    <div className="neu-flat p-8">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
            <BarChart3 className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">
              Bảng Giá Vàng Trong Nước
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {domesticPrices.length} providers • cập nhật {data ? getTimeAgo(data.timestamp) : '...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-bold uppercase tracking-widest">
            {data?.date || '—'} • {data?.updatedAt || '—'}
          </span>
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
                <th className="text-left py-3.5 px-5">Nhà cung cấp</th>
                <th className="text-right py-3.5 px-5">Mua (Buy)</th>
                <th className="text-right py-3.5 px-5">Bán (Sell)</th>
                <th className="text-right py-3.5 px-5">Δ Mua</th>
                <th className="text-right py-3.5 px-5">Δ Bán</th>
              </tr>
            </thead>
            <tbody>
              {domesticPrices.map(p => (
                <GoldRow key={p.id} price={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════
// World Gold Card
// ════════════════════════════════════════════════════
const WorldGoldCard = ({ price }: { price: GoldPrice }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate({ to: '/markets/gold/$goldId', params: { goldId: price.id } })}
      className="bg-surface-container-low dark:bg-slate-800/50 rounded-2xl p-6 border border-white/10 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-black">{price.name}</p>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
      </div>
      <p className="text-3xl font-plus-jakarta font-extrabold text-on-surface">${price.buy.toLocaleString()}</p>
      <div className={cn("flex items-center gap-1.5 mt-2 text-sm font-bold", price.changeBuy >= 0 ? "text-emerald-500" : "text-red-500")}>
        {price.changeBuy >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {price.changeBuy >= 0 ? '+' : ''}{price.changeBuy.toFixed(2)} USD
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════
// Gold Table Row
// ════════════════════════════════════════════════════
const GoldRow = ({ price }: { price: GoldPrice }) => {
  const navigate = useNavigate();
  const changeBuyUp = price.changeBuy >= 0;
  const changeSellUp = price.changeSell >= 0;

  return (
    <tr
      onClick={() => navigate({ to: '/markets/gold/$goldId', params: { goldId: price.id } })}
      className="border-b border-white/5 dark:border-slate-700/30 last:border-0 hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-200 group cursor-pointer"
    >
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
            <Coins className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors block">{price.name}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{price.id}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-5 text-right font-plus-jakarta font-bold text-sm text-on-surface">
        {formatVndPrice(price.buy)}
      </td>
      <td className="py-4 px-5 text-right font-plus-jakarta font-bold text-sm text-on-surface">
        {formatVndPrice(price.sell)}
      </td>
      <td className="py-4 px-5 text-right">
        <PriceChangeChip value={price.changeBuy} isUp={changeBuyUp} />
      </td>
      <td className="py-4 px-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <PriceChangeChip value={price.changeSell} isUp={changeSellUp} />
          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
        </div>
      </td>
    </tr>
  );
};

// ════════════════════════════════════════════════════
// Market Info Card
// ════════════════════════════════════════════════════
const MarketInfoCard = ({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  items,
}: {
  title: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  items: { label: string; value: string }[];
}) => (
  <div className="neu-flat p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className={cn("p-2.5 rounded-xl", iconBg)}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <h3 className="font-plus-jakarta font-bold text-base dark:text-white">{title}</h3>
    </div>
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-2.5 px-4 bg-surface-container-low dark:bg-slate-800/50 rounded-xl hover:bg-surface-container-high dark:hover:bg-slate-700 transition-all"
        >
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
          <span className="text-sm font-bold text-on-surface">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

// ════════════════════════════════════════════════════
// Shared Helper Components
// ════════════════════════════════════════════════════
const HeroStat = ({ label, value, loading }: { label: string; value: string; loading?: boolean }) => (
  <div className="flex-1 min-w-[90px] text-center bg-white/10 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-white/10">
    <p className="text-[9px] uppercase tracking-widest text-white/60 font-bold">{label}</p>
    <p className={cn("text-sm font-bold text-white mt-0.5 truncate", loading && "animate-pulse")}>{value}</p>
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

const PriceChangeChip = ({ value, isUp }: { value: number; isUp: boolean }) => {
  const formatted = formatVndPrice(Math.abs(value));

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
      isUp
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : value === 0
          ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    )}>
      {value === 0 ? (
        '—'
      ) : isUp ? (
        <>
          <TrendingUp className="w-3 h-3" />
          +{formatted}
        </>
      ) : (
        <>
          <TrendingDown className="w-3 h-3" />
          -{formatted}
        </>
      )}
    </span>
  );
};
