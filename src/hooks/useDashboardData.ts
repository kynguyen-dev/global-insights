import { useState, useEffect, useCallback } from 'react';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export const useWeather = () => {
  const [city, setCityState] = useState(() => {
    return localStorage.getItem('defaultCity') || "Ho Chi Minh City";
  });
  
  const [data, setData] = useState({
    temp: 32,
    city: city,
    condition: "Partly Cloudy",
    humidity: "74%",
    wind: "12 km/h",
    pressure: "1012 hPa",
    uv: "9 High"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCity = useCallback((newCity: string) => {
    setCityState(newCity);
    localStorage.setItem('defaultCity', newCity);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweathermap_api_key_here') {
        console.warn("OpenWeather API key not found. Using mock data.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        
        if (!response.ok) throw new Error('City not found');
        
        const weatherData = await response.json();
        setData({
          temp: Math.round(weatherData.main.temp),
          city: weatherData.name,
          condition: weatherData.weather[0].main,
          humidity: `${weatherData.main.humidity}%`,
          wind: `${Math.round(weatherData.wind.speed * 3.6)} km/h`,
          pressure: `${weatherData.main.pressure} hPa`,
          uv: "6 Moderate", // UV index mock
          visibility: "10 mi",
          sunrise: "07:14 AM",
          sunset: "06:22 PM",
          airQuality: {
            index: 42,
            label: "Good",
            description: "Air quality is considered satisfactory, and air pollution poses little or no risk."
          },
          hourlyForecast: [
            { time: "Now", temp: Math.round(weatherData.main.temp), condition: weatherData.weather[0].main },
            { time: "1 PM", temp: Math.round(weatherData.main.temp) + 2, condition: "Sunny" },
            { time: "2 PM", temp: Math.round(weatherData.main.temp) + 4, condition: "Sunny" },
            { time: "3 PM", temp: Math.round(weatherData.main.temp) + 3, condition: "Partly Cloudy" },
            { time: "4 PM", temp: Math.round(weatherData.main.temp) + 1, condition: "Cloudy" },
            { time: "5 PM", temp: Math.round(weatherData.main.temp) - 1, condition: "Cloudy" },
            { time: "6 PM", temp: Math.round(weatherData.main.temp) - 4, condition: "Clear" },
          ],
          dailyForecast: [
            { day: "Tomorrow", tempHigh: 30, tempLow: 24, condition: "Rainy", chance: "30%" },
            { day: "Wednesday", tempHigh: 32, tempLow: 26, condition: "Sunny", chance: "0%" },
            { day: "Thursday", tempHigh: 31, tempLow: 25, condition: "Cloudy", chance: "10%" },
            { day: "Friday", tempHigh: 34, tempLow: 26, condition: "Sunny", chance: "0%" },
          ]
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { data, loading, error, city, updateCity };
};

export const useMarkets = () => {
  const [signals] = useState([
    {
      id: 'gold',
      label: "Gold Price - SJC",
      value: "78.500.000đ",
      change: "-0.4%",
      isUp: false,
      lastUpdated: "5m ago"
    },
    {
      id: 'petrol',
      label: "Petrol RON 95-V",
      value: "23.910 VNĐ/lít",
      change: "+1.2%",
      isUp: true,
      lastUpdated: "Just now"
    }
  ]);

  return { signals };
};

export const useNews = () => {
  const [news, setNews] = useState([
    {
      id: 1,
      title: "Digital Currency Shifts Amidst Global Volatility Signals",
      description: "Investors are recalibrating portfolios as central banks signal potential rate adjustments in response to emerging economic markers.",
      author: "M. Thompson",
      readTime: "8 MIN READ",
      category: "Analysis",
      image: "https://images.unsplash.com/photo-1611974717484-2970fd604928?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      title: "Gold Reserves Hit 5-Year High in Emerging Asian Markets",
      description: "SJC prices fluctuate as regional demand for physical assets grows stronger amidst currency devaluations across the continent.",
      author: "L. Nguyen",
      readTime: "5 MIN READ",
      category: "Markets",
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      title: "Fuel Price Stabilization Policies Under Review for Q4",
      description: "New regulatory frameworks aim to mitigate the impact of global crude oil volatility on consumer RON 95-V pricing indices.",
      author: "D. Hayes",
      readTime: "12 MIN READ",
      category: "Energy",
      image: "https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=400"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!NEWS_API_KEY || NEWS_API_KEY === 'your_news_api_key_here') {
        console.warn("News API key not found. Using mock data.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=${NEWS_API_KEY}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch news');
        
        const data = await response.json();
        const mappedNews = data.articles.slice(0, 3).map((article: any, index: number) => ({
          id: index + 1,
          title: article.title,
          description: article.description || article.content,
          author: article.author || "Unknown",
          readTime: "5 MIN READ",
          category: "Business",
          image: article.urlToImage || "https://images.unsplash.com/photo-1611974717484-2970fd604928?auto=format&fit=crop&q=80&w=400"
        }));
        setNews(mappedNews);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading, error };
};
