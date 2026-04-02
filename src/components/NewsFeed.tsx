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
    <section className="space-y-12">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-4xl font-plus-jakarta font-black text-on-surface tracking-tighter">Market Pulse</h2>
        <button className="text-primary font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-3 group bg-surface px-8 py-3.5 rounded-full shadow-clay-button transition-all border border-white/40">
          More Headlines 
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {news.map((item) => (
          <div key={item.id} className="bg-surface-container-low rounded-[4rem] overflow-hidden clay-card transition-all hover:-translate-y-4 duration-500 group border border-white/20">
            <div className="relative h-64 overflow-hidden">
              <img 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                src={item.image} 
              />
              <div className="absolute top-8 left-8">
                <span className="bg-surface/95 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-neu-flat tracking-[0.2em] text-primary border border-white/30">
                  {item.category}
                </span>
              </div>
            </div>
            
            <div className="p-10 space-y-6">
              <h3 className="font-plus-jakarta font-black text-2xl leading-tight group-hover:text-primary transition-colors line-clamp-2 dark:text-white tracking-tight">
                {item.title}
              </h3>
              <p className="text-base text-on-surface-variant line-clamp-3 dark:text-slate-400 font-bold leading-relaxed opacity-80">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between pt-8 border-t border-white/20 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface shadow-clay-button overflow-hidden border border-white/40 p-0.5">
                     <img className="rounded-full" src={`https://i.pravatar.cc/150?u=${item.author}`} alt={item.author} />
                  </div>
                  <span className="text-xs font-black text-on-surface-variant dark:text-slate-400 tracking-wide">{item.author}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-primary uppercase font-black tracking-widest bg-primary/10 px-4 py-1.5 rounded-full shadow-neu-inset">
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


