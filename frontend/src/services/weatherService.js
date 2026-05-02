// src/services/weatherService.js

// Format Date as YYYY-MM-DD
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Compute start and end dates
const getDates = () => {
  const today = new Date();
  
  const pastEnd = new Date(today);
  pastEnd.setDate(today.getDate() - 1);
  
  const pastStart = new Date(today);
  pastStart.setDate(today.getDate() - 6);

  const futureStart = new Date(today);
  futureStart.setDate(today.getDate() + 1);

  const futureEnd = new Date(today);
  futureEnd.setDate(today.getDate() + 6);

  return {
    todayStr: formatDate(today),
    pastStartStr: formatDate(pastStart),
    pastEndStr: formatDate(pastEnd),
    // The forecast API can just use forecast_days=8 to get today + next 7 days,
    // but to be explicit with the requirements, we'll use start_date and end_date
    futureStartStr: formatDate(futureStart),
    futureEndStr: formatDate(futureEnd)
  };
};

// Aggregate hourly data into daily
// hourly data format from open-meteo:
// { time: ["2026-05-02T00:00", ...], temperature_2m: [25, ...], relative_humidity_2m: [80, ...], precipitation: [0, ...] }
const aggregateDaily = (hourlyData) => {
  const dailyMap = {};

  for (let i = 0; i < hourlyData.time.length; i++) {
    const datetime = hourlyData.time[i];
    const date = datetime.split('T')[0]; // Extract YYYY-MM-DD

    if (!dailyMap[date]) {
      dailyMap[date] = {
        tempSum: 0,
        humiditySum: 0,
        precipSum: 0,
        count: 0
      };
    }

    // Handle possible null values from API
    const temp = hourlyData.temperature_2m[i] || 0;
    const humidity = hourlyData.relative_humidity_2m[i] || 0;
    const precip = hourlyData.precipitation[i] || 0;

    dailyMap[date].tempSum += temp;
    dailyMap[date].humiditySum += humidity;
    dailyMap[date].precipSum += precip;
    dailyMap[date].count += 1;
  }

  // Convert map to array and compute averages
  const result = Object.keys(dailyMap).map(date => {
    const entry = dailyMap[date];
    return {
      day: date,
      temp: parseFloat((entry.tempSum / entry.count).toFixed(1)),
      humidity: Math.round(entry.humiditySum / entry.count),
      precipitation: parseFloat(entry.precipSum.toFixed(2)) // sum for precipitation
    };
  });

  // Sort by date ascending
  result.sort((a, b) => a.day.localeCompare(b.day));
  
  return result;
};

export const fetchWeatherData = async (siteName, lat, lon) => {
  const { todayStr, pastStartStr, pastEndStr, futureStartStr, futureEndStr } = getDates();
  
  const cacheKey = `weather_${siteName}_${todayStr}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsedCache = JSON.parse(cached);
      console.log(`[WeatherService] Serving cached data for ${siteName} (${todayStr})`);
      return parsedCache;
    } catch (e) {
      console.warn("Invalid cache data, clearing and fetching fresh.");
      localStorage.removeItem(cacheKey);
    }
  }

  console.log(`[WeatherService] Fetching fresh API data for ${siteName}`);

  // Fetch past 7 days (historical)
  const historyUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${pastStartStr}&end_date=${pastEndStr}&hourly=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`;
  
  // Fetch forecast (today + next 7 days)
  // We'll fetch from today to futureEndStr so we can extract 'today' and 'future' easily
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${todayStr}&end_date=${futureEndStr}&hourly=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`;

  try {
    const [historyRes, forecastRes] = await Promise.all([
      fetch(historyUrl),
      fetch(forecastUrl)
    ]);

    if (!historyRes.ok || !forecastRes.ok) {
      throw new Error(`Failed to fetch weather data: ${historyRes.status} ${forecastRes.status}`);
    }

    const historyData = await historyRes.json();
    const forecastData = await forecastRes.json();

    const pastDaily = aggregateDaily(historyData.hourly);
    const forecastDailyAll = aggregateDaily(forecastData.hourly);

    // Extract today's data and future data
    const todayData = forecastDailyAll.find(d => d.day === todayStr) || { temp: 'N/A', precipitation: 'N/A', humidity: 'N/A' };
    const futureDaily = forecastDailyAll.filter(d => d.day >= futureStartStr && d.day <= futureEndStr);

    const result = {
      today: todayData,
      past7Days: pastDaily,
      future7Days: futureDaily
    };

    // Save to cache. Optional: clear old cache entries to save space.
    // For simplicity, we just set the new cache key for today.
    localStorage.setItem(cacheKey, JSON.stringify(result));

    return result;

  } catch (error) {
    console.error(`[WeatherService] Error fetching data for ${siteName}:`, error);
    throw error;
  }
};
