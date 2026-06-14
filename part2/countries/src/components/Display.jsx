import { useState, useEffect } from "react";
import axios from "axios";

const CountryDisplay = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_KEY;
  const capital = country.capital ? country.capital[0] : null;

  useEffect(() => {
    if (!capital || !apiKey) return;

    const countryCode = country.cca2;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          capital,
        )},${countryCode}&units=metric&appid=${apiKey}`,
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) =>
        console.error("Error retrieving weather analytics:", error),
      );
  }, [capital, apiKey, country.cca2]);

  const languages = country.languages ? Object.values(country.languages) : [];

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital: {capital || "N/A"}</div>
      <div>area: {country.area} km²</div>

      <h3>Languages:</h3>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <img
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          style={{
            width: "150px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      {weather ? (
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #eee",
            paddingTop: "10px",
          }}
        >
          <h3>Weather in {capital}</h3>
          <div>
            <strong>temperature:</strong> {weather.main.temp} °C
          </div>
          <div>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          </div>
          <div>
            <strong>wind:</strong> {weather.wind.speed} m/s
          </div>
        </div>
      ) : (
        capital && (
          <p style={{ color: "#666", fontSize: "14px" }}>
            Loading local weather updates...
          </p>
        )
      )}
    </div>
  );
};

export default CountryDisplay;
