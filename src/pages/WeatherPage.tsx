import React from 'react';
import { 
  Cloud, 
  Sun, 
  CloudSun, 
  Wind, 
  Sunrise, 
  Sunset, 
  CloudRain, 
  Moon, 
  Droplets, 
  Eye, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useWeather } from '../hooks/useDashboardData';

export const WeatherPage = () => {
  const { data, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-slate-500 font-medium">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/20">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-bold text-lg">Unable to fetch weather</p>
          <p className="text-red-500/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 weather-gradient rounded-[2.5rem] p-10 text-white flex flex-col justify-between min-h-[400px] relative overflow-hidden clay-card-tactile">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-plus-jakarta font-extrabold tracking-tight">{data.city}</h1>
              <p className="text-lg opacity-90 mt-2 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
               <CloudSun className="w-24 h-24 text-white" />
            </div>
          </div>
          
          <div className="relative z-10 flex items-end justify-between mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-9xl font-plus-jakarta font-extrabold leading-none">{data.temp}°</span>
              <span className="text-4xl font-plus-jakarta opacity-60">C</span>
            </div>
            <div className="flex gap-8">
              <WeatherStat label="Wind" value={data.wind} />
              <WeatherStat label="Humidity" value={data.humidity} />
              <WeatherStat label="Visibility" value={data.visibility || '10 mi'} />
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Air Quality & Details */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 clay-card-tactile flex-grow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-plus-jakarta font-bold text-xl dark:text-white">Air Quality</h3>
              <Wind className="text-primary w-6 h-6" />
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">AQI Index</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                  {data.airQuality?.label || 'Good'}
                </span>
              </div>
              <div className="text-5xl font-plus-jakarta font-extrabold text-primary">
                {data.airQuality?.index || 42}
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${data.airQuality?.index || 42}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {data.airQuality?.description || 'Air quality is considered satisfactory, and air pollution poses little or no risk.'}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low dark:bg-slate-800/50 rounded-[2rem] p-6 clay-card-tactile">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-2xl">
                <Sunrise className="text-secondary w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Sunrise & Sunset</p>
                <p className="text-sm font-bold dark:text-white">{data.sunrise} • {data.sunset}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Forecast */}
      <div className="space-y-6">
        <h2 className="font-plus-jakarta font-bold text-2xl px-2 dark:text-white">24-Hour Forecast</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {data.hourlyForecast?.map((item, index) => (
            <div 
              key={index}
              className={`min-w-[130px] rounded-[2rem] p-6 flex flex-col items-center gap-4 transition-all duration-300 ${
                index === 1 
                ? 'bg-primary text-white clay-card shadow-lg scale-105' 
                : 'bg-white dark:bg-slate-800 dark:text-white clay-card-tactile border border-white/50 dark:border-slate-700'
              }`}
            >
              <p className={`text-xs font-bold ${index === 1 ? 'opacity-80' : 'text-slate-400'}`}>{item.time}</p>
              <WeatherIcon condition={item.condition} className="w-10 h-10" />
              <p className="text-2xl font-plus-jakarta font-bold">{item.temp}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Outlook & More Stats */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 clay-card-tactile">
          <h2 className="font-plus-jakarta font-bold text-2xl mb-8 dark:text-white">7-Day Outlook</h2>
          <div className="space-y-3">
            {data.dailyForecast?.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/40 rounded-3xl hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 group"
              >
                <span className="w-28 font-bold text-slate-600 dark:text-slate-300">{item.day}</span>
                <div className="flex items-center gap-4 flex-1 justify-center">
                  <WeatherIcon condition={item.condition} className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-slate-400">{item.chance} Chance</span>
                </div>
                <div className="flex gap-6 w-28 justify-end">
                  <span className="font-bold text-lg dark:text-white">{item.tempHigh}°</span>
                  <span className="text-slate-400 dark:text-slate-500 text-lg">{item.tempLow}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 clay-card-tactile border border-white/50 dark:border-slate-700 relative overflow-hidden">
            <h3 className="font-plus-jakarta font-bold text-xl mb-8 dark:text-white">UV Index</h3>
            <div className="flex items-center gap-8">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f3f3f6"
                    strokeWidth="3"
                    className="dark:stroke-slate-700"
                  ></path>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="var(--color-secondary)"
                    strokeDasharray="60, 100"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-plus-jakarta font-extrabold text-3xl text-secondary">
                  {data.uv.split(' ')[0]}
                </div>
              </div>
              <div>
                <p className="text-secondary font-extrabold text-xl">{data.uv.split(' ')[1]}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2 font-medium">
                  Use sunscreen from 11 AM to 4 PM when rays are strongest.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden clay-card-tactile h-full min-h-[240px] relative group">
            <div className="absolute top-6 left-8 z-10">
              <h3 className="font-plus-jakarta font-bold text-xl text-white">Rain Map</h3>
              <button className="text-primary text-xs font-bold hover:underline mt-1">Full View</button>
            </div>
            <img 
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
              alt="Rain Map"
            />
            <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeatherStat = ({ label, value }: { label: string, value: string }) => (
  <div className="text-center">
    <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1 font-bold">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className={className} />;
    case 'cloudy':
      return <Cloud className={className} />;
    case 'rainy':
      return <CloudRain className={className} />;
    case 'partly cloudy':
      return <CloudSun className={className} />;
    case 'night':
    case 'clear sky (night)':
      return <Moon className={className} />;
    default:
      return <CloudSun className={className} />;
  }
};
