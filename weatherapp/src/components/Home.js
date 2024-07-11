import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [previouslyViewed, setPreviouslyViewed] = useState([]);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('weatherAppFavorites')) || [];
    setFavorites(storedFavorites);

    const storedPreviouslyViewed = JSON.parse(localStorage.getItem('weatherAppPreviouslyViewed')) || [];
    setPreviouslyViewed(storedPreviouslyViewed);
  }, []);

  useEffect(() => {
    if (weatherData) {
      const newPreviouslyViewed = {
        id: weatherData.id,
        name: weatherData.name,
        country: weatherData.sys.country,
        temp: weatherData.main.temp,
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity
      };

      // Avoid duplicates in previously viewed
      const updatedPreviouslyViewed = [newPreviouslyViewed, ...previouslyViewed.filter(city => city.id !== newPreviouslyViewed.id)];
      localStorage.setItem('weatherAppPreviouslyViewed', JSON.stringify(updatedPreviouslyViewed.slice(0, 5))); // Store up to 5 previously viewed cities
      setPreviouslyViewed(updatedPreviouslyViewed.slice(0, 5));
    }
  }, [weatherData]);

  const fetchWeatherData = (cityName) => {
    setError(null);
    axios.get(`${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`)
      .then(response => {
        if (response.data.cod === 200) {
          setWeatherData(response.data);
        } 
        else {
          setError(`City '${cityName}' not found`);
          setWeatherData(null);
        }
      })
      .catch(error => {
        setError('City not found');
        setWeatherData(null);
      });
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const addToFavorites = () => {
    if (weatherData) {
      const isAlreadyFavorite = favorites.some(favorite => favorite.id === weatherData.id);
      if (!isAlreadyFavorite) {
        const newFavorite = {
          id: weatherData.id,
          name: weatherData.name,
          country: weatherData.sys.country
        };
        const updatedFavorites = [newFavorite, ...favorites];
        localStorage.setItem('weatherAppFavorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
      } else {
        setError(`City '${weatherData.name}' is already saved.`);
      }
    }
  };

  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter(favorite => favorite.id !== id);
    localStorage.setItem('weatherAppFavorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const handleFavoriteClick = (favorite) => {
    fetchWeatherData(favorite.name);
  };

  return (
    <div className="home">
      <div className="top-section">
        <button className='saved-items-button'>
          <Link to="/saved">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"/></svg>
            <span className="favorite-count">{favorites.length}</span>
          </Link>
        </button>
        <img className="logo" src="https://i.pinimg.com/736x/62/ac/89/62ac8960e2c0acc1d62eec7bd0cdf80b.jpg" alt="logo" />
        <div className="search-container">
          <input type="text" className="search-box" value={city} onChange={handleInputChange} placeholder="Search the location..." />
          <button className='search-button' onClick={() => fetchWeatherData(city)}>
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="main-section">
        <div className="sidebar">
          <Link to="/saved" className='sidebar-icons'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"/></svg>
          </Link>
          <Link to="/viewed" className='sidebar-icons'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
          </Link>
        </div>
        <div className="content-section">
          <div className="top-content-section">
            <div className="weather-result">
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {weatherData && (
                <div>
                  <h3>{weatherData.name}, {weatherData.sys.country}</h3>
                  <p>Temperature: {weatherData.main.temp}°C</p>
                  <p>Description: {weatherData.weather[0].description}</p>
                  <p>Humidity: {weatherData.main.humidity}%</p>
                  <button className='save-button' onClick={addToFavorites}>Save the location</button>
                </div>
              )}
            </div>
            <div className="top-locations">
              <h3 className='favorites-heading'>Saved Cities</h3>
              {favorites.length === 0 ? (
                <p>No cities saved yet.</p>
              ) : (
                <ul className='favorite-item'>
                  {favorites.slice(0, 3).map(favorite => (
                    <div key={favorite.id}>
                      <div className='item-container'>
                        <li className='favorite-list-item' onClick={() => handleFavoriteClick(favorite)}>{favorite.name}, {favorite.country}</li>
                        <button className='delete-button' onClick={() => removeFromFavorites(favorite.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg></button>
                      </div>
                      <hr className='separator' />
                    </div>
                  ))}
                </ul>
              )}
              {favorites.length > 3 && (
                <Link to="/saved" className="view-all-saved-cities">View more</Link>
              )}
            </div>
          </div>

          <div className='bottom-content-section'>
            <div className='previously-viewed'>
              <h3 className='favorites-heading'>Previously viewed</h3>
              {previouslyViewed.length === 0 ? (
                <p className='empty-list'>No previously viewed cities.</p>
              ) : (
                <div>
                  <h4>{previouslyViewed[0].name}, {previouslyViewed[0].country}</h4>
                  <p>Temperature: {previouslyViewed[0].temp}°C</p>
                </div>
              )}
              <Link to="/viewed" className="view-all-saved-cities">View more</Link>
            </div>
            <div className='weather-image'>
              <img className='w-image' src='https://images.pexels.com/photos/1643793/pexels-photo-1643793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt="Weather" />
              <img className='w-image' src='https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt="Weather" />
              <img className='w-image' src='https://images.pexels.com/photos/936548/pexels-photo-936548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'/>
              <img className='w-image' src='https://images.pexels.com/photos/52531/way-clouds-seat-belts-direction-52531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt="Weather" />
              <p className='image-text'>Find the Weather</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;




