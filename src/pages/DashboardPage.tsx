import { Plus } from 'lucide-react'
import { WeatherWidget } from '../components/WeatherWidget'
import { MarketSignals } from '../components/MarketSignals'
import { NewsFeed } from '../components/NewsFeed'

export const DashboardPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between px-6">
        <div>
          <h2 className="text-5xl font-plus-jakarta font-black text-blue-900 dark:text-blue-100 tracking-tighter">Dashboard</h2>
          <p className="text-slate-500 font-bold mt-2 opacity-70">Real-time market intelligence and environmental data.</p>
        </div>
        <button className="flex items-center gap-4 bg-primary text-white clay-button shadow-clay-card hover:scale-[1.05] transition-all uppercase tracking-widest text-xs font-black">
          <Plus className="w-5 h-5 stroke-[4px]" />
          <span>Add Widget</span>
        </button>
      </div>



      {/* Bento Grid Section */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <WeatherWidget />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <MarketSignals />
        </div>
      </div>

      {/* News Feed Section */}
      <NewsFeed />
    </div>
  )
}
