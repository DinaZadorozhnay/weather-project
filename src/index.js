let weatherApiKey = "7746bdeabca928cfedcad71e52fd9d66";
let timeApiKey = "6XCJExCg6xl9Msle0jbAgg==RLPL7Ko2QBEMoXTz";

let changeMeasureButton = document.querySelector("#changeMeasure");
let currentLocationButton = document.querySelector("#currentLocationButton");
let searchFormElement = document.querySelector("#searchForm");

let celsTemp = null;
let todayTempMax = null;
let todayTempMin = null;

/**
ShowWeather and date, time functions
 */

function showWeather(response) {
  let currentTempElement = document.querySelector("#currentTemp");
  let todayTempMaxElement = document.querySelector("#today-max");
  let todayTempMinElement = document.querySelector("#today-min");
  let todayDescriptionElement = document.querySelector("#today-description");
  let todayWindElement = document.querySelector("#today-wind");
  let todayHumidityElement = document.querySelector("#today-humidity");
  let currentCityElement = document.querySelector("#currentCity");
  let currentIconElement = document.querySelector("#icon");
  celsTemp = response.data.main.temp;
  todayTempMax = response.data.main.temp_max;
  todayTempMin = response.data.main.temp_min;
  let description = response.data.weather[0].description;
  let wind = response.data.wind.speed;
  let humidity = response.data.main.humidity;
  let icon = response.data.weather[0].icon;
  currentCityElement.innerHTML = response.data.name;
  currentTempElement.innerHTML = roundTemp(celsTemp);
  todayTempMaxElement.innerHTML = roundTemp(todayTempMax);
  todayTempMinElement.innerHTML = roundTemp(todayTempMin);
  todayDescriptionElement.innerHTML = description;
  todayHumidityElement.innerHTML = humidity;
  todayWindElement.innerHTML = Math.round(wind);
  currentIconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${icon}@2x.png`
  );
  getForecast(response.data.coord);
}
function getForecast(coordinates) {
  let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={current,minutely,hourly,alerts}&appid=${weatherApiKey}&&units=metric`;
  axios.get(weatherUrl).then(showForecast);
}
function roundTemp(temp) {
  temp = Math.round(temp);
  if (temp > 0) {
    temp = `+${Math.round(temp)}`;
  }
  return temp;
}
function showDate(response) {
  let currentDateElement = document.querySelector("#date");
  let day = response.data.day_of_week;
  let hour = response.data.hour;
  let minute = response.data.minute;
  let currentDate = `${day}, ${hour}:${minute}`;
  currentDateElement.innerHTML = currentDate;
}
/**end of showWeather functions */

/**
 * changing measures
 */
function changeMeasures() {
  let currentMeasureElement = document.querySelector("#currentMeasure");
  let measureForChange = currentMeasureElement.innerHTML;
  currentMeasureElement.innerHTML = changeMeasureButton.innerHTML;
  changeMeasureButton.innerHTML = measureForChange;
}
function convertToFar(temp) {
  temp = temp * 1.8 + 32;
  return roundTemp(temp);
}
function changeTemp() {
  let currentMeasureElement = document.querySelector("#currentMeasure");
  let currentTempElement = document.querySelector("#currentTemp");
  let todayTempMaxElement = document.querySelector("#today-max");
  let todayTempMinElement = document.querySelector("#today-min");
  if (currentMeasureElement.innerHTML.toString().trim() === "°C") {
    currentTempElement.innerHTML = roundTemp(celsTemp);
    todayTempMaxElement.innerHTML = roundTemp(todayTempMax);
    todayTempMinElement.innerHTML = roundTemp(todayTempMin);
  } else {
    currentTempElement.innerHTML = convertToFar(
      parseInt(currentTempElement.innerHTML)
    );
    todayTempMaxElement.innerHTML = convertToFar(
      parseInt(todayTempMaxElement.innerHTML)
    );
    todayTempMinElement.innerHTML = convertToFar(
      parseInt(todayTempMinElement.innerHTML)
    );
  }
}
/**End of changing measures */
function showCity(city) {
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&&units=metric`;
  let timeUrl = `https://api.api-ninjas.com/v1/worldtime?city=${city}&&X-Api-Key=${timeApiKey}`;
  axios.get(weatherUrl).then(showWeather);
  axios
    .get(timeUrl, {
      headers: { "X-Api-Key": timeApiKey },
    })
    .then(showDate);
}
function changeCity(event) {
  let searchInputElement = document.querySelector("#searchInput");
  event.preventDefault();
  showCity(searchInputElement.value);
}

/**current location weather */
function showCurrentLocationWeather(event) {
  let searchInputElement = document.querySelector("#searchInput");
  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&&units=metric`;
    let timeUrl = `https://api.api-ninjas.com/v1/worldtime?`;

    axios.get(weatherUrl).then(showWeather);
    axios
      .get(timeUrl, {
        headers: { "X-Api-Key": timeApiKey },
        params: { lat: lat, lon: lon },
      })
      .then(showDate);
  });
  searchInputElement.value = null;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function showForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastTableElement = document.querySelector("#forecastTable");
  let forecastHTML = `<div class="row days">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col weatherTable">
                <div class="day">${formatDay(forecastDay.dt)}</div>
                <img src="https://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" class="tableIMG" alt="" width="50px" />

                <div class="labels">
                  <span class="label">MIN <span>${roundTemp(
                    forecastDay.temp.min
                  )}</span></span>
              <span class="label">MAX <span>${roundTemp(
                forecastDay.temp.max
              )}</span></span>
                </div>
                <ul class="weatherDetails">
                  <li class="description">${
                    forecastDay.weather[0].description
                  }</li>
                  <li>Wind <span class="wind">${Math.round(
                    forecastDay.wind_speed
                  )}</span> m/s</li>
                  <li>Humidity <span class="humidity">${
                    forecastDay.humidity
                  }</span>%</li>
                </ul>
              </div>
            `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastTableElement.innerHTML = forecastHTML;
}

currentLocationButton.addEventListener("click", showCurrentLocationWeather);

changeMeasureButton.addEventListener("click", function () {
  changeMeasures();
  changeTemp();
});

searchFormElement.addEventListener("submit", changeCity);

showCity("New York");
