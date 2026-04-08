// ── Open-Meteo API Service ──
// Free weather API — no API key required
// Docs: https://open-meteo.com/en/docs

// ── Types ──
export interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  timezone: string;
}

export interface WeatherData {
  temp: number;
  city: string;
  condition: string;
  humidity: string;
  wind: string;
  pressure: string;
  uv: string;
  visibility: string;
  sunrise: string;
  sunset: string;
  feelsLike: number;
  dewPoint: number;
  airQuality: { index: number; label: string; description: string };
  hourlyForecast: { time: string; temp: number; condition: string }[];
  dailyForecast: { day: string; tempHigh: number; tempLow: number; condition: string; chance: string }[];
}

// ── WMO Weather Code → Human-readable condition ──
const wmoCodeToCondition = (code: number): string => {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Freezing Drizzle";
  if (code >= 61 && code <= 65) return "Rainy";
  if (code >= 66 && code <= 67) return "Freezing Rain";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 85 && code <= 86) return "Snow Showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Clear";
};

const getUvLabel = (uv: number): string => {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
};

const getAqiLabel = (aqi: number): { label: string; description: string } => {
  if (aqi <= 50) return { label: "Good", description: "Air quality is satisfactory, and air pollution poses little or no risk." };
  if (aqi <= 100) return { label: "Moderate", description: "Air quality is acceptable. Some pollutants may be a concern for sensitive groups." };
  if (aqi <= 150) return { label: "Unhealthy (SG)", description: "Members of sensitive groups may experience health effects." };
  if (aqi <= 200) return { label: "Unhealthy", description: "Everyone may begin to experience health effects." };
  return { label: "Hazardous", description: "Health alert: everyone may experience serious health effects." };
};

const formatTime12h = (isoTime: string): string => {
  const date = new Date(isoTime);
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${min} ${ampm}`;
};

const getDayLabel = (isoDate: string, index: number): string => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// ── API Functions ──

export async function geocodeCity(cityName: string): Promise<GeoLocation> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
  );
  if (!res.ok) throw new Error('Geocoding service unavailable');
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${cityName}" not found`);
  }
  const r = data.results[0];
  return {
    latitude: r.latitude,
    longitude: r.longitude,
    name: r.name,
    country: r.country,
    timezone: r.timezone,
  };
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  // Step 1: Geocode
  const geo = await geocodeCity(city);

  // Step 2: Fetch weather + air quality in parallel
  const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
  weatherUrl.searchParams.set('latitude', String(geo.latitude));
  weatherUrl.searchParams.set('longitude', String(geo.longitude));
  weatherUrl.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,uv_index');
  weatherUrl.searchParams.set('hourly', 'temperature_2m,weather_code,dew_point_2m,visibility');
  weatherUrl.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max');
  weatherUrl.searchParams.set('timezone', geo.timezone || 'auto');
  weatherUrl.searchParams.set('forecast_days', '8');

  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${geo.latitude}&longitude=${geo.longitude}&current=us_aqi,pm2_5&timezone=${geo.timezone || 'auto'}`;

  const [weatherRes, aqRes] = await Promise.all([
    fetch(weatherUrl.toString()),
    fetch(aqUrl),
  ]);

  if (!weatherRes.ok) throw new Error('Weather data fetch failed');
  const w = await weatherRes.json();
  const aq = aqRes.ok ? await aqRes.json() : null;

  // ── Parse current ──
  const currentTemp = Math.round(w.current.temperature_2m);
  const currentCondition = wmoCodeToCondition(w.current.weather_code);
  const currentWind = Math.round(w.current.wind_speed_10m);
  const currentHumidity = w.current.relative_humidity_2m;
  const currentPressure = Math.round(w.current.surface_pressure);
  const currentFeelsLike = Math.round(w.current.apparent_temperature);

  // ── Hourly (next 8 hours from now) ──
  const now = new Date();
  const currentHour = now.getHours();
  const todayDate = w.hourly.time[0].split('T')[0];
  const startIndex = w.hourly.time.findIndex((t: string) => {
    const d = new Date(t);
    return d.getHours() >= currentHour && t.startsWith(todayDate);
  });
  const safeStart = startIndex >= 0 ? startIndex : 0;
  const hourlySlice = w.hourly.time.slice(safeStart, safeStart + 8);
  const hourlyForecast = hourlySlice.map((time: string, i: number) => {
    const idx = safeStart + i;
    return {
      time: i === 0 ? "Now" : formatTime12h(time).replace(':00 ', ' '),
      temp: Math.round(w.hourly.temperature_2m[idx]),
      condition: wmoCodeToCondition(w.hourly.weather_code[idx]),
    };
  });

  // Dew point & visibility from hourly
  const dewPoint = Math.round(w.hourly.dew_point_2m?.[safeStart] ?? currentTemp - 6);
  const visibilityM = w.hourly.visibility?.[safeStart] ?? 16000;
  const visibilityKm = Math.round(visibilityM / 1000);

  // ── Daily (skip today, next 7 days) ──
  const dailyForecast = w.daily.time.slice(1).map((date: string, i: number) => ({
    day: getDayLabel(date, i + 1),
    tempHigh: Math.round(w.daily.temperature_2m_max[i + 1]),
    tempLow: Math.round(w.daily.temperature_2m_min[i + 1]),
    condition: wmoCodeToCondition(w.daily.weather_code[i + 1]),
    chance: `${w.daily.precipitation_probability_max?.[i + 1] ?? 0}%`,
  }));

  // ── Sunrise/sunset (today) ──
  const sunrise = formatTime12h(w.daily.sunrise[0]);
  const sunset = formatTime12h(w.daily.sunset[0]);

  // ── Air quality ──
  const aqiIndex = aq?.current?.us_aqi ?? 42;
  const { label: aqiLabel, description: aqiDescription } = getAqiLabel(aqiIndex);

  // ── UV ──
  const maxUv = Math.round(w.daily.uv_index_max[0]);
  const maxUvLabel = getUvLabel(maxUv);

  return {
    temp: currentTemp,
    city: geo.name,
    condition: currentCondition,
    humidity: `${currentHumidity}%`,
    wind: `${currentWind} km/h`,
    pressure: `${currentPressure} hPa`,
    uv: `${maxUv} ${maxUvLabel}`,
    visibility: `${visibilityKm} km`,
    sunrise,
    sunset,
    feelsLike: currentFeelsLike,
    dewPoint,
    airQuality: { index: aqiIndex, label: aqiLabel, description: aqiDescription },
    hourlyForecast,
    dailyForecast,
  };
}
