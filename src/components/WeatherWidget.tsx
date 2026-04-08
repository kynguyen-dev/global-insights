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
    <div className="h-full bg-gradient-to-br from-primary to-primary-dim text-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 clay-card relative overflow-hidden group shadow-clay-card border border-white/20 transition-all duration-300">
      {/* Background Glow Effect */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all duration-700"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center h-full gap-8">
        <div className="space-y-5 w-full md:w-auto">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full w-fit shadow-neu-inset border border-white/10">
                <MapPin className="w-6 h-6" />
                <span className="text-base font-extrabold tracking-tight">{data.city}</span>
              </div>
              <button 
                onClick={() => setIsSearching(!isSearching)}
                className="p-4 hover:bg-white/20 rounded-full transition-all md:hidden bg-white/10 shadow-clay-button"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>

            {isSearching || error ? (
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter city..."
                  className="w-full bg-white/10 border-none rounded-full px-8 py-4 text-sm font-bold placeholder:text-white/60 focus:ring-4 focus:ring-white/40 outline-none backdrop-blur-md shadow-neu-inset transition-all"
                  autoFocus
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 hover:bg-white/20 rounded-full transition-colors">
                  <Search className="w-6 h-6 text-white/80" />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsSearching(true)}
                className="hidden md:flex items-center gap-3 text-white/80 hover:text-white transition-all text-sm font-black bg-white/10 px-6 py-3 rounded-full shadow-clay-button border border-white/10 tracking-widest uppercase"
              >
                <Search className="w-4 h-4" />
                Change City
              </button>
            )}

            {error && (
              <div className="flex items-center gap-3 text-red-200 text-xs bg-red-500/20 p-3 rounded-full backdrop-blur-sm border border-red-500/20">
                <AlertCircle className="w-4 h-4" />
                <span className="font-bold tracking-wide">{error}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-baseline gap-2">
            <h2 className="text-6xl sm:text-8xl font-plus-jakarta font-extrabold tracking-tighter drop-shadow-lg">{data.temp}°</h2>
            <span className="text-2xl font-black opacity-80 pb-4">C</span>
          </div>
          
          <p className="text-xl font-bold tracking-tight opacity-90">{data.condition}</p>
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
  <div className="bg-white/10 backdrop-blur-xl p-3 sm:p-5 rounded-[1rem] sm:rounded-[1.5rem] flex flex-col items-center justify-center min-w-0 shadow-neu-flat border border-white/10 hover:bg-white/20 transition-all duration-500 group/item">
    <Icon className="text-white w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 opacity-90 transition-transform group-hover/item:scale-110" />
    <span className="text-[8px] sm:text-[9px] uppercase opacity-70 mb-1 font-black tracking-[0.2em]">{label}</span>
    <span className="text-base sm:text-xl font-black tracking-tight">{value}</span>
  </div>
);


