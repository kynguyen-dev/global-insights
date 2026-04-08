
import { WeatherWidget } from '../components/WeatherWidget'
import { MarketSignals } from '../components/MarketSignals'
import { NewsFeed } from '../components/NewsFeed'

export const DashboardPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 sm:px-6 gap-2">
        <div>
          <h2 className="text-3xl sm:text-5xl font-plus-jakarta font-black text-blue-900 dark:text-blue-100 tracking-tighter">Dashboard</h2>
          <p className="text-slate-500 font-bold mt-1 sm:mt-2 opacity-70 text-sm sm:text-base">Real-time market intelligence and environmental data.</p>
        </div>
      </div>



      {/* Bento Grid Section */}
      <div className="grid grid-cols-12 gap-6">
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
