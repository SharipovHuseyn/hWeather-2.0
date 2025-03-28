function getWeekDay(dateString) {
    let days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    let date = new Date(dateString.replace(" ", "T")); // Преобразуем в ISO-формат
    return days[date.getDay()];
}

function createForecastElement(date, icon, tempC, cloudiness, humidity, windSpeed) {
    if(!date, !icon, !tempC, !cloudiness, !humidity, !windSpeed) return

    const dayElement = document.createElement('div');
    dayElement.classList.add('day');

    const img = document.createElement('img');
    img.src = icon;

    const dayWeek = document.createElement('div');
    dayWeek.classList.add('day-week');
    dayWeek.textContent = getWeekDay(date);

    const degreeCelsius = document.createElement('div');
    degreeCelsius.classList.add('degree-celsius');
    degreeCelsius.textContent = tempC + " °C";

    const weatherData = document.createElement('div');
    weatherData.classList.add('weather-data');

    const cloudinessElement = document.createElement('p');
    cloudinessElement.textContent = `Облачность: ${cloudiness} %`;

    const humidityElement = document.createElement('p');
    humidityElement.textContent = `Влажность: ${humidity} %`;

    const windElement = document.createElement('p');
    windElement.textContent = `Ветер: ${windSpeed} км/ч`;

    weatherData.appendChild(cloudinessElement);
    weatherData.appendChild(humidityElement);
    weatherData.appendChild(windElement);

    dayElement.appendChild(img);
    dayElement.appendChild(dayWeek);
    dayElement.appendChild(degreeCelsius);
    dayElement.appendChild(weatherData);

    return dayElement;
}

function clearForecastContainer() {
    const forecastContainer = document.querySelector('.forecast-container');
    if (forecastContainer) {
        forecastContainer.innerHTML = '';
    }
}

function updateActiveTab(button) {
    const buttons = document.querySelectorAll('.forecast-tabs button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

async function getNowWeatherForecast(){
    console.log('Сейчас');
    const forecastInput = document.querySelector('.forecast-input input').value;
    const forecastContainer = document.querySelector('.forecast-container');
    
    if(!forecastInput){
        console.log('Input empty');
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=aff1633438a64fd194f172859230811&q=${forecastInput}&lang=ru`);

        if(!response.ok){
            console.log('Ошибка при запросе!');
            return;
        }
        
        const data = await response.json();
        document.querySelector('.chart-container').style.display = 'none';
        clearForecastContainer()
        addingToStorage(data.location.name)

        const today = data.location.localtime.split(' ')[0];
        const icon = data.current.condition.icon;
        const tempC = data.current.temp_c;
        const cloudiness = data.current.cloud
        const humidity = data.current.humidity
        const windSpeed = data.current.wind_kph

        activateTab('Сейчас'); 
        const newForecast = createForecastElement(today, icon, tempC, cloudiness, humidity, windSpeed);
        forecastContainer.appendChild(newForecast);

    } catch(err) {
        console.error(err);
    }
}

async function getTodayWeatherForecast(){
    console.log('Сегодня');
    const forecastInput = document.querySelector('.forecast-input input').value;
    const forecastContainer = document.querySelector('.forecast-container');

    if(!forecastInput){
        console.log('Input empty');
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=aff1633438a64fd194f172859230811&q=${forecastInput}&lang=ru`);

        if(!response.ok){
            console.log('Ошибка при запросе!');
            return;
        }
        
        const data = await response.json();
        addingToStorage(data.location.name)
        clearForecastContainer()
        chartWeather(data.forecast.forecastday)
        document.querySelector('.chart-container').style.display = 'block';

        const today = data.location.localtime.split(' ')[0];
        const icon = data.forecast.forecastday[0].day.condition.icon;
        const tempC = data.forecast.forecastday[0].day.maxtemp_c;
        const cloudiness = data.current.cloud
        const humidity = data.current.humidity
        const windSpeed = data.current.wind_kph

        activateTab('Сегодня'); 
        const newForecast = createForecastElement(today, icon, tempC, cloudiness, humidity, windSpeed);
        forecastContainer.appendChild(newForecast);

    } catch(err) {
        console.error(err);
    }
}

async function getTomorrowWeatherForecast(){
    console.log('Завтра');
    const forecastInput = document.querySelector('.forecast-input input').value;
    const forecastContainer = document.querySelector('.forecast-container');

    if(!forecastInput){
        console.log('Input empty');
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=aff1633438a64fd194f172859230811&q=${forecastInput}&days=2&lang=ru`);

        if(!response.ok){
            console.log('Ошибка при запросе!');
            return;
        }
        
        const data = await response.json();
        addingToStorage(data.location.name)
        clearForecastContainer()
        chartWeather([data.forecast.forecastday[1]])
        document.querySelector('.chart-container').style.display = 'block';

        const tomorrow = data.forecast.forecastday[1];
        const icon = tomorrow.day.condition.icon;
        const tempC = tomorrow.day.maxtemp_c;
        const cloudiness = data.current.cloud
        const humidity = data.current.humidity
        const windSpeed = data.current.wind_kph
        
        const newForecast = createForecastElement(tomorrow.date, icon, tempC, cloudiness, humidity, windSpeed);
        forecastContainer.appendChild(newForecast);

    } catch(err) {
        console.error(err);
    }
}

async function getThreeDayWeatherForecast(){
    console.log('След. 3 дня');
    const forecastInput = document.querySelector('.forecast-input input').value;
    const forecastContainer = document.querySelector('.forecast-container');

    if(!forecastInput){
        console.log('Input empty');
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=aff1633438a64fd194f172859230811&q=${forecastInput}&days=3&lang=ru`);

        if(!response.ok){
            console.log('Ошибка при запросе!');
            return;
        }
        
        const data = await response.json();
        addingToStorage(data.location.name)
        clearForecastContainer()
        chartWeather(data.forecast.forecastday)
        document.querySelector('.chart-container').style.display = 'block';

        data.forecast.forecastday.forEach(dayData => {
            const icon = dayData.day.condition.icon;
            const tempC = dayData.day.maxtemp_c;
            const cloudiness = dayData.day.avgvis_km;
            const humidity = dayData.day.avghumidity;
            const windSpeed = dayData.day.maxwind_kph;

            const newForecast = createForecastElement(dayData.date, icon, tempC, cloudiness, humidity, windSpeed);
            forecastContainer.appendChild(newForecast);
        });

    } catch(err) {
        console.error(err);
    }
}

