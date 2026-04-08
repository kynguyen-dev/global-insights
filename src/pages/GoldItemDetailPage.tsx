import { useState, useMemo } from 'react';
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
  BarChart3,
  Calendar,
  Activity,
  Zap,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { cn } from '../lib/utils';
import {
  fetchGoldPrices,
  fetchGoldHistory,
  formatVndPrice,
  formatUsdPrice,
  formatPriceChange,
  getTimeAgo,
  type GoldData,
  type GoldPrice,
  type GoldHistoryEntry,
} from '../services/goldApi';

type StatPeriod = 7 | 30;

export const GoldItemDetailPage = () => {
  const { goldId } = useParams({ from: '/markets/gold/$goldId' });
  const [period, setPeriod] = useState<StatPeriod>(7);

  // Fetch current price
  const {
    data: goldData,
    isLoading: currentLoading,
    error: currentError,
    refetch,
  } = useQuery<GoldData, Error>({
    queryKey: ['gold-prices'],
    queryFn: fetchGoldPrices,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Fetch historical data
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ['gold-history', goldId, period],
    queryFn: () => fetchGoldHistory(goldId, period),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Find the current price for this gold type
  const currentPrice: GoldPrice | null = useMemo(() => {
    return goldData?.allPrices.find(p => p.id === goldId) ?? null;
  }, [goldData, goldId]);

  const isUsd = currentPrice?.currency === 'USD';
  const formatPrice = isUsd ? formatUsdPrice : formatVndPrice;

  // Compute stats from history
  const stats = useMemo(() => {
    if (!historyData?.history.length) return null;

    const history = historyData.history;
    const buys = history.map(h => h.buy).filter(v => v > 0);
    const sells = history.map(h => h.sell).filter(v => v > 0);

    const highBuy = Math.max(...buys);
    const lowBuy = Math.min(...buys);
    const avgBuy = buys.reduce((a, b) => a + b, 0) / buys.length;

    const highSell = Math.max(...sells);
    const lowSell = Math.min(...sells);
    const avgSell = sells.reduce((a, b) => a + b, 0) / sells.length;

    // Price change from first to last entry
    const oldest = history[history.length - 1];
    const newest = history[0];
    const changeBuy = newest.buy - oldest.buy;
    const changeSell = newest.sell - oldest.sell;

    // Volatility (standard deviation of daily sell prices)
    const meanSell = avgSell;
    const variance = sells.reduce((sum, s) => sum + Math.pow(s - meanSell, 2), 0) / sells.length;
    const volatility = Math.sqrt(variance);

    return {
      highBuy, lowBuy, avgBuy,
      highSell, lowSell, avgSell,
      changeBuy, changeSell,
      volatility,
      totalDays: history.length,
    };
  }, [historyData]);

  if (currentError && !goldData) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 neu-flat">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 font-bold text-lg">Không thể tải dữ liệu giá vàng</p>
        <p className="text-red-500/70">{currentError.message}</p>
        <button onClick={() => refetch()} className="clay-button bg-primary text-white text-xs uppercase tracking-widest font-black mt-4">
          Thử lại
        </button>
      </div>
    );
  }

  const loading = currentLoading;

  return (
    <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", loading && "opacity-80")}>
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-3 px-6">
        <Link to="/markets" className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors font-bold">
          <ArrowLeft className="w-4 h-4" /> Gold Board
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-sm font-bold text-on-surface">{currentPrice?.name || goldId}</span>
      </div>

      {/* ── Hero Section (Current Price) ── */}
      <div className="relative overflow-hidden rounded-[2rem] min-h-[300px] shadow-clay-card border border-white/20 bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 dark:from-yellow-700 dark:via-amber-700 dark:to-orange-700">
        {/* Decorative blobs */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute left-1/2 -top-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-16 bottom-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl" />

        <div className="relative z-10 p-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-[0.3em] font-black">Giá Hiện Tại</p>
                  <h1 className="text-3xl font-plus-jakarta font-extrabold text-white tracking-tight">
                    {currentPrice?.name || goldId}
                  </h1>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{goldData?.date} • {goldData?.updatedAt}</span>
              </div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                Cập nhật {goldData ? getTimeAgo(goldData.timestamp) : '...'}
              </p>
            </div>
          </div>

          {/* Big Price Display */}
          <div className="mt-8 flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-white/60 font-bold uppercase tracking-widest mb-1">
                {isUsd ? 'Bid Price' : 'Giá Bán (Sell)'}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl lg:text-7xl font-plus-jakarta font-extrabold text-white leading-none tracking-tighter">
                  {loading ? '...' : currentPrice ? (isUsd ? `$${currentPrice.sell.toLocaleString()}` : new Intl.NumberFormat('vi-VN').format(currentPrice.sell)) : 'N/A'}
                </span>
                <span className="text-2xl font-plus-jakarta text-white/50 font-bold">{isUsd ? 'USD' : 'VNĐ'}</span>
              </div>
              {currentPrice && (
                <div className={cn(
                  "flex items-center gap-2 mt-3 text-lg font-bold",
                  currentPrice.changeSell >= 0 ? "text-white" : "text-red-200"
                )}>
                  {currentPrice.changeSell >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  {currentPrice.changeSell >= 0 ? '+' : ''}{isUsd ? currentPrice.changeSell.toFixed(1) + ' USD' : new Intl.NumberFormat('vi-VN').format(currentPrice.changeSell) + 'đ'}
                  <span className="text-white/50 text-sm ml-1">
                    ({formatPriceChange(currentPrice.changeSell, currentPrice.sell)})
                  </span>
                </div>
              )}
            </div>

            {/* Refresh button */}
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-5 py-3 rounded-full border border-white/20 hover:bg-white/25 transition-all text-xs font-bold uppercase tracking-widest"
            >
              <RefreshCw className={cn("w-4 h-4", currentLoading && "animate-spin")} />
              Làm mới
            </button>
          </div>

          {/* Quick stat chips */}
          <div className="flex gap-3 mt-6 flex-wrap">
            <HeroChip label={isUsd ? "Bid" : "Mua"} value={currentPrice ? formatPrice(currentPrice.buy) : '—'} />
            <HeroChip label={isUsd ? "Ask" : "Bán"} value={currentPrice ? formatPrice(currentPrice.sell) : '—'} />
            <HeroChip label={isUsd ? "Δ Bid" : "Δ Mua"} value={currentPrice ? `${currentPrice.changeBuy >= 0 ? '+' : ''}${isUsd ? currentPrice.changeBuy.toFixed(1) : new Intl.NumberFormat('vi-VN').format(currentPrice.changeBuy)}` : '—'} />
            <HeroChip label={isUsd ? "Δ Ask" : "Δ Bán"} value={currentPrice ? `${currentPrice.changeSell >= 0 ? '+' : ''}${isUsd ? currentPrice.changeSell.toFixed(1) : new Intl.NumberFormat('vi-VN').format(currentPrice.changeSell)}` : '—'} />
            <HeroChip label="Spread" value={currentPrice ? formatPrice(currentPrice.sell - currentPrice.buy) : '—'} />
          </div>
        </div>
      </div>

      {/* ── Period Toggle ── */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">Thống Kê & Biểu Đồ</h2>
        </div>
        <div className="flex bg-surface-container dark:bg-slate-800 rounded-full p-1 border border-white/10">
          <button
            onClick={() => setPeriod(7)}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300",
              period === 7
                ? "bg-primary text-white shadow-clay-button"
                : "text-slate-400 hover:text-primary"
            )}
          >
            7 Ngày
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300",
              period === 30
                ? "bg-primary text-white shadow-clay-button"
                : "text-slate-400 hover:text-primary"
            )}
          >
            30 Ngày
          </button>
        </div>
      </div>

      {/* ── Statistics Cards ── */}
      {historyLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : historyError ? (
        <div className="neu-flat p-8 flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-red-500 font-bold">Không thể tải lịch sử giá</p>
        </div>
      ) : stats ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={TrendingUp}
              label={`Cao nhất (${period}D)`}
              value={formatPrice(stats.highSell)}
              sub={`Giá bán cao nhất ${period} ngày`}
              color="text-emerald-600"
              bg="bg-emerald-100 dark:bg-emerald-900/30"
            />
            <StatCard
              icon={TrendingDown}
              label={`Thấp nhất (${period}D)`}
              value={formatPrice(stats.lowSell)}
              sub={`Giá bán thấp nhất ${period} ngày`}
              color="text-red-500"
              bg="bg-red-100 dark:bg-red-900/30"
            />
            <StatCard
              icon={BarChart3}
              label={`Trung bình (${period}D)`}
              value={formatPrice(Math.round(stats.avgSell))}
              sub={`Giá bán trung bình ${period} ngày`}
              color="text-blue-600"
              bg="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatCard
              icon={Zap}
              label={`Biến động (${period}D)`}
              value={`${stats.changeSell >= 0 ? '+' : ''}${isUsd ? stats.changeSell.toFixed(1) : new Intl.NumberFormat('vi-VN').format(stats.changeSell)}`}
              sub={`Tổng thay đổi giá bán ${period} ngày`}
              color={stats.changeSell >= 0 ? "text-emerald-600" : "text-red-500"}
              bg={stats.changeSell >= 0 ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}
            />
          </div>

          {/* Buy Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={ArrowUpRight}
              label={`Mua cao nhất`}
              value={formatPrice(stats.highBuy)}
              sub={`${period} ngày qua`}
              color="text-amber-600"
              bg="bg-amber-100 dark:bg-amber-900/30"
            />
            <StatCard
              icon={ArrowDownRight}
              label={`Mua thấp nhất`}
              value={formatPrice(stats.lowBuy)}
              sub={`${period} ngày qua`}
              color="text-orange-500"
              bg="bg-orange-100 dark:bg-orange-900/30"
            />
            <StatCard
              icon={Activity}
              label="Trung bình Mua"
              value={formatPrice(Math.round(stats.avgBuy))}
              sub={`${period} ngày qua`}
              color="text-purple-600"
              bg="bg-purple-100 dark:bg-purple-900/30"
            />
            <StatCard
              icon={Activity}
              label="Biến động"
              value={formatPrice(Math.round(stats.volatility))}
              sub="Độ lệch chuẩn (Sell)"
              color="text-indigo-600"
              bg="bg-indigo-100 dark:bg-indigo-900/30"
            />
          </div>

          {/* ── Price Chart ── */}
          <div className="neu-flat p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">
                  Biểu Đồ Giá — {period} Ngày
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  {currentPrice?.name || goldId} • Giá Mua & Bán
                </p>
              </div>
            </div>
            <PriceChart history={historyData?.history || []} isUsd={isUsd} />
          </div>

          {/* ── Price History Table ── */}
          <div className="neu-flat p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">
                  Lịch Sử Giá — {period} Ngày
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  {historyData?.history.length || 0} ngày dữ liệu
                </p>
              </div>
            </div>
            <HistoryTable history={historyData?.history || []} isUsd={isUsd} />
          </div>
        </>
      ) : null}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   Price Chart (Pure SVG — no external deps)
   ══════════════════════════════════════════════════════ */
