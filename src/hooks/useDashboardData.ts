import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData, type WeatherData } from '../services/weatherApi';
import { fetchNews as fetchNewsData } from '../services/newsApi';
import {
  fetchGoldPrices,
  formatVndPrice,
  formatPriceChange,
  getTimeAgo,
  type GoldData,
} from '../services/goldApi';
import {
  fetchPetrolPrice,
  formatPetrolPrice,
  formatPetrolChange,
  type PetrolPrice,
} from '../services/petrolApi';

// ── Default fallback data (shown while loading) ──
const DEFAULT_WEATHER: WeatherData = {
  temp: 0, city: "Loading...", condition: "Clear",
  humidity: "--%", wind: "-- km/h", pressure: "-- hPa", uv: "-- --",
  visibility: "-- km", sunrise: "--:-- AM", sunset: "--:-- PM",
  feelsLike: 0, dewPoint: 0,
  airQuality: { index: 0, label: "--", description: "Loading air quality data..." },
  hourlyForecast: [],
  dailyForecast: [],
};

// ── Weather Hook (TanStack Query) ──
export const useWeather = () => {
  const [city, setCityState] = useState(() => {
    return localStorage.getItem('defaultCity') || "Ho Chi Minh City";
  });

  const {
    data = DEFAULT_WEATHER,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<WeatherData, Error>({
    queryKey: ['weather', city],
    queryFn: () => fetchWeatherData(city),
    staleTime: 10 * 60 * 1000,  // 10 minutes (weather doesn't change rapidly)
    gcTime: 60 * 60 * 1000,     // Cache for 1 hour
    refetchInterval: 15 * 60 * 1000, // Auto-refresh every 15 minutes
    placeholderData: DEFAULT_WEATHER,
  });

  const updateCity = useCallback((newCity: string) => {
    setCityState(newCity);
    localStorage.setItem('defaultCity', newCity);
  }, []);

  return {
    data,
    loading,
    error: error?.message ?? null,
    city,
    updateCity,
    refetch,
  };
};

// ── Market Signal type ──
export interface MarketSignal {
  id: string;
  label: string;
  type?: string;
  value: string;
  change: string;
  isUp: boolean;
  lastUpdated: string;
}

// ── Markets Hook (Gold + Petrol = TanStack Query) ──
export const useMarkets = () => {
  // Gold query
  const {
    data: goldData,
    isLoading: goldLoading,
    error: goldError,
  } = useQuery<GoldData, Error>({
    queryKey: ['gold-prices'],
    queryFn: fetchGoldPrices,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Petrol query
  const {
    data: petrolData,
    isLoading: petrolLoading,
    error: petrolError,
  } = useQuery<PetrolPrice, Error>({
    queryKey: ['petrol-price'],
    queryFn: () => fetchPetrolPrice(),
    staleTime: 30 * 60 * 1000,        // 30 min (fuel price changes rarely)
    gcTime: 60 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });

  // Build gold signal
  const goldSignal: MarketSignal = goldData?.sjc
    ? {
        id: 'gold',
        label: 'Gold Price - SJC',
        type: goldData.sjc.name,
        value: formatVndPrice(goldData.sjc.sell),
        change: formatPriceChange(goldData.sjc.changeSell, goldData.sjc.sell),
        isUp: goldData.sjc.changeSell >= 0,
        lastUpdated: getTimeAgo(goldData.timestamp),
      }
    : {
        id: 'gold',
        label: 'Gold Price - SJC',
        value: goldLoading ? 'Loading...' : 'N/A',
        change: '0%',
        isUp: false,
        lastUpdated: goldLoading ? '...' : 'Error',
      };

  // Build petrol signal from real API data
  const petrolSignal: MarketSignal = petrolData
    ? {
        id: 'petrol',
        label: 'Petrol RON 95-V',
        type: petrolData.name,
        value: formatPetrolPrice(petrolData.price),
        change: formatPetrolChange(petrolData.percentChange),
        isUp: petrolData.percentChange >= 0,
        lastUpdated: new Date(petrolData.updatedAt).toLocaleDateString('vi-VN'),
      }
    : {
        id: 'petrol',
        label: 'Petrol RON 95-V',
        value: petrolLoading ? 'Loading...' : 'N/A',
        change: '0%',
        isUp: false,
        lastUpdated: petrolLoading ? '...' : 'Error',
      };

  const signals: MarketSignal[] = [goldSignal, petrolSignal];

  return {
    signals,
    loading: goldLoading || petrolLoading,
    goldError: goldError?.message ?? null,
    petrolError: petrolError?.message ?? null,
  };
};

// ── News Hook (TanStack Query) ──
export const useNews = () => {
  const {
    data: articles = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['news', 'All Stories'],
    queryFn: () => fetchNewsData('All Stories'),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    select: (data) => data.slice(0, 3).map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      author: a.author,
      readTime: a.readTime.toUpperCase(),
      category: a.category,
      image: a.image,
      url: a.url,
    })),
  });

  return { news: articles, loading, error: error?.message ?? null };
};
