import { Plus } from 'lucide-react'
import { WeatherWidget } from '../components/WeatherWidget'
import { MarketSignals } from '../components/MarketSignals'
import { NewsFeed } from '../components/NewsFeed'

export const DashboardPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-plus-jakarta font-bold text-blue-900 dark:text-blue-100">Dashboard</h2>
          <p className="text-slate-500">Stay updated with the latest market trends and insights.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all clay-button-primary">
          <Plus className="w-5 h-5" />
          Add Widget
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
