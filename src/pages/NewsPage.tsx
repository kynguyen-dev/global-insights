import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Clock,
  Loader2,
  AlertCircle,
  TrendingUp,
  Gauge,
  Search,
  Bookmark,
  Share2,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { fetchNews, getTimeAgo, NEWS_CATEGORIES, type NewsCategory, type NewsArticle } from '../services/newsApi';
import { useWeather } from '../hooks/useDashboardData';
import { cn } from '../lib/utils';

export const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All Stories');
  const navigate = useNavigate();

  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery<NewsArticle[], Error>({
    queryKey: ['news', activeCategory],
    queryFn: () => fetchNews(activeCategory),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { data: weather } = useWeather();

  const featuredArticle = articles[0];
  const secondaryArticle = articles[1];
  const latestArticles = articles.slice(2);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Category Tabs ── */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 border",
              activeCategory === cat
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105"
                : "bg-surface-container-low dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-white/20 dark:border-slate-700 hover:bg-surface-container-high dark:hover:bg-slate-700 hover:scale-105"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Loading State ── */}
      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}

      {/* ── Error State ── */}
      {error && !articles.length && (
        <div className="flex flex-col items-center justify-center py-20 neu-flat">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
          <p className="text-red-600 dark:text-red-400 font-bold">Failed to load news</p>
          <p className="text-red-500/70 text-sm">{error.message}</p>
        </div>
      )}

      {!isLoading && articles.length > 0 && (
        <>
          {/* ── Featured + Secondary Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured Article (Hero) */}
            {featuredArticle && (
              <div
                className="lg:col-span-8 group cursor-pointer"
                onClick={() => navigate({ to: '/news/$newsId', params: { newsId: featuredArticle.id } })}
              >
                <div className="relative h-[240px] sm:h-[320px] lg:h-[420px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-clay-card">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                    <span className="inline-flex w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] bg-primary text-white mb-3">
                      {featuredArticle.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-plus-jakarta font-extrabold text-white leading-tight mb-2 sm:mb-3 group-hover:text-primary/90 transition-colors line-clamp-3">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-2 mb-4 max-w-2xl">
                      {featuredArticle.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-white/50" />
                        <span className="text-xs text-white/60 font-medium">{featuredArticle.readTime}</span>
                      </div>
                      <span className="text-white/30">·</span>
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://i.pravatar.cc/40?u=${featuredArticle.author}`}
                          alt={featuredArticle.author}
                          className="w-6 h-6 rounded-full border border-white/30"
                        />
                        <span className="text-xs text-white/60 font-medium">{featuredArticle.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons (top right) */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Article + Mini Widget Stack */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {secondaryArticle && (
                <div
                  className="neu-flat p-5 group cursor-pointer flex-1"
                  onClick={() => navigate({ to: '/news/$newsId', params: { newsId: secondaryArticle.id } })}
                >
                  <span className="inline-flex w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 mb-3">
                    {secondaryArticle.category}
                  </span>
                  <h3 className="font-plus-jakarta font-bold text-lg leading-snug dark:text-white group-hover:text-primary transition-colors line-clamp-3 mb-3">
                    {secondaryArticle.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {secondaryArticle.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://i.pravatar.cc/40?u=${secondaryArticle.author}`}
                        alt={secondaryArticle.author}
                        className="w-7 h-7 rounded-full border-2 border-surface"
                      />
                      <span className="text-xs text-slate-500 font-bold">{secondaryArticle.author}</span>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              {/* Atmospheric Pressure Widget */}
              <div className="neu-flat p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Local Atmospheric Pressure</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{weather.city}</p>
                  </div>
                  <Gauge className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-end gap-4">
                  <span className="text-4xl font-plus-jakarta font-extrabold dark:text-white">
                    {weather.pressure.replace(' hPa', '')}
                  </span>
                  <span className="text-sm text-slate-400 font-bold mb-1">hPa</span>
                  <div className="ml-auto text-right">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">High Stability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Latest Updates Section ── */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-plus-jakarta font-extrabold text-xl dark:text-white">Latest Updates</h2>
              <button className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* ── Bottom Widgets Row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Index Correlation Widget */}
            <div className="neu-flat p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-plus-jakarta font-bold text-base dark:text-white">Index Correlation</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Weather-linked commodity pricing</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Real-time commodity pricing is currently disrupted by emerging market fluctuations.
                Temperature anomalies in Southeast Asia correlate with a <span className="text-primary font-bold">+3.2%</span> shift in agricultural futures.
              </p>
              <div className="mt-4 flex gap-3">
                {['Agriculture', 'Energy', 'Metals'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container-low dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-white/20 dark:border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Trending Topics Widget */}
            <div className="neu-flat p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-plus-jakarta font-bold text-base dark:text-white">Trending Topics</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Most searched this week</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Decentralized Finance', change: '+42%', hot: true },
                  { label: 'Solar Cell Efficiency', change: '+28%', hot: true },
                  { label: 'Gold Reserves Asia', change: '+19%', hot: false },
                  { label: 'Quantum Computing VC', change: '+15%', hot: false },
                ].map((topic, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low dark:bg-slate-800/50 rounded-xl hover:bg-surface-container-high dark:hover:bg-slate-700 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-400 w-5">{i + 1}</span>
                      <span className="text-sm font-bold dark:text-white group-hover:text-primary transition-colors">{topic.label}</span>
                      {topic.hot && <span className="text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-md uppercase">Hot</span>}
                    </div>
                    <span className="text-xs font-bold text-emerald-500">{topic.change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Article Card Component ── */
const ArticleCard = ({ article }: { article: NewsArticle }) => {
  const navigate = useNavigate();
  const categoryColors: Record<string, string> = {
    Technology: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    Economics: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    Markets: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    Energy: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    Weather: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
    Logistics: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  };

  return (
    <div
      className="neu-flat overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-500"
      onClick={() => navigate({ to: '/news/$newsId', params: { newsId: article.id } })}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]",
            categoryColors[article.category] || 'bg-slate-100 text-slate-700'
          )}>
            {article.category}
          </span>
        </div>
        <span className="absolute top-4 right-4 text-[10px] text-white/70 font-bold bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {getTimeAgo(article.publishedAt)}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-plus-jakarta font-bold text-base leading-snug dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {article.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <img
              src={`https://i.pravatar.cc/40?u=${article.author}`}
              alt={article.author}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-slate-500 font-bold">{article.author}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-primary font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </div>
        </div>
      </div>
    </div>
  );
};