const PriceChart = ({ history, isUsd }: { history: GoldHistoryEntry[]; isUsd: boolean }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!history.length) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400 font-bold">
        Không có dữ liệu
      </div>
    );
  }

  // Reverse to chronological order (oldest first)
  const data = [...history].reverse();

  const W = 800;
  const H = 320;
  const PAD_LEFT = 10;
  const PAD_RIGHT = 10;
  const PAD_TOP = 30;
  const PAD_BOTTOM = 50;

  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = H - PAD_TOP - PAD_BOTTOM;

  // Combine buy and sell for scale
  const allValues = [...data.map(d => d.buy), ...data.map(d => d.sell)].filter(v => v > 0);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const buffer = range * 0.1;
  const scaleMin = minVal - buffer;
  const scaleMax = maxVal + buffer;

  const xScale = (i: number) => PAD_LEFT + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => PAD_TOP + chartH - ((v - scaleMin) / (scaleMax - scaleMin)) * chartH;

  const sellPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.sell)}`).join(' ');
  const buyPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.buy)}`).join(' ');

  // Area fill between buy and sell
  const areaPath = `${sellPath} L ${xScale(data.length - 1)} ${yScale(data[data.length - 1].buy)} ${data.map((_, i) => `L ${xScale(data.length - 1 - i)} ${yScale(data[data.length - 1 - i].buy)}`).join(' ')} Z`;

  // Y-axis grid lines (5 lines)
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const val = scaleMin + (scaleMax - scaleMin) * (i / 4);
    return { y: yScale(val), label: isUsd ? `$${Math.round(val).toLocaleString()}` : `${(Math.round(val / 1000000))}tr` };
  });

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minHeight: 280 }}>
        <defs>
          <linearGradient id="sellGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line x1={PAD_LEFT} y1={line.y} x2={W - PAD_RIGHT} y2={line.y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="6 4" />
            <text x={PAD_LEFT + 2} y={line.y - 6} fill="currentColor" fontSize="10" opacity="0.3" fontWeight="700" fontFamily="'Manrope', sans-serif">
              {line.label}
            </text>
          </g>
        ))}

        {/* X-axis date labels */}
        {data.map((d, i) => {
          // Show label for every entry if ≤10, otherwise every nth
          const showLabel = data.length <= 10 || i % Math.ceil(data.length / 8) === 0 || i === data.length - 1;
          if (!showLabel) return null;
          const dateStr = new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
          return (
            <text key={i} x={xScale(i)} y={H - 10} fill="currentColor" fontSize="10" opacity="0.35" fontWeight="700" textAnchor="middle" fontFamily="'Manrope', sans-serif">
              {dateStr}
            </text>
          );
        })}

        {/* Area between sell and buy */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Sell line (amber) */}
        <path d={sellPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Buy line (blue) */}
        <path d={buyPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Sell line shadow */}
        <path d={sellPath} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />

        {/* Data points & hover zone */}
        {data.map((d, i) => (
          <g key={i}>
            {/* Invisible hover zone */}
            <rect
              x={xScale(i) - chartW / data.length / 2}
              y={PAD_TOP}
              width={chartW / data.length}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'crosshair' }}
            />
            {/* Sell dot */}
            <circle
              cx={xScale(i)} cy={yScale(d.sell)} r={hoveredIdx === i ? 6 : 3.5}
              fill="#f59e0b" stroke="white" strokeWidth="2"
              className="transition-all duration-150"
            />
            {/* Buy dot */}
            <circle
              cx={xScale(i)} cy={yScale(d.buy)} r={hoveredIdx === i ? 6 : 3.5}
              fill="#3b82f6" stroke="white" strokeWidth="2"
              className="transition-all duration-150"
            />

            {/* Hover tooltip crosshair */}
            {hoveredIdx === i && (
              <>
                <line x1={xScale(i)} y1={PAD_TOP} x2={xScale(i)} y2={PAD_TOP + chartH} stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                {/* Sell tooltip */}
                <rect x={xScale(i) - 70} y={yScale(d.sell) - 30} width="140" height="22" rx="6" fill="#f59e0b" opacity="0.9" />
                <text x={xScale(i)} y={yScale(d.sell) - 14} fill="white" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif">
                  Bán: {isUsd ? `$${d.sell.toLocaleString()}` : new Intl.NumberFormat('vi-VN').format(d.sell)}
                </text>
                {/* Buy tooltip */}
                <rect x={xScale(i) - 70} y={yScale(d.buy) + 10} width="140" height="22" rx="6" fill="#3b82f6" opacity="0.9" />
                <text x={xScale(i)} y={yScale(d.buy) + 26} fill="white" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif">
                  Mua: {isUsd ? `$${d.buy.toLocaleString()}` : new Intl.NumberFormat('vi-VN').format(d.buy)}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-4 text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded-full bg-amber-500" />
          <span className="text-slate-500 dark:text-slate-400">Giá Bán (Sell)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded-full bg-blue-500" />
          <span className="text-slate-500 dark:text-slate-400">Giá Mua (Buy)</span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   History Table
   ══════════════════════════════════════════════════════ */
const HistoryTable = ({ history, isUsd }: { history: GoldHistoryEntry[]; isUsd: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const displayData = expanded ? history : history.slice(0, 10);
  const formatPrice = isUsd ? formatUsdPrice : formatVndPrice;

  return (
    <div>
      <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black border-b border-white/10 dark:border-slate-700/50">
              <th className="text-left py-4 px-5">Ngày</th>
              <th className="text-right py-4 px-5">Mua (Buy)</th>
              <th className="text-right py-4 px-5">Bán (Sell)</th>
              <th className="text-right py-4 px-5">Δ Mua</th>
              <th className="text-right py-4 px-5">Δ Bán</th>
              <th className="text-right py-4 px-5">Spread</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((entry, idx) => {
              const dateFmt = new Date(entry.date).toLocaleDateString('vi-VN', {
                weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric'
              });
              return (
                <tr
                  key={entry.date}
                  className={cn(
                    "border-b border-white/5 dark:border-slate-700/30 last:border-0 transition-colors duration-200",
                    idx === 0 ? "bg-yellow-50/50 dark:bg-yellow-900/5" : "hover:bg-white/40 dark:hover:bg-white/5"
                  )}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border",
                        idx === 0
                          ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700/30"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-200/50 dark:border-slate-700/30"
                      )}>
                        <Calendar className={cn("w-4 h-4", idx === 0 ? "text-yellow-600" : "text-slate-400")} />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-on-surface block">{dateFmt}</span>
                        {idx === 0 && (
                          <span className="text-[9px] text-yellow-600 dark:text-yellow-400 font-black uppercase tracking-wider">Hôm nay</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right font-plus-jakarta font-bold text-sm text-on-surface">
                    {formatPrice(entry.buy)}
                  </td>
                  <td className="py-4 px-5 text-right font-plus-jakarta font-bold text-sm text-on-surface">
                    {formatPrice(entry.sell)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <ChangeChip value={entry.dayChangeBuy} isUsd={isUsd} />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <ChangeChip value={entry.dayChangeSell} isUsd={isUsd} />
                  </td>
                  <td className="py-4 px-5 text-right text-xs text-slate-400 font-bold">
                    {formatPrice(entry.sell - entry.buy)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {history.length > 10 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-surface-container transition-all"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? 'Thu gọn' : `Xem thêm (${history.length - 10} ngày)`}
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   Helper Components
   ══════════════════════════════════════════════════════ */
const HeroChip = ({ label, value }: { label: string; value: string }) => (
  <div className="flex-1 min-w-[100px] text-center bg-white/10 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-white/10">
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

const ChangeChip = ({ value, isUsd }: { value: number; isUsd: boolean }) => {
  const isUp = value > 0;
  const isZero = value === 0;
  const formatted = isUsd
    ? `$${Math.abs(value).toFixed(1)}`
    : formatVndPrice(Math.abs(value));

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
          {isUp ? '+' : '-'}{formatted}
        </>
      )}
    </span>
  );
};
