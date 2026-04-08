import { useMemo } from 'react';
import {
  Fuel,
  AlertCircle,
  ArrowLeft,
  Clock,
  MapPin,
  Flame,
  Droplets,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Zap,
  Scale,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { cn } from '../lib/utils';

// ── Types (shared with PetrolDetailPage) ──
interface PetrolProduct {
  id: string;
  name: string;
  icon: string;
  priceZone1: number;
  priceZone2: number;
}

interface PetrolProxyResponse {
  status: string;
  data: {
    items: PetrolProduct[];
    updatedAt: string;
    price: number;
    percentChange: number;
  };
}

async function fetchAllPetrolProducts(): Promise<PetrolProxyResponse> {
  const res = await fetch('/api/proxy-petrol');
  if (!res.ok) throw new Error('Failed to fetch petrol data');
  return res.json();
}

function fmtPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ/lít';
}

function fmtPriceShort(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// ── Fuel knowledge base ──
const fuelInfo: Record<string, {
  description: string;
  octane?: string;
  category: string;
  usage: string;
  color: string;
  gradient: string;
}> = {
  ron95v: {
    description: 'Xăng RON 95-V là xăng không chì cao cấp nhất do Petrolimex sản xuất tại Việt Nam. Đạt tiêu chuẩn Euro 5 với chỉ số octan 95.',
    octane: '95',
    category: 'Xăng (Gasoline)',
    usage: 'Xe hơi đời mới, xe sang, xe thể thao — yêu cầu RON 95 trở lên.',
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
  },
  ron95iii: {
    description: 'Xăng RON 95-III đạt tiêu chuẩn Euro 3. Phù hợp phổ thông cho ô tô và xe máy phân khối lớn.',
    octane: '95',
    category: 'Xăng (Gasoline)',
    usage: 'Xe hơi phổ thông, xe máy phân khối lớn.',
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 via-green-500 to-lime-500',
  },
  e5ron92: {
    description: 'Xăng E5 RON 92 là xăng sinh học pha 5% ethanol. Được chính phủ ưu tiên với thuế suất thấp hơn để bảo vệ môi trường.',
    octane: '92',
    category: 'Xăng sinh học (Biofuel)',
    usage: 'Xe máy, xe hơi phổ thông — tiết kiệm và thân thiện môi trường.',
    color: 'text-green-600',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
  },
  do05s: {
    description: 'Dầu Diesel 0.05S chứa hàm lượng lưu huỳnh ≤ 0.05%, đáp ứng tiêu chuẩn khí thải Euro 4/5.',
    category: 'Dầu Diesel',
    usage: 'Xe tải, xe buýt, máy phát điện, thiết bị công nghiệp.',
    color: 'text-sky-600',
    gradient: 'from-sky-500 via-blue-500 to-indigo-500',
  },
  do001sv: {
    description: 'Dầu Diesel 0.001S-V là loại diesel siêu sạch với hàm lượng lưu huỳnh cực thấp (≤ 0.001%), đạt tiêu chuẩn Euro 5.',
    category: 'Dầu Diesel Premium',
    usage: 'Xe tải đời mới, xe khách cao cấp, động cơ yêu cầu diesel sạch.',
    color: 'text-blue-600',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
  },
  dauhoa: {
    description: 'Dầu hỏa (Kerosene) dùng cho chiếu sáng, sưởi ấm, và một số thiết bị công nghiệp tại vùng nông thôn.',
    category: 'Dầu hỏa (Kerosene)',
    usage: 'Đèn dầu, bếp dầu, sưởi ấm — phục vụ sinh hoạt vùng xa.',
    color: 'text-amber-600',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
  },
};

export const PetrolItemDetailPage = () => {
  const { petrolId } = useParams({ from: '/petrol/$petrolId' });
  const navigate = useNavigate();

  const {
    data: response,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<PetrolProxyResponse, Error>({
    queryKey: ['petrol-all-products'],
    queryFn: fetchAllPetrolProducts,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });

  const items = response?.data?.items || [];
  const updatedAt = response?.data?.updatedAt || '';
  const currentProduct = items.find(p => p.id === petrolId) || null;
  const otherProducts = items.filter(p => p.id !== petrolId);
  const isGasoline = petrolId.startsWith('ron') || petrolId.startsWith('e5');
  const info = fuelInfo[petrolId];

  // Compute comparative stats
  const stats = useMemo(() => {
    if (!items.length || !currentProduct) return null;

    const allPrices = items.filter(p => p.priceZone1 > 0).map(p => p.priceZone1);
    const maxPrice = Math.max(...allPrices);
    const minPrice = Math.min(...allPrices);
    const avgPrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
    const rank = [...allPrices].sort((a, b) => b - a).indexOf(currentProduct.priceZone1) + 1;

    return { maxPrice, minPrice, avgPrice, rank, totalProducts: items.length };
  }, [items, currentProduct]);

  if (error && !response) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 neu-flat">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 font-bold text-lg">Không thể tải dữ liệu giá xăng dầu</p>
        <p className="text-red-500/70">{error.message}</p>
        <button onClick={() => refetch()} className="clay-button bg-primary text-white text-xs uppercase tracking-widest font-black mt-4">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", loading && "opacity-80")}>
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-3 px-6">
        <Link to="/petrol" className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors font-bold">
          <ArrowLeft className="w-4 h-4" /> Petrol Board
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-sm font-bold text-on-surface">{currentProduct?.name || petrolId}</span>
      </div>

      {/* ── Hero Section ── */}
      <div className={cn(
        "relative overflow-hidden rounded-[2rem] min-h-[320px] shadow-clay-card border border-white/20 bg-gradient-to-br",
        info?.gradient || (isGasoline ? 'from-emerald-500 via-teal-500 to-cyan-500' : 'from-sky-500 via-blue-500 to-indigo-500')
      )}>
        {/* Decorative blobs */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute left-1/3 -top-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-16 bottom-10 w-40 h-40 bg-white/15 rounded-full blur-2xl" />

        <div className="relative z-10 p-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  {isGasoline ? <Flame className="w-6 h-6 text-white" /> : <Droplets className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-[0.3em] font-black">
                    {info?.category || (isGasoline ? 'Xăng (Gasoline)' : 'Dầu (Diesel/Oil)')}
                  </p>
                  <h1 className="text-3xl font-plus-jakarta font-extrabold text-white tracking-tight">
                    {currentProduct?.name || petrolId}
                  </h1>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{updatedAt}</span>
              </div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                Source: webgia.com
              </p>
            </div>
          </div>

          {/* Big Price Display */}
          <div className="mt-8 flex items-end justify-between flex-wrap gap-6">
            <div>
              <p className="text-sm text-white/60 font-bold uppercase tracking-widest mb-1">
                Giá Vùng 1 (Đô Thị)
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl lg:text-7xl font-plus-jakarta font-extrabold text-white leading-none tracking-tighter">
                  {loading ? '...' : currentProduct ? new Intl.NumberFormat('vi-VN').format(currentProduct.priceZone1) : 'N/A'}
                </span>
                <span className="text-2xl font-plus-jakarta text-white/50 font-bold">đ/lít</span>
              </div>
              {currentProduct && currentProduct.priceZone2 > 0 && (
                <div className="flex items-center gap-2 mt-3 text-lg font-bold text-white/70">
                  <MapPin className="w-4 h-4" />
                  Vùng 2: {fmtPrice(currentProduct.priceZone2)}
                  <span className="text-white/40 text-sm ml-1">
                    (+{fmtPriceShort(currentProduct.priceZone2 - currentProduct.priceZone1)})
                  </span>
                </div>
              )}
            </div>

            {/* Octane badge */}
            {info?.octane && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-black mb-1">Chỉ Số Octan</p>
                <p className="text-5xl font-plus-jakarta font-extrabold text-white">{info.octane}</p>
                <p className="text-xs text-white/40 font-bold mt-1">RON</p>
              </div>
            )}
          </div>

          {/* Quick stat chips */}
          <div className="flex gap-3 mt-6 flex-wrap">
            <HeroChip label="Vùng 1" value={currentProduct ? fmtPrice(currentProduct.priceZone1) : '—'} />
            <HeroChip label="Vùng 2" value={currentProduct ? fmtPrice(currentProduct.priceZone2) : '—'} />
            <HeroChip label="Chênh lệch" value={currentProduct && currentProduct.priceZone2 > 0 ? fmtPriceShort(currentProduct.priceZone2 - currentProduct.priceZone1) : '—'} />
            {stats && <HeroChip label="Xếp hạng giá" value={`#${stats.rank} / ${stats.totalProducts}`} />}
          </div>
        </div>
      </div>

      {/* ── Statistics Cards ── */}
      {stats && currentProduct && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={ArrowUpRight}
            label="Cao nhất toàn bộ"
            value={fmtPrice(stats.maxPrice)}
            sub="So sánh tất cả sản phẩm"
            color="text-emerald-600"
            bg="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <StatCard
            icon={ArrowDownRight}
            label="Thấp nhất toàn bộ"
            value={fmtPrice(stats.minPrice)}
            sub="So sánh tất cả sản phẩm"
            color="text-red-500"
            bg="bg-red-100 dark:bg-red-900/30"
          />
          <StatCard
            icon={BarChart3}
            label="Trung bình"
            value={fmtPrice(Math.round(stats.avgPrice))}
            sub={`${stats.totalProducts} sản phẩm Petrolimex`}
            color="text-blue-600"
            bg="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            icon={Zap}
            label="Chênh lệch vùng"
            value={currentProduct.priceZone2 > 0 ? fmtPriceShort(currentProduct.priceZone2 - currentProduct.priceZone1) : '—'}
            sub="Zone 2 − Zone 1"
            color="text-amber-600"
            bg="bg-amber-100 dark:bg-amber-900/30"
          />
        </div>
      )}

      {/* ── Zone Comparison Visual ── */}
      {currentProduct && currentProduct.priceZone1 > 0 && currentProduct.priceZone2 > 0 && (
        <div className="neu-flat p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">So sánh giá 2 Vùng</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {currentProduct.name} • Zone 1 vs Zone 2
              </p>
            </div>
          </div>

          <ZoneComparison product={currentProduct} />
        </div>
      )}

      {/* ── Price Comparison Bar Chart ── */}
      {items.length > 0 && (
        <div className="neu-flat p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={cn("p-3 rounded-xl", isGasoline ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-sky-100 dark:bg-sky-900/30")}>
              <BarChart3 className={cn("w-6 h-6", isGasoline ? "text-emerald-600" : "text-sky-600")} />
            </div>
            <div>
              <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">So sánh giá tất cả sản phẩm</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {items.length} sản phẩm • Giá Vùng 1 (đ/lít)
              </p>
            </div>
          </div>

          <PriceComparisonChart items={items} currentId={petrolId} />
        </div>
      )}

      {/* ── Product Info ── */}
      {info && (
        <div className="neu-flat p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <Info className="w-5 h-5 text-slate-500" />
            </div>
            <h3 className="font-plus-jakarta font-bold text-base dark:text-white">
              Thông tin {currentProduct?.name || petrolId}
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {info.description}
              </p>
            </div>
            <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-xl p-5 space-y-3">
              <InfoRow label="Loại" value={info.category} />
              {info.octane && <InfoRow label="Chỉ số Octan" value={`RON ${info.octane}`} />}
              <InfoRow label="Công dụng" value={info.usage} />
              <InfoRow label="Nguồn" value="Petrolimex (webgia.com)" />
            </div>
          </div>
        </div>
      )}

      {/* ── Other Products ── */}
      {otherProducts.length > 0 && (
        <div className="neu-flat p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <Fuel className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">Sản phẩm khác</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {otherProducts.length} sản phẩm khác
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black border-b border-white/10 dark:border-slate-700/50">
                  <th className="text-left py-3.5 px-5">Sản phẩm</th>
                  <th className="text-right py-3.5 px-5">Vùng 1</th>
                  <th className="text-right py-3.5 px-5">Vùng 2</th>
                  <th className="text-right py-3.5 px-5">Chênh lệch</th>
                </tr>
              </thead>
              <tbody>
                {otherProducts.map(p => {
                  const isGas = p.id.startsWith('ron') || p.id.startsWith('e5');
                  return (
                    <tr
                      key={p.id}
                      onClick={() => navigate({ to: '/petrol/$petrolId', params: { petrolId: p.id } })}
                      className="border-b border-white/5 dark:border-slate-700/30 last:border-0 hover:bg-white/40 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border",
                            isGas
                              ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-700/30"
                              : "bg-sky-100 dark:bg-sky-900/30 border-sky-200/50 dark:border-sky-700/30"
                          )}>
                            {isGas
                              ? <Flame className="w-4 h-4 text-emerald-600" />
                              : <Droplets className="w-4 h-4 text-sky-600" />
                            }
                          </div>
                          <div>
                            <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors block">{p.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right font-plus-jakarta font-bold text-sm text-on-surface">
                        {p.priceZone1 ? fmtPrice(p.priceZone1) : '—'}
                      </td>
                      <td className="py-4 px-5 text-right font-plus-jakarta font-bold text-sm text-slate-500">
                        {p.priceZone2 ? fmtPrice(p.priceZone2) : '—'}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {p.priceZone1 && p.priceZone2 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              <TrendingUp className="w-3 h-3" />
                              {fmtPriceShort(p.priceZone2 - p.priceZone1)}
                            </span>
                          ) : '—'}
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   Zone Comparison Visual
   ══════════════════════════════════════════════════════ */
const ZoneComparison = ({ product }: { product: PetrolProduct }) => {
  const maxVal = Math.max(product.priceZone1, product.priceZone2);
  const diff = product.priceZone2 - product.priceZone1;
  const pct = ((diff / product.priceZone1) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Zone 1 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-on-surface">Vùng 1 — Đô thị</span>
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-black uppercase">Hà Nội • HCM • Đà Nẵng</span>
          </div>
          <span className="font-plus-jakarta font-bold text-on-surface">{fmtPrice(product.priceZone1)}</span>
        </div>
        <div className="h-4 bg-surface-container-low dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700"
            style={{ width: `${(product.priceZone1 / maxVal) * 100}%` }}
          />
        </div>
      </div>

      {/* Zone 2 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-on-surface">Vùng 2 — Nông thôn & Hải đảo</span>
            <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full font-black uppercase">Vùng xa</span>
          </div>
          <span className="font-plus-jakarta font-bold text-on-surface">{fmtPrice(product.priceZone2)}</span>
        </div>
        <div className="h-4 bg-surface-container-low dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-700"
            style={{ width: `${(product.priceZone2 / maxVal) * 100}%` }}
          />
        </div>
      </div>

      {/* Diff summary */}
      <div className="flex items-center justify-between bg-surface-container-low dark:bg-slate-800/50 rounded-xl p-4 border border-white/10">
        <span className="text-sm text-slate-400 font-bold">Chênh lệch giữa 2 Vùng</span>
        <div className="flex items-center gap-3">
          <span className="font-plus-jakarta font-bold text-amber-600 text-lg">+{fmtPriceShort(diff)}</span>
          <span className="text-xs text-slate-400 font-bold">(+{pct}%)</span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   Price Comparison Bar Chart (pure SVG)
   ══════════════════════════════════════════════════════ */
const PriceComparisonChart = ({ items, currentId }: { items: PetrolProduct[]; currentId: string }) => {
  const sorted = [...items].filter(p => p.priceZone1 > 0).sort((a, b) => b.priceZone1 - a.priceZone1);
  const maxPrice = sorted[0]?.priceZone1 || 1;

  return (
    <div className="space-y-3">
      {sorted.map(item => {
        const isCurrent = item.id === currentId;
        const barWidth = (item.priceZone1 / maxPrice) * 100;
        const isGas = item.id.startsWith('ron') || item.id.startsWith('e5');

        return (
          <div key={item.id} className={cn(
            "flex items-center gap-4 p-3 rounded-xl transition-all",
            isCurrent ? "bg-primary/10 ring-2 ring-primary/30" : "hover:bg-surface-container-low dark:hover:bg-slate-800/50"
          )}>
            <div className="w-36 flex-shrink-0">
              <p className={cn("text-sm font-bold truncate", isCurrent ? "text-primary" : "text-on-surface")}>{item.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{item.id}</p>
            </div>
            <div className="flex-1 h-6 bg-surface-container-low dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  isCurrent
                    ? "bg-gradient-to-r from-primary to-blue-400"
                    : isGas
                      ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                      : "bg-gradient-to-r from-sky-400 to-blue-400"
                )}
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <span className={cn(
              "font-plus-jakarta font-bold text-sm w-32 text-right flex-shrink-0",
              isCurrent ? "text-primary" : "text-on-surface"
            )}>
              {fmtPrice(item.priceZone1)}
            </span>
          </div>
        );
      })}
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

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between py-2.5 px-4 bg-surface dark:bg-slate-900/50 rounded-xl">
    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">{label}</span>
    <span className="text-sm font-bold text-on-surface text-right ml-4">{value}</span>
  </div>
);
