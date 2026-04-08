import { useMemo } from 'react';
import {
  ArrowLeft,
  Clock,
  Loader2,
  AlertCircle,
  Bookmark,
  Share2,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { cn } from '../lib/utils';
import {
  fetchNewsById,
  fetchRelatedNews,
  getTimeAgo,
  type NewsArticle,
} from '../services/newsApi';

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  Technology: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  Economics: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  Markets: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  Energy: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
  Weather: { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' },
  Logistics: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
};

export const NewsDetailPage = () => {
  const { newsId } = useParams({ from: '/news/$newsId' });
  const navigate = useNavigate();

  // Fetch the article
  const {
    data: article,
    isLoading,
    error,
  } = useQuery<NewsArticle | null, Error>({
    queryKey: ['news-article', newsId],
    queryFn: () => fetchNewsById(newsId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Fetch related articles
  const {
    data: relatedArticles = [],
  } = useQuery<NewsArticle[], Error>({
    queryKey: ['news-related', newsId, article?.category],
    queryFn: () => fetchRelatedNews(newsId, article?.category || '', 3),
    enabled: !!article?.category,
    staleTime: 5 * 60 * 1000,
  });

  const colors = useMemo(() => {
    if (!article) return categoryColors['Technology'];
    return categoryColors[article.category] || categoryColors['Technology'];
  }, [article]);

  const publishedDate = useMemo(() => {
    if (!article) return '';
    return new Date(article.publishedAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [article]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Error or not found
  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 neu-flat">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 dark:text-red-400 font-bold text-lg">
          {error ? 'Failed to load article' : 'Article not found'}
        </p>
        <p className="text-slate-500 text-sm">
          {error?.message || `No article found with ID "${newsId}"`}
        </p>
        <Link
          to="/news"
          className="clay-button bg-primary text-white text-xs uppercase tracking-widest font-black mt-4"
        >
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-6">
        <Link
          to="/news"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> News
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-sm font-bold text-on-surface truncate max-w-[300px]">
          {article.title}
        </span>
      </div>

      {/* ── Hero Image ── */}
      <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-clay-card border border-white/20">
        <div className="relative h-[220px] sm:h-[280px] lg:h-[420px]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-12">
            <span
              className={cn(
                'inline-flex w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4',
                colors.bg,
                colors.text
              )}
            >
              {article.category}
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-plus-jakarta font-extrabold text-white leading-tight tracking-tight max-w-4xl">
              {article.title}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/70 mt-2 sm:mt-4 max-w-3xl leading-relaxed hidden sm:block">
              {article.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-5 right-5 flex gap-2">
            <button className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Article Meta + Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Meta Info Bar */}
          <div className="neu-flat p-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 p-0.5 bg-surface shadow-clay-button">
                  <img
                    src={`https://i.pravatar.cc/150?u=${article.author}`}
                    alt={article.author}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface dark:text-white">{article.author}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{article.source}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bold">
                <Calendar className="w-4 h-4" />
                <span>{publishedDate}</span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />
              <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                <span className={cn('w-2 h-2 rounded-full', colors.dot)} />
                <span>{getTimeAgo(article.publishedAt)}</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="neu-flat p-5 sm:p-8 lg:p-10">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/* Lead paragraph (description, styled bigger) */}
              <p className="text-lg sm:text-xl lg:text-2xl font-plus-jakarta font-semibold text-on-surface dark:text-white leading-relaxed mb-6 sm:mb-8 tracking-tight">
                {article.description}
              </p>

              {/* Content body */}
              <div className="space-y-6 text-base text-slate-700 dark:text-slate-300 leading-[1.9]">
                <p>{article.content}</p>

                {/* Expanded content paragraphs */}
                <p>
                  Experts across the sector are monitoring these developments closely.
                  The implications for global supply chains, regulatory frameworks, and
                  investment strategies could be far-reaching as market participants adjust
                  to the evolving landscape.
                </p>

                <blockquote className="relative pl-6 py-4 my-8 border-l-4 border-primary bg-primary/5 rounded-r-2xl">
                  <p className="text-lg font-plus-jakarta font-semibold text-on-surface dark:text-white italic leading-relaxed">
                    "The convergence of technology and traditional markets is creating
                    unprecedented opportunities for those willing to adapt their strategies
                    to the new paradigm."
                  </p>
                  <cite className="text-sm text-primary font-bold mt-3 block not-italic">
                    — {article.author}, {article.source}
                  </cite>
                </blockquote>

                <p>
                  Market analysts suggest that the coming quarters will be crucial in
                  determining whether these shifts represent a temporary correction or a
                  fundamental restructuring of the industry. Stakeholders are advised to
                  maintain diversified portfolios while keeping a close watch on emerging
                  regulatory developments.
                </p>

                <p>
                  As the situation continues to evolve, we will provide ongoing updates and
                  in-depth analysis to help our readers make informed decisions in this
                  dynamic environment.
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 mt-10 pt-8 border-t border-slate-200 dark:border-slate-700/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags:</span>
              {[article.category, 'Analysis', 'Global Markets'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container-low dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-white/20 dark:border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Article Info Card */}
          <div className="neu-flat p-6 space-y-5">
            <h3 className="font-plus-jakarta font-bold text-base dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              About the Author
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/20 p-0.5 bg-surface shadow-clay-button">
                <img
                  src={`https://i.pravatar.cc/150?u=${article.author}`}
                  alt={article.author}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-on-surface dark:text-white">{article.author}</p>
                <p className="text-xs text-slate-400 font-bold">{article.source}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                  Senior Analyst
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Covering {article.category.toLowerCase()} markets and global economic trends with data-driven
              insights and expert analysis.
            </p>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="neu-flat p-6 space-y-5">
              <h3 className="font-plus-jakarta font-bold text-base dark:text-white">
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((related) => (
                  <div
                    key={related.id}
                    onClick={() => navigate({ to: '/news/$newsId', params: { newsId: related.id } })}
                    className="flex gap-4 p-3 -mx-3 rounded-xl hover:bg-surface-container-low dark:hover:bg-slate-800/50 cursor-pointer transition-all group"
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-on-surface dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {related.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-bold">
                        <Clock className="w-3 h-3" />
                        {related.readTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to News */}
          <Link
            to="/news"
            className="neu-flat p-5 flex items-center justify-between group cursor-pointer hover:-translate-y-1 transition-all duration-300 block"
          >
            <div>
              <p className="font-bold text-sm text-on-surface dark:text-white group-hover:text-primary transition-colors">
                Browse All Headlines
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                Explore more stories
              </p>
            </div>
            <div className="p-2.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
