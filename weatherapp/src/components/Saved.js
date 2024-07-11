import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SavedFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null); // Track which city's details are selected
  const API_KEY = process.env.REACT_APP_API_KEY;
  useEffect(() => {
    const storedFavorites = localStorage.getItem('weatherAppFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter(favorite => favorite.id !== id);
    localStorage.setItem('weatherAppFavorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);

    // If the removed city is the one with details shown, hide details
    if (selectedCity && selectedCity.id === id) {
      setSelectedCity(null);
    }
  };

  const fetchWeatherDetails = (id) => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${API_KEY}&units=metric`)
      .then(response => {
        setSelectedCity(response.data);
      })
      .catch(error => {
        console.error('Error fetching weather details:', error);
      });
  };

  const toggleWeatherDetails = (id) => {
    if (selectedCity && selectedCity.id === id) {
      setSelectedCity(null); // Collapse details if already expanded
    } else {
      fetchWeatherDetails(id); // Fetch and expand details of the clicked city
    }
  };

  return (
    <div className="saved-favorites">
      <h2>All Saved Cities</h2>
      {favorites.length === 0 ? (
        <p>No cities saved yet.</p>
      ) : (
        <ul className="favorite-item saved-item">
          {favorites.map(favorite => (
            <div className='saved-cities' key={favorite.id}>
              <li className='list-item' onClick={() => toggleWeatherDetails(favorite.id)}>
              <div>
                <svg className='location-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"/></svg>
                {favorite.name}, {favorite.country}
              </div>
                
                <button className="delete-button" onClick={(e) => { e.stopPropagation(); removeFromFavorites(favorite.id); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                </button>
              </li>
              {selectedCity && selectedCity.id === favorite.id && (
                <div className="weather-details">
                  <div>
                    <p className='place-name'><b>{favorite.name}</b></p>
                    <p><b>Temperature:</b> {selectedCity.main.temp}°C</p>
                    <p><b>Description:</b> {selectedCity.weather[0].description}</p>
                    <p><b>Humidity:</b> {selectedCity.main.humidity}%</p>
                  </div>
                </div>
              )}
              {/* <hr className="separator" /> */}
            </div>
          ))}
        </ul>
      )}
      <Link to="/" className="back-home-button"><svg className='home-button' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg> Back to Home</Link>
    </div>
  );
};

export default SavedFavorites;
