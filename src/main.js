let apiKey = "7746bdeabca928cfedcad71e52fd9d66";
/**
 * current day and time
 */
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDay = days[now.getDay()];

function showTime(count) {
  if (count < 10) {
    count = `0${count}`;
    return count;
  } else {
    return count;
  }
}

let hours = showTime(now.getHours());
let minutes = showTime(now.getMinutes());
document.querySelector("#day").innerHTML = currentDay;

document.querySelector("#time").innerHTML = `${hours}:${minutes}`;

/** city search */

function changeWeather(response) {
  let temp = response.data.main.temp;
  let tempMax = response.data.main.temp_max;
  let tempMin = response.data.main.temp_min;
  let description = response.data.weather[0].description;
  let wind = response.data.wind.speed;
  let humidity = response.data.main.humidity;
  currentTemp.innerHTML = roundTemp(temp);
  todayTempMax.innerHTML = roundTemp(tempMax);
  todayTempMin.innerHTML = roundTemp(tempMin);
  todayDescription.innerHTML = description;
  todayHumidity.innerHTML = humidity;
  todayWind.innerHTML = Math.round(wind);
}
function changecity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#searchInput");
  let currentCity = document.querySelector("#currentCity");

  if (searchInput.value) {
    currentCity.innerHTML = searchInput.value;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&&units=metric`;
    axios.get(url).then(changeWeather);
  }
}
let searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", changecity);

/**Current Location */
function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocationWeather);
}
function currentLocationWeather(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&&units=metric`;
  axios.get(url).then(function (response) {
    changeWeather(response);
    let name = response.data.name;
    currentCity.innerHTML = name;
    searchInput.value = null;
  });
}
let currentLocationButton = document.querySelector("#currentLocationButton");
currentLocationButton.addEventListener("click", getLocation);

/**Measures */

let currentMeasure = document.querySelector("#currentMeasure");
let changeMeasure = document.querySelector("#changeMeasure");
let currentTemp = document.querySelector("#currentTemp");
let todayTempMax = document.querySelector("#today-max");
let todayTempMin = document.querySelector("#today-min");
let todayDescription = document.querySelector("#today-description");
let todayWind = document.querySelector("#today-wind");
let todayHumidity = document.querySelector("#today-humidity");

function changeMeasures() {
  let measureForChange = currentMeasure.innerHTML;
  currentMeasure.innerHTML = changeMeasure.innerHTML;
  changeMeasure.innerHTML = measureForChange;
}
function roundTemp(temp) {
  temp = Math.round(temp);
  if (temp > 0) {
    temp = `+${Math.round(temp)}`;
  }
  return temp;
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
  if (currentMeasure.innerHTML.toString().trim() === "°F") {
    currentTemp.innerHTML = convertToCels(parseInt(currentTemp.innerHTML));
    todayTempMax.innerHTML = convertToCels(parseInt(todayTempMax.innerHTML));
    todayTempMin.innerHTML = convertToCels(parseInt(todayTempMin.innerHTML));
  } else {
    currentTemp.innerHTML = convertToFar(parseInt(currentTemp.innerHTML));
    todayTempMax.innerHTML = convertToFar(parseInt(todayTempMax.innerHTML));
    todayTempMin.innerHTML = convertToFar(parseInt(todayTempMin.innerHTML));
  }
}
changeMeasure.addEventListener("click", function () {
  changeMeasures();
  changeTemp();
});
