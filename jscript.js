const search_btn = document.querySelector("#search-btn");
const cityInput = document.querySelector("#search-city");
const notfoundSection = document.querySelector("#Not-found");
const searchcitySection = document.querySelector("#search-here");
const weatherInfoSection = document.querySelector("#weather-info");
const apiKey = "3061d1628b86bae5bfb513feac29bb4e";
const locationName = document.querySelector('#location-name');
const description = document.querySelector('#description');
const temperature = document.querySelector('#temp');
const humidityTxt = document.querySelector('#humidity');
const windTxt = document.querySelector('#wind');
const pressureTxt = document.querySelector('#pressure');
const visibilityTxt = document.querySelector('#visibility');
const weatherImage = document.querySelector('.weatherImage');
const dateTxt = document.querySelector("#current-date");
const forecastContainer = document.querySelector("#forecast");


search_btn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        console.log(cityInput.value)
        WeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        console.log(cityInput.value)
        WeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})
function getWeatherIcon(id) {
    console.log(id)
    if (id <= 232) return 'ThunderStrom2.webp'
    if (id <= 321) return 'drizzle.webp'
    if (id <= 531) return 'showerRain.webp'
    if (id <= 622) return 'snow.webp'
    if (id <= 781) return 'mist.webp'
    if (id == 800) return 'clearSky.webp'
    if (id == 801) return 'brokenCloud.webp'
    if (id <= 804) return 'fewcloud.webp'
    else return 'fewClouds.webp'
}
function getCurrentDate() {
    const currentDate = new Date()
    const option = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', option)
}
async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org./data/2.5/${endPoint}?q=${city}&appid=${apiKey}&unit=metric`;
    const response = await fetch(apiUrl)
    return response.json()
}
async function WeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)
    if (weatherData.cod != 200) {
        showData(notfoundSection)
        return
    }
    console.log(weatherData)
    const {
        name: country,
        main: { temp, humidity, pressure },
        weather: [{ id, main }],
        visibility: num,
        wind: { speed }
    } = weatherData
    locationName.textContent = country
    temperature.textContent = Math.round(temp - 273.15) + '°C'
    description.textContent = main
    humidityTxt.textContent = humidity + ' %'
    pressureTxt.textContent = pressure + ' hPa'
    windTxt.textContent = Math.round(speed)+ ' mps'
    visibilityTxt.textContent = (num / 1000) + ' km'
    dateTxt.textContent = getCurrentDate();
    weatherImage.src = `assets/${getWeatherIcon(id)}`
    await updateForecastInfo(city)
    showData(weatherInfoSection);
}
async function updateForecastInfo(city) {
    const forecastdata = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const today = new Date().toISOString().split('T')[0]
    console.log(today)
    forecastContainer.innerHTML = ''
    forecastdata.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(today)) {
            updateForecastItems(forecastWeather)
        }
    })
}
function updateForecastItems(weatherData) {
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{ id, main }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const options =  {
        day : '2-digit',
       month : 'short'
    }
    const resultdate = dateTaken.toLocaleDateString('en-US', options)
    const forecastItem = `
        <div
          class="forecast-container flex flex-col items-center min-w-20 bg-[#ffffff1a] rounded-xl hover:bg-[#00000026] p-1">
          <p class="text-sm">${resultdate}</p>
          <img src="assets/${getWeatherIcon(id)}" alt="img" class="w-16 h-16">
          <p>${main}</p>
          <p>${Math.round(temp - 272)}°C</p>
      </div>
     `
     forecastContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showData(section) {
    [weatherInfoSection, searchcitySection, notfoundSection]
        .forEach(section => section.style.display = 'none')
    section.style.display = 'block';
}
