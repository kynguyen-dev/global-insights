import {
  Fuel,
  TrendingUp,
  Loader2,
  AlertCircle,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  Info,
  Landmark,
  Flame,
  Droplets,
  ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '../lib/utils';

// ── Types for the enhanced proxy response ──
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

// ── Fetch all petrol products ──
async function fetchAllPetrolProducts(): Promise<PetrolProxyResponse> {
  const res = await fetch('/api/proxy-petrol');
  if (!res.ok) throw new Error('Failed to fetch petrol data');
  return res.json();
}

// ── Format price ──
function fmtPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ/lít';
}

function fmtDiff(zone1: number, zone2: number): string {
  const diff = zone2 - zone1;
  return diff > 0 ? `+${new Intl.NumberFormat('vi-VN').format(diff)}đ` : '0';
}

export const PetrolDetailPage = () => {
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
  const gasolineProducts = items.filter(p => p.id.startsWith('ron') || p.id.startsWith('e5'));
  const dieselProducts = items.filter(p => p.id.startsWith('do') || p.id === 'dauhoa');
  const featured = items[0]; // RON 95-V

  if (error && !response) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 neu-flat">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 font-bold text-lg">Unable to fetch petrol prices</p>
        <p className="text-red-500/70">{error.message}</p>
        <button onClick={() => refetch()} className="clay-button bg-primary text-white text-xs uppercase tracking-widest font-black mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", loading && "opacity-80")}>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between px-6">
        <div>
          <h2 className="text-5xl font-plus-jakarta font-black text-blue-900 dark:text-blue-100 tracking-tighter">
            Petrol Board
          </h2>
          <p className="text-slate-500 font-bold mt-2 opacity-70">
            Fuel prices — Gasoline & Diesel (Petrolimex)
          </p>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden rounded-[2rem] min-h-[360px] shadow-clay-card border border-white/20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-800">
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute left-1/3 -top-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-16 bottom-10 w-40 h-40 bg-emerald-300/20 rounded-full blur-2xl" />

        <div className="relative z-10 p-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Fuel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-[0.3em] font-black">Petrolimex</p>
                  <h1 className="text-3xl font-plus-jakarta font-extrabold text-white tracking-tight">
                    Fuel Price Dashboard
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

          {/* Big Price */}
          <div className="mt-8">
            <p className="text-sm text-white/60 font-bold uppercase tracking-widest mb-1">
              Xăng RON 95-V — Vùng 1
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-plus-jakarta font-extrabold text-white leading-none tracking-tighter">
                {loading ? '...' : featured ? new Intl.NumberFormat('vi-VN').format(featured.priceZone1) : 'N/A'}
              </span>
              <span className="text-2xl font-plus-jakarta text-white/50 font-bold">VNĐ/lít</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 mt-6">
            <HeroChip label="RON 95-V" value={featured ? fmtPrice(featured.priceZone1) : '—'} />
            <HeroChip label="RON 95-III" value={items[1] ? fmtPrice(items[1].priceZone1) : '—'} />
            <HeroChip label="E5 RON 92" value={items[2] ? fmtPrice(items[2].priceZone1) : '—'} />
            <HeroChip label="Diesel DO" value={items[3] ? fmtPrice(items[3].priceZone1) : '—'} />
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Fuel}
          label="Products"
          value={`${items.length} fuel types`}
          sub="Gasoline & Diesel"
          color="text-emerald-600"
          bg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          icon={MapPin}
          label="Pricing Zones"
          value="2 zones"
          sub="Zone 1 (Urban) & Zone 2 (Rural)"
          color="text-blue-600"
          bg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={Landmark}
          label="Regulator"
          value="MoIT"
          sub="Ministry of Industry & Trade"
          color="text-purple-600"
          bg="bg-purple-100 dark:bg-purple-900/30"
        />
        <StatCard
          icon={ShieldCheck}
          label="Update Cycle"
          value="Every 15 days"
          sub="Government decree schedule"
          color="text-amber-600"
          bg="bg-amber-100 dark:bg-amber-900/30"
        />
      </div>

      {/* ── Gasoline Products ── */}
      <div className="neu-flat p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <Flame className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">Gasoline (Xăng)</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {gasolineProducts.length} products • Petrolimex retail prices
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {gasolineProducts.map((product, i) => (
              <FuelCard key={product.id} product={product} rank={i + 1} accentClass="from-emerald-500 to-teal-500" />
            ))}
          </div>
        )}
      </div>

      {/* ── Diesel & Oil Products ── */}
      <div className="neu-flat p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
            <Droplets className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">Diesel & Oil (Dầu)</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {dieselProducts.length} products • Industrial & household
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {dieselProducts.map((product, i) => (
              <FuelCard key={product.id} product={product} rank={i + 1} accentClass="from-sky-500 to-blue-500" />
            ))}
          </div>
        )}
      </div>

      {/* ── Full Comparison Table ── */}
      <div className="neu-flat p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <FileText className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <h2 className="font-plus-jakarta font-bold text-xl dark:text-white">Price Comparison — Zone 1 vs Zone 2</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              All Petrolimex products
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black border-b border-white/10 dark:border-slate-700/50">
                <th className="text-left py-4 px-5">Product</th>
                <th className="text-right py-4 px-5">
                  <div className="flex items-center gap-1 justify-end">
                    <MapPin className="w-3 h-3" /> Zone 1 (VNĐ/lít)
                  </div>
                </th>
                <th className="text-right py-4 px-5">
                  <div className="flex items-center gap-1 justify-end">
                    <MapPin className="w-3 h-3" /> Zone 2 (VNĐ/lít)
                  </div>
                </th>
                <th className="text-right py-4 px-5">Difference</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr
                  key={p.id}
                  onClick={() => navigate({ to: '/petrol/$petrolId', params: { petrolId: p.id } })}
                  className="border-b border-white/5 dark:border-slate-700/30 last:border-0 hover:bg-white/40 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border",
                        p.id.startsWith('ron') || p.id.startsWith('e5')
                          ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-700/30"
                          : "bg-sky-100 dark:bg-sky-900/30 border-sky-200/50 dark:border-sky-700/30"
                      )}>
                        {p.id.startsWith('ron') || p.id.startsWith('e5')
                          ? <Fuel className="w-4 h-4 text-emerald-600" />
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
                        {fmtDiff(p.priceZone1, p.priceZone2)}
                      </span>
                    ) : '—'}
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Info Section ── */}
      <div className="neu-flat p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Info className="w-5 h-5 text-slate-500" />
          </div>
          <h3 className="font-plus-jakarta font-bold text-base dark:text-white">About Fuel Prices in Vietnam</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-xl p-5 space-y-2">
            <p><strong className="text-on-surface">Pricing Zones:</strong> Vietnam divides its territory into two pricing zones. <strong className="text-on-surface">Zone 1</strong> covers major cities (Hanoi, HCMC, Da Nang) while <strong className="text-on-surface">Zone 2</strong> covers rural/mountainous provinces and all islands.</p>
            <p>Zone 2 prices are higher due to increased transportation and distribution costs to remote areas.</p>
          </div>
          <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-xl p-5 space-y-2">
            <p><strong className="text-on-surface">RON 95-V</strong> is the premium gasoline, while <strong className="text-on-surface">E5 RON 92</strong> is the ethanol-blended standard option (5% bioethanol). The government encourages E5 adoption with lower taxation.</p>
            <p>Prices are adjusted by the <strong className="text-on-surface">Ministry of Industry and Trade (MoIT)</strong> every 15 days based on world oil prices, exchange rates, and the national fuel price stabilization fund.</p>
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