document.querySelectorAll('.forecast-tabs button').forEach(button => {
    button.addEventListener('click', (event) => {
        updateActiveTab(event.target);

        if (event.target.textContent === "Сейчас") {
            getNowWeatherForecast();
        } else if (event.target.textContent === "Сегодня") {
            getTodayWeatherForecast();
        } else if (event.target.textContent === "Завтра") {
            getTomorrowWeatherForecast();
        } else if (event.target.textContent === "След. 3 дня") {
            getThreeDayWeatherForecast();
        }
    });
});

function activateTab(tabName) {
    const buttons = document.querySelectorAll('.forecast-tabs .tab-button');
    buttons.forEach(button => {
        if (button.textContent === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function todayDate() {
    const forecastYear = document.querySelector('.forecast-date h2')
    const forecastWeek = document.querySelector('.forecast-date .sub-date')

    const now = new Date()
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    const days = [
        'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
    ];

    const currentDay = now.getDate()
    const currentMonth = months[now.getMonth()]
    const currentYear = now.getFullYear()
    const currentWeekday = days[now.getDay()]

    if (forecastYear) {
        forecastYear.textContent = `${currentMonth} ${currentYear}`;
    }

    if (forecastWeek) {
        forecastWeek.textContent = `${currentWeekday}, ${currentDay} ${currentMonth} ${currentYear}`;
    }
}

function updateSunTimes(sunrise, sunset) {
    function convertTo24Hour(time) {
        let [h, m, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
        h = period === "PM" && h !== "12" ? +h + 12 : h === "12" && period === "AM" ? 0 : +h;
        return [h, +m, `${h.toString().padStart(2, "0")}:${m.padStart(2, "0")}`];
    }

    function timeDiff(h, m) {
        const now = new Date(), target = new Date();
        target.setHours(h, m, 0);
        let diff = (target - now) / (1000 * 60), past = diff < 0;
        if (past) diff += 24 * 60;
        let hours = Math.floor(diff / 60), minutes = Math.round(diff % 60);
        return (past ? "Прошло " : "Через ") + hours + " ч. " + minutes + " мин.";
    }

    const [sH, sM, sText] = convertTo24Hour(sunrise);
    const [eH, eM, eText] = convertTo24Hour(sunset);

    document.querySelector(".sun-time p:nth-child(1)").innerHTML = `<img src="./assets/icons/sun.png" alt="sun"> ${sText} AM <span>${timeDiff(sH, sM)}</span>`;
    document.querySelector(".sun-time p:nth-child(2)").innerHTML = `<img src="./assets/icons/sunrise.png" alt="sunrise"> ${eText} PM <span>${timeDiff(eH, eM)}</span>`;
}

function formatDate(dateString) {
    const months = [
        'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 
        'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
    ];

    const daysOfWeek = [
        'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 
        'Четверг', 'Пятница', 'Суббота'
    ];

    const date = new Date(dateString.replace(" ", "T")); // Преобразуем строку в дату
    const today = new Date();
    
    let dayLabel = daysOfWeek[date.getDay()];
    if (date.toDateString() === today.toDateString()) {
        dayLabel = "Сегодня";
    }

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayLabel}, ${day} ${month} ${year}`;
}

async function getWeatherWithIP(){
    const ipResponse = await fetch('http://ip-api.com/json/');
    const ipData = await ipResponse.json();
    const city = ipData.city.replace(/'/g, "");

    if(!city){
        console.log('Нет айпишника!')
        return;
    }

    console.log(city)
    try{
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=aff1633438a64fd194f172859230811&q=${city}&lang=ru`)

        if(!response.ok){
            console.log('Ошибка при запросе!')
            return;
        }

        const data = await response.json()

        const location = document.querySelector('.location')
        const weatherInfo = document.querySelector('.weather-info')
        const details = document.querySelectorAll('.details p')
        const weatherImage = weatherInfo.querySelector('img')
        const weatherGradus = weatherInfo.querySelector('h1')
        const region = location.querySelector('h2 span')
        const imgFlag = location.querySelector('h2 .flag')
        const subDate = location.querySelector('.sub-date')

        if (!location || !weatherInfo || details.length < 3) {
            console.log('Ошибка: не найдены элементы на странице.');
            return;
        }

        region.textContent = data.location.name + ', ' + data.location.region
        weatherGradus.textContent = data.current.temp_c + '°C'
        weatherImage.src = data.current.condition.icon
        subDate.textContent = formatDate(data.location.localtime)
        details[0].innerHTML = `Облачность: <span>${data.current.cloud}%</span>`;
        details[1].innerHTML = `Влажность: <span>${data.current.humidity}%</span>`;
        details[2].innerHTML = `Ветер: <span>${data.current.wind_kph} км/ч</span>`;
        if(!ipData.countryCode) imgFlag.style = "display: none"
        imgFlag.src = `https://flagsapi.com/${ipData.countryCode}/flat/64.png`  

        const sunrise = data.forecast.forecastday[0].astro.sunrise;
        const sunset = data.forecast.forecastday[0].astro.sunset;
        updateSunTimes(sunrise, sunset);
        
    }catch(err){
        console.error(err)
    }
}

async function weatherStorage(){
    const citiesContainer = document.querySelector('.cities');
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let weatherHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    if (!weatherHistory || weatherHistory.length == 0) {
        const messEmpty = document.createElement('p');
        messEmpty.innerHTML = 'История пуста';
        sliderContainer.appendChild(messEmpty);
    }

    let currentIndex = 0;
    let loadedCities = {};

    function getVisibleCards() {
        return window.innerWidth <= 480 ? 1 : 2;
    }

    async function loadWeather(city) {
        if (loadedCities[city]) return loadedCities[city];

        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=aff1633438a64fd194f172859230811&q=${city}&lang=ru`);
            if (!response.ok) throw new Error("Ошибка загрузки");

            const data = await response.json();
            loadedCities[city] = data;
            return data;
        } catch (err) {
            console.error(`Ошибка загрузки ${city}:`, err);
            return null;
        }
    }

    async function updateSlider() {
        citiesContainer.innerHTML = '';
        const visibleCards = getVisibleCards();
        const citiesToShow = weatherHistory.slice(currentIndex, currentIndex + visibleCards);

        for (const city of citiesToShow) {
            const data = await loadWeather(city);
            if (!data) continue;

            const { temp_c, condition } = data.current;
            const { name } = data.location;

            const cityElement = document.createElement('div');
            cityElement.classList.add('city');
            cityElement.innerHTML = `
                <div class="city-info">
                    <span class="city-name">${name}</span>
                    <span class="city-weather">${condition.text}</span>
                </div>
                <div class="city-right">
                    <span class="city-temp">${temp_c}°</span>
                    <img src="https:${condition.icon}" alt="${condition.text}">
                </div>
            `;
            cityElement.onclick = () => historyInInput(name);
            citiesContainer.appendChild(cityElement);
            
            cityElement.querySelector('.city-name').addEventListener('click', () => historyInInput(name));
            
            setTimeout(() => {
                cityElement.classList.add('active');
            }, 100);
        }

        prevBtn.classList.toggle("hidden", currentIndex <= 0);
        nextBtn.classList.toggle("hidden", currentIndex + visibleCards >= weatherHistory.length);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex + getVisibleCards() < weatherHistory.length) {
            currentIndex += 1;
            updateSlider();
        }
    });

    window.addEventListener("resize", updateSlider);
    updateSlider();
}

function historyInInput(city){
    const forecastInput = document.querySelector('.forecast-input input');
    if(!city || !forecastInput) return

    forecastInput.value = city
    getTodayWeatherForecast()
}

window.onload = function () {
    todayDate()
    getWeatherWithIP()
    weatherStorage()
}