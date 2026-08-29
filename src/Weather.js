import React, { useState, useEffect } from 'react';
import "./index.css";
import cloud from "../src/image/Cloud.png";
import rain from "../src/image/Rain.png";
import clear from "../src/image/Clear.png";
import mist from "../src/image/mist.png";
import err from "../src/image/error.png";

const Weather = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "d0a0947c75bf2a6d1c56a35c207a6664";

  // Fetch default city weather on component load
  useEffect(() => {
    fetchWeatherByCity("Delhi");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeatherByCity = async (cityName) => {
    if (!cityName || !cityName.trim()) {
      setError("Please enter a city or country name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName.trim())}&appid=${API_KEY}&units=metric`
      );
      const jsonData = await response.json();

      if (jsonData.cod === "404" || response.status === 404) {
        setError("City not found. Please enter a valid city or country name.");
        setData(null);
      } else if (!response.ok) {
        setError(jsonData.message || "Failed to fetch weather data. Please try again.");
        setData(null);
      } else {
        setData(jsonData);
        setError("");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Network error. Please check your internet connection.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!search.trim()) {
      setError("Please enter a city or country name.");
      return;
    }
    fetchWeatherByCity(search);
  };

  // Helper function to return proper weather image
  const getWeatherImage = () => {
    if (!data || !data.weather || !data.weather[0]) return clear;
    const mainCondition = data.weather[0].main;
    const iconCode = data.weather[0].icon;

    switch (mainCondition) {
      case "Clouds":
        return cloud;
      case "Rain":
      case "Drizzle":
      case "Thunderstorm":
        return rain;
      case "Clear":
        return clear;
      case "Mist":
      case "Haze":
      case "Fog":
      case "Smoke":
      case "Dust":
        return mist;
      default:
        // OpenWeatherMap fallback high-res icon if custom local image is missing
        return iconCode ? `https://openweathermap.org/img/wn/${iconCode}@4x.png` : clear;
    }
  };

  return (
    <div className="bigcontainer">
      <div className="container">
        {/* Header / Brand */}
        <div className="appHeader">
          <h1 className="appTitle">Weather Forecast</h1>
          <p className="appSubtitle">Real-time climate details</p>
        </div>

        {/* Search Form */}
        <form className="inputs" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Enter city, Country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="City search input"
          />
          <button type="submit" aria-label="Search weather">
            <svg
              className="searchIcon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </form>

        {/* Weather Content Area */}
        <div className="contentArea">
          {/* Loading Spinner */}
          {loading && (
            <div className="loadingContainer">
              <div className="spinner"></div>
              <p>Fetching weather data...</p>
            </div>
          )}

          {/* Error Display */}
          {!loading && error && (
            <div className="errorPage">
              <img src={err} alt="Error" className="errorImg" />
              <p className="errorText">{error}</p>
            </div>
          )}

          {/* Weather Details Card */}
          {!loading && !error && data && data.weather && (
            <div className="weathers">
              <div className="locationInfo">
                <h2 className="cityName">{data.name}, {data.sys?.country}</h2>
                <span className="weatherBadge">{data.weather[0].main}</span>
              </div>

              <div className="mainWeatherVisual">
                <img
                  src={getWeatherImage()}
                  alt={data.weather[0].description}
                  className="weatherImg"
                />
                <div className="tempWrapper">
                  <h2 className="temperature">{Math.round(data.main.temp)}°C</h2>
                  <p className="climate">{data.weather[0].description}</p>
                </div>
              </div>

              {/* Grid of Weather Metrics */}
              <div className="metricsGrid">
                <div className="metricCard">
                  <div className="metricIcon">🌡️</div>
                  <div className="metricData">
                    <span className="metricValue">{Math.round(data.main.feels_like)}°C</span>
                    <span className="metricLabel">Feels Like</span>
                  </div>
                </div>

                <div className="metricCard">
                  <div className="metricIcon">💧</div>
                  <div className="metricData">
                    <span className="metricValue">{data.main.humidity}%</span>
                    <span className="metricLabel">Humidity</span>
                  </div>
                </div>

                <div className="metricCard">
                  <div className="metricIcon">💨</div>
                  <div className="metricData">
                    <span className="metricValue">{Math.round(data.wind.speed * 3.6)} km/h</span>
                    <span className="metricLabel">Wind Speed</span>
                  </div>
                </div>

                <div className="metricCard">
                  <div className="metricIcon">⏲️</div>
                  <div className="metricData">
                    <span className="metricValue">{data.main.pressure} hPa</span>
                    <span className="metricLabel">Pressure</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
