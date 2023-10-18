let weatherApiKey = "7746bdeabca928cfedcad71e52fd9d66";
let timeApiKey = "6XCJExCg6xl9Msle0jbAgg==RLPL7Ko2QBEMoXTz";

let currentMeasureElement = document.querySelector("#currentMeasure");
let changeMeasureButton = document.querySelector("#changeMeasure");
let currentTempElement = document.querySelector("#currentTemp");
let todayTempMaxElement = document.querySelector("#today-max");
let todayTempMinElement = document.querySelector("#today-min");
let todayDescriptionElement = document.querySelector("#today-description");
let todayWindElement = document.querySelector("#today-wind");
let todayHumidityElement = document.querySelector("#today-humidity");
let currentDateElement = document.querySelector("#date");
let currentLocationButton = document.querySelector("#currentLocationButton");
let currentCityElement = document.querySelector("#currentCity");
let currentIconElement = document.querySelector("#icon");
let searchFormElement = document.querySelector("#searchForm");
let searchInputElement = document.querySelector("#searchInput");
let celsTemp = null;
let todayTempMax = null;
let todayTempMin = null;

/**
ShowWeather and date, time functions
 */

function showWeather(response) {
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
}
function roundTemp(temp) {
  temp = Math.round(temp);
  if (temp > 0) {
    temp = `+${Math.round(temp)}`;
  }
  return temp;
}
function showDate(response) {
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
  let measureForChange = currentMeasureElement.innerHTML;
  currentMeasureElement.innerHTML = changeMeasureButton.innerHTML;
  changeMeasureButton.innerHTML = measureForChange;
}
function convertToFar(temp) {
  temp = temp * 1.8 + 32;
  return roundTemp(temp);
}
function changeTemp() {
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
  event.preventDefault();
  showCity(searchInputElement.value);
}

/**current location weather */
function showCurrentLocationWeather(event) {
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

currentLocationButton.addEventListener("click", showCurrentLocationWeather);

changeMeasureButton.addEventListener("click", function () {
  changeMeasures();
  changeTemp();
});

searchFormElement.addEventListener("submit", changeCity);

showCity("New York");
