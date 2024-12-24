import React from "react";
import "./WeatherWidget.css";

const weatherIcons = {
  "01d": "https://openweathermap.org/img/wn/01d@2x.png", // Clear Sky Day
  "01n": "https://openweathermap.org/img/wn/01n@2x.png", // Clear Sky Night
  "02d": "https://openweathermap.org/img/wn/02d@2x.png", // Few Clouds Day
  "02n": "https://openweathermap.org/img/wn/02n@2x.png", // Few Clouds Night
  "03d": "https://openweathermap.org/img/wn/03d@2x.png", // Scattered Clouds
  "04d": "https://openweathermap.org/img/wn/04d@2x.png", // Broken Clouds
  "09d": "https://openweathermap.org/img/wn/09d@2x.png", // Shower Rain
  "10d": "https://openweathermap.org/img/wn/10d@2x.png", // Rain Day
  "11d": "https://openweathermap.org/img/wn/11d@2x.png", // Thunderstorm
  "13d": "https://openweathermap.org/img/wn/13d@2x.png", // Snow
  "50d": "https://openweathermap.org/img/wn/50d@2x.png", // Mist
};

function WeatherWidget({ weather }) {
  const iconCode = weather ? weather.weather[0].icon : null; // Get the primary weather condition code
  const iconUrl = iconCode ? weatherIcons[iconCode] : null; // Get the corresponding icon URL

  return (
    <div className="weather-widget">
      {weather ? (
        <>
          <div className="weather-widget-header">
            <h3>{weather.name}</h3>
          </div>
          <div className="weather-widget-body">
            <div className="temperature">
              <span className="current-temp">{weather.main.temp}°</span>
              <span className="unit">C</span>
            </div>
            <div className="weather-icon">
              {iconUrl && <img src={iconUrl} alt="Weather Icon" />}
            </div>
            <p className="weather-condition">{weather.weather[0].description}</p>
            <p className="min-max">
              H: {weather.main.temp_max}° L: {weather.main.temp_min}°
            </p>
          </div>
        </>
      ) : (
        <p>Loading weather details...</p>
      )}
    </div>
  );
}

export default WeatherWidget;