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

let currentCityElement = document.querySelector("#currentCity");
let currentIconElement = document.querySelector("#icon");
let searchFormElement = document.querySelector("#searchForm");

/**
ShowWeather and date, time functions
 */

function showWeather(response) {
  let temp = response.data.main.temp;
  let tempMax = response.data.main.temp_max;
  let tempMin = response.data.main.temp_min;
  let description = response.data.weather[0].description;
  let wind = response.data.wind.speed;
  let humidity = response.data.main.humidity;
  let icon = response.data.weather[0].icon;
  currentCityElement.innerHTML = response.data.name;
  currentTempElement.innerHTML = roundTemp(temp);
  todayTempMaxElement.innerHTML = roundTemp(tempMax);
  todayTempMinElement.innerHTML = roundTemp(tempMin);
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
function convertToCels(temp) {
  temp = temp * 1.8 + 32;
  return roundTemp(temp);
}
function convertToFar(temp) {
  temp = (temp - 32) / 1.8;
  return roundTemp(temp);
}
function changeTemp() {
  if (currentMeasureElement.innerHTML.toString().trim() === "°F") {
    currentTempElement.innerHTML = convertToCels(
      parseInt(currentTempElement.innerHTML)
    );
    todayTempMaxElement.innerHTML = convertToCels(
      parseInt(todayTempMaxElement.innerHTML)
    );
    todayTempMinElement.innerHTML = convertToCels(
      parseInt(todayTempMinElement.innerHTML)
    );
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
  let searchInputElement = document.querySelector("#searchInput");
  showCity(searchInputElement.value);
}

changeMeasureButton.addEventListener("click", function () {
  changeMeasures();
  changeTemp();
});

showCity("New York");
searchFormElement.addEventListener("submit", changeCity);
