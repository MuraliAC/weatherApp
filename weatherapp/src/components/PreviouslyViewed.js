// PreviouslyViewedCities.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PreviouslyViewedCities = () => {
  const [previouslyViewed, setPreviouslyViewed] = useState([]);
  const [weatherDetails, setWeatherDetails] = useState({});
  const [activeCity, setActiveCity] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  useEffect(() => {
    const storedPreviouslyViewed = JSON.parse(localStorage.getItem('weatherAppPreviouslyViewed')) || [];
    setPreviouslyViewed(storedPreviouslyViewed);
  }, []);

  const fetchWeatherDetails = (city) => {
    if (activeCity === city.id) {
      setActiveCity(null);
      setWeatherDetails({});
    } else {
      axios.get(`${API_URL}?id=${city.id}&appid=${API_KEY}&units=metric`)
        .then(response => {
          if (response.data.cod === 200) {
            setWeatherDetails({ ...weatherDetails, [city.id]: response.data });
            setActiveCity(city.id);
          } else {
            setError(`Weather details for ${city.name} not found`);
          }
        })
        .catch(error => {
          setError(`Weather details for ${city.name} not found`);
        });
    }
  };

  return (
    <div className="previously-viewed-cities">
      <h2>Previously Viewed Cities</h2>
      {previouslyViewed.length === 0 ? (
        <p>No cities viewed yet.</p>
      ) : (
        <ul className="favorite-item saved-item">
          {previouslyViewed.map(city => (
            <li key={city.id}>
              <div className="city-item">
                <Link className='prev-viewed' to="#" onClick={() => fetchWeatherDetails(city)}>
                  {city.name}, {city.country}
                </Link>
                {activeCity === city.id && weatherDetails[city.id] && (
                  <div className="weather-info">
                    <div>
                        <p><b>Temperature:</b> {weatherDetails[city.id].main.temp}°C</p>
                        <p><b>Description:</b> {weatherDetails[city.id].weather[0].description}</p>
                        <p><b>Humidity:</b> {weatherDetails[city.id].main.humidity}%</p>
                    </div>
                  </div>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <hr className='separator prev-separator' />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PreviouslyViewedCities;
