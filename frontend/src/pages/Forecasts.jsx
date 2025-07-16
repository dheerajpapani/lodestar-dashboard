import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Forecasts() {
  const [city, setCity] = useState('Delhi');
  const [forecast, setForecast] = useState(null);
  const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_KEY;

  useEffect(() => {
    if (!city) return;

    const fetchForecast = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        if (data.cod === '200') {
          setForecast(data);
        } else {
          setForecast(null);
        }
      } catch (err) {
        console.error('Error fetching forecast:', err);
        setForecast(null);
      }
    };

    fetchForecast();
  }, [API_KEY, city]);

  return (
    <div className="forecast-wrapper">
      <header className="forecast-header">
        <h1>🌦️ 5-Day Forecast</h1>
        <select value={city} onChange={e => setCity(e.target.value)} className="city-dropdown">
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Chennai">Chennai</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bengaluru">Bengaluru</option>
        </select>
      </header>

      {forecast ? (
        <section className="forecast-grid">
          {forecast.list
            .filter((_, idx) => idx % 8 === 0)
            .map(item => (
              <div className="forecast-card" key={item.dt}>
                <h4>{new Date(item.dt_txt).toLocaleDateString()}</h4>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].description}
                />
                <p className="desc">{item.weather[0].main}</p>
                <p className="temp">{Math.round(item.main.temp)}°C</p>
              </div>
            ))}
        </section>
      ) : (
        <p className="no-data">No forecast available.</p>
      )}

      <div className="back-link">
        <Link to="/" className="link-btn">🏠 Back to Home</Link>
      </div>
    </div>
  );
}