const FuelCard = ({ product, rank, accentClass }: { product: PetrolProduct; rank: number; accentClass: string }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate({ to: '/petrol/$petrolId', params: { petrolId: product.id } })}
      className="bg-surface-container-low dark:bg-slate-800/50 rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden cursor-pointer"
    >
      {/* Accent stripe */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", accentClass)} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-xs font-black text-primary shadow-clay-button">
            {rank}
          </div>
          <div>
            <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{product.name}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{product.id}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
      </div>

      {/* Zone prices */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-surface dark:bg-slate-900/50 rounded-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zone 1</span>
          </div>
          <span className="font-plus-jakarta font-bold text-on-surface">
            {product.priceZone1 ? fmtPrice(product.priceZone1) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-surface dark:bg-slate-900/50 rounded-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zone 2</span>
          </div>
          <span className="font-plus-jakarta font-bold text-slate-500">
            {product.priceZone2 ? fmtPrice(product.priceZone2) : '—'}
          </span>
        </div>
      </div>

      {/* Diff */}
      {product.priceZone1 > 0 && product.priceZone2 > 0 && (
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold">Zone diff:</span>
          <span className="font-bold text-amber-500">{fmtDiff(product.priceZone1, product.priceZone2)}</span>
        </div>
      )}
    </div>
  );
};
