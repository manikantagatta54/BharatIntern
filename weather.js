const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const forecastList = document.querySelector(".forecast-list");

const API_KEY = "237555f5e9860357c971e15574831518"; // My OpenWeatherMap API key

const createWeatherCard = (weatherItem, index) => {
    const iconCode = weatherItem.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

    return `
        <li class="forecast-item">
            <p class="date">${weatherItem.dt_txt.split(" ")[0]}</p>
            <div class="icon">
                <img src="${iconUrl}" alt="Weather Icon" onerror="this.onerror=null;this.src='https://via.placeholder.com/50?text=No+Image';">
            </div>
            <p class="temp">${(weatherItem.main.temp).toFixed(2)}°C</p>
            <p class="wind">Wind: ${weatherItem.wind.speed} M/S</p>
            <p class="humidity">Humidity: ${weatherItem.main.humidity}%</p>
        </li>
    `;
};

// Fetching Details 
const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            const uniqueForecastDays = [];
            const threeDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (uniqueForecastDays.length < 3 && !uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            // Clearing previous weather data
            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            forecastList.innerHTML = "";

            // Displaying current weather
            if (threeDaysForecast.length > 0) {
                const mainWeather = threeDaysForecast[0];
                const iconCode = mainWeather.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

                currentWeatherDiv.innerHTML = `
                    <h2>${cityName} (${mainWeather.dt_txt.split(" ")[0]})</h2>
                    <div class="weather-details">
                        <div class="weather-icon">
                            <img src="${iconUrl}" alt="Weather Icon" onerror="this.onerror=null;this.src='https://via.placeholder.com/80?text=No+Image';">
                        </div>
                        <div class="details">
                            <h3 class="temperature">${(mainWeather.main.temp).toFixed(2)}°C</h3>
                            <p class="description">${mainWeather.weather[0].description}</p>
                            <p class="wind">Wind: ${mainWeather.wind.speed} M/S</p>
                            <p class="humidity">Humidity: ${mainWeather.main.humidity}%</p>
                        </div>
                    </div>
                `;
            }

            // Creating and adding weather cards to the DOM
            threeDaysForecast.forEach((weatherItem, index) => {
                const html = createWeatherCard(weatherItem, index);
                forecastList.insertAdjacentHTML("beforeend", html);
            });
        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
};

// Coordinates of the forecast
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

// user's current location and fetch weather details
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    if (!data.length) return alert("No city found for your location");
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city name!");
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        }
    );
};

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
