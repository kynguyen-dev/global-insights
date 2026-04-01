import React, { useState } from 'react';
import { MapPin, Droplets, Wind, Gauge, Eye, Loader2, Search, AlertCircle } from 'lucide-react';
import { useWeather } from '../hooks/useDashboardData';

export const WeatherWidget = () => {
  const { data, loading, error, city, updateCity } = useWeather();
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      updateCity(searchInput.trim());
      setSearchInput('');
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full min-h-[400px] bg-slate-100 dark:bg-slate-800 rounded-[2rem] clay-card flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-primary to-primary-dim text-white rounded-[2rem] p-8 clay-card relative overflow-hidden group">
      {/* Background Glow Effect */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center h-full gap-8">
        <div className="space-y-4 w-full md:w-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full w-fit">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-semibold">{data.city}</span>
              </div>
              <button 
                onClick={() => setIsSearching(!isSearching)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors md:hidden"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {isSearching || error ? (
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search city..."
                  className="w-full bg-white/20 border-none rounded-xl px-4 py-2 text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/40 outline-none backdrop-blur-md"
                  autoFocus
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-white/80" />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsSearching(true)}
                className="hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs"
              >
                <Search className="w-3 h-3" />
                Change City
              </button>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-200 text-xs bg-red-500/20 p-2 rounded-lg backdrop-blur-sm">
                <AlertCircle className="w-3 h-3" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-baseline gap-2">
            <h2 className="text-8xl font-plus-jakarta font-extrabold tracking-tighter">{data.temp}°</h2>
            <span className="text-2xl font-medium opacity-80 pb-4">C</span>
          </div>
          
          <p className="text-xl font-medium">{data.condition}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <WeatherDetail icon={Droplets} label="Humidity" value={data.humidity} />
          <WeatherDetail icon={Wind} label="Wind" value={data.wind} />
          <WeatherDetail icon={Gauge} label="Pressure" value={data.pressure} />
          <WeatherDetail icon={Eye} label="UV Index" value={data.uv} />
        </div>
      </div>
    </div>
  );
};

const WeatherDetail = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/10 hover:bg-white/20 transition-colors">
    <Icon className="text-primary-container w-6 h-6 mb-2" />
    <span className="text-[10px] uppercase opacity-70 mb-1 font-bold">{label}</span>
    <span className="text-lg font-bold">{value}</span>
  </div>
);
