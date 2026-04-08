import { ChevronRight, Clock, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useNews } from '../hooks/useDashboardData';

export const NewsFeed = () => {
  const { news, loading, error } = useNews();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-500 font-medium">Fetching latest news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/20">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-bold">Failed to load news</p>
          <p className="text-red-500/70 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 sm:px-6 gap-3">
        <h2 className="text-2xl sm:text-4xl font-plus-jakarta font-black text-on-surface tracking-tighter">Market Pulse</h2>
        <button
          onClick={() => navigate({ to: '/news' })}
          className="text-primary font-black text-xs sm:text-sm uppercase tracking-widest hover:underline flex items-center gap-2 sm:gap-3 group bg-surface px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full shadow-clay-button transition-all border border-white/40 w-fit"
        >
          More Headlines 
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate({ to: '/news/$newsId', params: { newsId: item.id } })}
            className="bg-surface-container-low rounded-[2rem] overflow-hidden clay-card transition-all hover:-translate-y-2 duration-500 group border border-white/20 cursor-pointer flex flex-col"
          >
            {/* Image container with fixed aspect ratio */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
              <img 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                src={item.image}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback placeholder when image fails */}
              <div
                className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Image unavailable</p>
                </div>
              </div>
              <div className="absolute top-5 left-5">
                <span className="bg-surface/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-neu-flat tracking-[0.2em] text-primary border border-white/30">
                  {item.category}
                </span>
              </div>
            </div>
            
            {/* Content area with flex-grow for consistent card height */}
            <div className="p-6 flex flex-col flex-grow space-y-4">
              <h3 className="font-plus-jakarta font-black text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2 dark:text-white tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm text-on-surface-variant line-clamp-2 dark:text-slate-400 font-bold leading-relaxed opacity-80 flex-grow">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between pt-5 border-t border-white/20 dark:border-white/10 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface shadow-clay-button overflow-hidden border border-white/40 p-0.5 flex-shrink-0">
                     <img className="rounded-full w-full h-full object-cover" src={`https://i.pravatar.cc/150?u=${item.author}`} alt={item.author} />
                  </div>
                  <span className="text-xs font-black text-on-surface-variant dark:text-slate-400 tracking-wide">{item.author}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-primary uppercase font-black tracking-widest bg-primary/10 px-4 py-1.5 rounded-full shadow-neu-inset flex-shrink-0">
                  <Clock className="w-4 h-4" />
                  {item.readTime}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
