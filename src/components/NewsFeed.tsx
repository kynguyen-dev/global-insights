import { ChevronRight, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useNews } from '../hooks/useDashboardData';

export const NewsFeed = () => {
  const { news, loading, error } = useNews();

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
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-plus-jakarta font-bold text-on-surface">Global Financial News</h2>
        <button className="text-primary font-semibold text-sm hover:underline flex items-center gap-1 group">
          View All Headlines 
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden clay-card transition-all hover:-translate-y-2 duration-300 group border border-white/20">
            <div className="relative h-48 overflow-hidden">
              <img 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={item.image} 
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              <h3 className="font-plus-jakarta font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-on-surface-variant line-clamp-3 dark:text-slate-400">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                     <img src={`https://i.pravatar.cc/150?u=${item.author}`} alt={item.author} />
                  </div>
                  <span className="text-xs text-on-surface-variant dark:text-slate-400">{item.author}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-outline uppercase font-bold tracking-tighter dark:text-slate-500">
                  <Clock className="w-3 h-3" />
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
