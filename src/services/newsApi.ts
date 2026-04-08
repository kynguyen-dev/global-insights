// ── News API Service ──
// Currently provides curated mock data.
// To integrate a real API (GNews, NewsData, etc.), replace fetchNews()
// with actual API calls and set VITE_NEWS_API_KEY in .env

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  source: string;
  category: NewsCategory;
  image: string;
  publishedAt: string;
  readTime: string;
  url: string;
}

export type NewsCategory = 'All Stories' | 'Technology' | 'Economics' | 'Markets' | 'Energy' | 'Weather' | 'Logistics';

export const NEWS_CATEGORIES: NewsCategory[] = [
  'All Stories', 'Technology', 'Economics', 'Markets', 'Energy', 'Weather', 'Logistics'
];

// ── Curated News Data ──
const ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'The Silicon Tide: How Decentralized Networks are Reshaping Global Market Nodes',
    description: 'New analytical data suggests that emerging economies are bypassing traditional cloud infrastructure in favor of distributed computing networks.',
    content: 'Distributed ledger technologies and decentralized computing platforms are fundamentally altering how data is processed and stored globally. Rather than relying on traditional cloud providers with centralized data centers, emerging markets are adopting peer-to-peer infrastructure that offers lower costs and greater resilience.',
    author: 'Adrian Clarke',
    source: 'Global Insights',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readTime: '13 min read',
    url: '#'
  },
  {
    id: 'art-2',
    title: 'Interest Rate Volatility Peaks in Q3 as Central Banks Diverge',
    description: 'Global markets brace for the impact of the latest central bank announcements regarding digital currency adoption and monetary policy shifts.',
    content: 'The Federal Reserve, ECB, and Bank of Japan have taken increasingly divergent paths on interest rate policy. While the Fed signals potential cuts, the ECB maintains a hawkish stance, creating arbitrage opportunities in forex markets.',
    author: 'Sarah Dunn',
    source: 'Market Watch',
    category: 'Economics',
    image: 'https://images.unsplash.com/photo-1611974717484-2970fd604928?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    readTime: '8 min read',
    url: '#'
  },
  {
    id: 'art-3',
    title: 'Next-Gen Solar Cells Reach Record Efficiency Breakthroughs',
    description: 'Perovskite-based thin-film cells outperforming traditional silicon panels in laboratory-scale testing phases across multiple research institutions.',
    content: 'Researchers at MIT and Stanford have independently achieved 33.7% efficiency in tandem perovskite-silicon solar cells, surpassing the theoretical limit of single-junction cells.',
    author: 'Dr. Wei Chen',
    source: 'Energy Review',
    category: 'Energy',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    readTime: '6 min read',
    url: '#'
  },
  {
    id: 'art-4',
    title: 'Anomalous Storm Fronts Developing in North Atlantic',
    description: 'Meteorologists observe an unprecedented pattern of high-pressure destabilization in the North Atlantic, creating complex pressure systems forming near subtropical ridges.',
    content: 'The unusual atmospheric patterns observed this season have been linked to changes in the jet stream, potentially influenced by Arctic ice melt and ocean temperature anomalies.',
    author: 'Maria Santos',
    source: 'Climate Monitor',
    category: 'Weather',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    readTime: '7 min read',
    url: '#'
  },
  {
    id: 'art-5',
    title: 'Blockchain-Enabled Supply Chains Reduce Latency by 40%',
    description: 'Real-time enterprise tracing shows a significant processing time reduction through smart contract workflows across multiple logistics networks.',
    content: 'Major shipping conglomerates report that blockchain-based tracking and automated customs clearance have reduced port-to-destination transit times significantly.',
    author: 'James Park',
    source: 'Tech Dispatch',
    category: 'Logistics',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    readTime: '5 min read',
    url: '#'
  },
  {
    id: 'art-6',
    title: 'Gold Reserves Hit 5-Year High in Emerging Asian Markets',
    description: 'SJC prices fluctuate as regional demand for physical assets grows stronger amidst currency devaluations across the continent.',
    content: 'Central banks in Vietnam, India, and Indonesia have increased gold reserves by 18% year-over-year, signaling a strategic shift away from dollar-denominated assets.',
    author: 'L. Nguyen',
    source: 'Asia Finance',
    category: 'Markets',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    readTime: '9 min read',
    url: '#'
  },
  {
    id: 'art-7',
    title: 'Quantum Computing Startups Secure Record Venture Funding',
    description: 'The quantum computing sector has attracted over $4.2B in venture capital this quarter, marking a paradigm shift in computational investment strategies.',
    content: 'Investors are betting that practical quantum advantage will arrive sooner than expected, with companies like IonQ, PsiQuantum, and Xanadu leading the charge.',
    author: 'Rachel Kim',
    source: 'VC Insights',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    readTime: '11 min read',
    url: '#'
  },
  {
    id: 'art-8',
    title: 'Fuel Price Stabilization Policies Under Review for Q4',
    description: 'New regulatory frameworks aim to mitigate the impact of global crude oil volatility on consumer RON 95-V pricing indices.',
    content: 'Energy ministries across ASEAN nations are coordinating on price stabilization mechanisms that could buffer consumers from crude oil price swings.',
    author: 'D. Hayes',
    source: 'Energy Policy',
    category: 'Energy',
    image: 'https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=800',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    readTime: '12 min read',
    url: '#'
  },
];

// ── Fetch function (used by TanStack Query) ──
export async function fetchNews(category?: NewsCategory): Promise<NewsArticle[]> {
  // Simulate network latency for realistic UX
  await new Promise(resolve => setTimeout(resolve, 400));

  // TODO: Replace with real API call when API key is available
  // const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  // if (NEWS_API_KEY && NEWS_API_KEY !== 'your_news_api_key_here') {
  //   const res = await fetch(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=10&apikey=${NEWS_API_KEY}`);
  //   const data = await res.json();
  //   return data.articles.map(mapGnewsArticle);
  // }

  if (!category || category === 'All Stories') {
    return ARTICLES;
  }
  return ARTICLES.filter(a => a.category === category);
}

// ── Fetch single article by ID ──
export async function fetchNewsById(id: string): Promise<NewsArticle | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return ARTICLES.find(a => a.id === id) ?? null;
}

// ── Get related articles (same category, excluding current) ──
export async function fetchRelatedNews(articleId: string, category: string, limit = 3): Promise<NewsArticle[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return ARTICLES
    .filter(a => a.id !== articleId && a.category === category)
    .slice(0, limit);
}

export function getTimeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

