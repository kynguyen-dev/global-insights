
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
  Thermometer,
  Gauge,
  MapPin,
  ChevronRight,
  CloudDrizzle
} from 'lucide-react';
import { useWeather } from '../hooks/useDashboardData';
import { cn } from '../lib/utils';

export const WeatherPage = () => {
  const { data, loading, error } = useWeather();

  if (error && !data.hourlyForecast.length) {
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

  const uvParts = data.uv.split(' ');
  const uvValue = parseInt(uvParts[0]) || 0;
  const uvLabel = uvParts.slice(1).join(' ') || 'Low';
  const uvPercentage = Math.min((uvValue / 11) * 100, 100);

  return (
    <div className={cn("space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700", loading && "opacity-70 transition-opacity")}>
      {/* === ROW 1: Hero + Side Stats === */}
      <div className="grid grid-cols-12 gap-6">
        {/* Hero Weather Card */}
        <div className="col-span-12 lg:col-span-8 weather-gradient rounded-[2rem] p-8 text-white flex flex-col justify-between min-h-[340px] relative overflow-hidden shadow-clay-card border border-white/20">
          {/* Decorative orbs */}
          <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 opacity-70" />
                <span className="text-sm font-semibold opacity-70 uppercase tracking-widest">{data.city}</span>
              </div>
              <h1 className="text-4xl font-plus-jakarta font-extrabold tracking-tight">{data.condition}</h1>
              <p className="text-sm opacity-80 mt-1 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <WeatherIcon condition={data.condition} className="w-20 h-20 text-white/90 drop-shadow-lg" />
            </div>
          </div>
          
          <div className="relative z-10 flex items-end justify-between mt-auto">
            <div className="flex items-baseline gap-1">
              <span className="text-8xl font-plus-jakarta font-extrabold leading-none tracking-tighter">{data.temp}°</span>
              <span className="text-3xl font-plus-jakarta opacity-50 font-bold">C</span>
            </div>
            <div className="flex gap-6 items-end">
              <HeroStat label="Feels Like" value={`${data.feelsLike}°`} />
              <HeroStat label="Wind" value={data.wind} />
              <HeroStat label="Humidity" value={data.humidity} />
              <HeroStat label="Visibility" value={data.visibility || '10 mi'} />
            </div>
          </div>
        </div>

        {/* Right Column: Air Quality + Sunrise/Sunset + Quick Stats */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {/* Air Quality */}
          <div className="neu-flat p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-plus-jakarta font-bold text-base dark:text-white">Air Quality</h3>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                (data.airQuality?.index || 42) <= 50
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              )}>
                {data.airQuality?.label || 'Good'}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-4xl font-plus-jakarta font-extrabold text-primary">{data.airQuality?.index || 42}</div>
              <div className="flex-1">
                <div className="h-2 bg-surface-dim dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000 rounded-full" 
                    style={{ width: `${data.airQuality?.index || 42}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                  {data.airQuality?.description || 'Air quality is satisfactory.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sunrise / Sunset */}
          <div className="neu-flat p-5 flex items-center gap-4">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <Sunrise className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Sunrise</p>
                  <p className="text-sm font-bold dark:text-white">{data.sunrise}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <Sunset className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Sunset</p>
                  <p className="text-sm font-bold dark:text-white">{data.sunset}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <MiniStat icon={Thermometer} label="Dew Point" value={`${data.dewPoint}°C`} color="text-cyan-600" bg="bg-cyan-100 dark:bg-cyan-900/30" />
            <MiniStat icon={Gauge} label="Pressure" value={data.pressure} color="text-violet-600" bg="bg-violet-100 dark:bg-violet-900/30" />
          </div>
        </div>
      </div>

      {/* === ROW 2: 24-Hour Forecast === */}
      <div className="neu-flat p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-plus-jakarta font-bold text-lg dark:text-white">24-Hour Forecast</h2>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Updated just now</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {data.hourlyForecast?.map((item: any, index: number) => (
            <div 
              key={index}
              className={cn(
                "min-w-[100px] rounded-2xl p-4 flex flex-col items-center gap-2.5 transition-all duration-300 flex-shrink-0 cursor-default",
                index === 0
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                  : "bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 border border-transparent hover:border-white/30"
              )}
            >
              <p className={cn("text-[11px] font-bold", index === 0 ? "opacity-80" : "text-slate-400")}>{item.time}</p>
              <WeatherIcon condition={item.condition} className={cn("w-7 h-7", index === 0 ? "" : "text-primary")} />
              <p className="text-lg font-plus-jakarta font-bold">{item.temp}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* === ROW 3: 7-Day + UV + Rain Map === */}
      <div className="grid grid-cols-12 gap-6">
        {/* 7-Day Forecast */}
        <div className="col-span-12 lg:col-span-7 neu-flat p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-plus-jakarta font-bold text-lg dark:text-white">7-Day Outlook</h2>
            <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
              Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            {data.dailyForecast?.map((item: any, index: number) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3.5 px-5 bg-surface-container-low dark:bg-slate-800/50 rounded-xl hover:bg-surface-container-high dark:hover:bg-slate-700 transition-all duration-300 group"
              >
                <span className="w-24 font-bold text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{item.day}</span>
                <div className="flex items-center gap-3 flex-1 justify-center">
                  <WeatherIcon condition={item.condition} className="w-5 h-5 text-primary" />
                  <div className="flex items-center gap-1.5">
                    <CloudDrizzle className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-medium text-slate-400">{item.chance}</span>
                  </div>
                </div>
                {/* Temp bar visual */}
                <div className="flex items-center gap-3 w-40">
                  <span className="text-xs text-slate-400 w-8 text-right">{item.tempLow}°</span>
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute inset-y-0 bg-gradient-to-r from-blue-400 via-primary to-amber-400 rounded-full"
                      style={{
                        left: `${((item.tempLow - 20) / 20) * 100}%`,
                        right: `${100 - ((item.tempHigh - 20) / 20) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold dark:text-white w-8">{item.tempHigh}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: UV Index + Rain Map */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* UV Index */}
          <div className="neu-flat p-6 relative overflow-hidden">
            <h3 className="font-plus-jakarta font-bold text-base mb-5 dark:text-white">UV Index</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-100 dark:text-slate-700"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--color-secondary)"
                    strokeDasharray={`${uvPercentage}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-plus-jakarta font-extrabold text-2xl text-secondary">
                  {uvValue}
                </div>
              </div>
              <div>
                <p className="text-secondary font-extrabold text-lg">{uvLabel}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                  Use sunscreen from 11 AM to 4 PM when UV rays are strongest.
                </p>
                {/* UV Scale */}
                <div className="flex gap-0.5 mt-3">
                  {[1,2,3,4,5,6,7,8,9,10,11].map(i => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all",
                        i <= uvValue
                          ? i <= 2 ? "bg-green-400" : i <= 5 ? "bg-yellow-400" : i <= 7 ? "bg-orange-400" : i <= 10 ? "bg-red-400" : "bg-purple-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-slate-400">Low</span>
                  <span className="text-[9px] text-slate-400">Extreme</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rain Map */}
          <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-clay-card h-[280px] relative group cursor-pointer">
            <div className="absolute top-5 left-6 z-10">
              <h3 className="font-plus-jakarta font-bold text-base text-white">Precipitation Map</h3>
              <p className="text-primary text-[11px] font-bold mt-0.5">Live radar • {data.city}</p>
            </div>
            <img 
              className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
              alt="Rain Map"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between z-10">
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-[10px] text-white/70 font-medium">Light</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-[10px] text-white/70 font-medium">Moderate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] text-white/70 font-medium">Heavy</span>
                </div>
              </div>
              <button className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">
                Full View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === ROW 4: Atmosphere Details === */}
      <div className="grid grid-cols-3 gap-4">
        <AtmosphereCard 
          icon={Wind} 
          label="Wind Speed" 
          value={data.wind} 
          sub="NNW direction"
          color="text-sky-600" 
          bg="bg-sky-100 dark:bg-sky-900/30" 
        />
        <AtmosphereCard 
          icon={Droplets} 
          label="Humidity" 
          value={data.humidity} 
          sub={`Dew point: ${data.dewPoint}°C`}
          color="text-teal-600" 
          bg="bg-teal-100 dark:bg-teal-900/30" 
        />
        <AtmosphereCard 
          icon={Eye} 
          label="Visibility" 
          value={data.visibility || '10 mi'} 
          sub="Clear conditions"
          color="text-indigo-600" 
          bg="bg-indigo-100 dark:bg-indigo-900/30" 
        />
      </div>
    </div>
  );
};

/* ── Helper Components ── */

const HeroStat = ({ label, value }: { label: string, value: string }) => (
  <div className="text-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
    <p className="text-[9px] uppercase tracking-widest opacity-60 font-bold">{label}</p>
    <p className="text-base font-bold mt-0.5">{value}</p>
  </div>
);

const MiniStat = ({ icon: Icon, label, value, color, bg }: { icon: any, label: string, value: string, color: string, bg: string }) => (
  <div className="neu-flat p-4 flex items-center gap-3">
    <div className={cn("p-2.5 rounded-xl", bg)}>
      <Icon className={cn("w-5 h-5", color)} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold truncate">{label}</p>
      <p className="text-sm font-bold dark:text-white truncate">{value}</p>
    </div>
  </div>
);

const AtmosphereCard = ({ icon: Icon, label, value, sub, color, bg }: { icon: any, label: string, value: string, sub: string, color: string, bg: string }) => (
  <div className="neu-flat p-5 flex flex-col items-center text-center gap-3">
    <div className={cn("p-3 rounded-xl", bg)}>
      <Icon className={cn("w-6 h-6", color)} />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{label}</p>
      <p className="text-lg font-bold dark:text-white mt-0.5">{value}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
    </div>
  </div>
);

const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
  switch (condition?.toLowerCase()) {
    case 'sunny':
    case 'clear':
    case 'mostly clear':
      return <Sun className={className} />;
    case 'cloudy':
    case 'clouds':
      return <Cloud className={className} />;
    case 'rainy':
    case 'rain':
    case 'rain showers':
    case 'freezing rain':
      return <CloudRain className={className} />;
    case 'drizzle':
    case 'freezing drizzle':
      return <CloudDrizzle className={className} />;
    case 'partly cloudy':
      return <CloudSun className={className} />;
    case 'thunderstorm':
      return <CloudRain className={className} />;
    case 'foggy':
      return <Cloud className={className} />;
    case 'snowy':
    case 'snow showers':
      return <Cloud className={className} />;
    case 'night':
    case 'clear sky (night)':
      return <Moon className={className} />;
    default:
      return <CloudSun className={className} />;
  }
};
