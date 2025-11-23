
const API_KEY = "44dfa80df6382983c337c5ebd4256452";
const cityInput = document.getElementById("cityInput");
const btnWeather = document.getElementById("btnWeather");
const currentWeatherDiv = document.getElementById("currentWeather");
const forecastDiv = document.getElementById("forecast");


btnWeather.addEventListener("click", () => {
    const raw = cityInput.value.trim();

    if (!raw.includes(",")) {
        alert("Uzyj formatu: miasto,kraj (np. Szczecin,PL)");
        return;
    }
    let [city, country] = raw.split(",");
    city = city.trim();
    country = country.trim().toUpperCase();

    const query = `${city},${country}`;

    getCurrentWeather(query);
    getForecast(query);
});


function getCurrentWeather(query) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric&lang=pl`;

    console.log("zapytanie XHR (current weather):", url);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            console.log("XHR status:", xhr.status);
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);

                console.log("surowe dane JSON:", data);
                console.log("Miasto:", data.name);
                console.log("Kraj:", data.sys.country);

                displayCurrentWeather(data);
            } else {
                currentWeatherDiv.innerHTML = "<p>Błąd pobierania pogody.</p>";
            }
        }
    };
    xhr.send();
}

function displayCurrentWeather(data) {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("pl-PL");

    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    currentWeatherDiv.innerHTML = `
        <h2>Aktualna pogoda w: ${data.name}, ${data.sys.country}</h2>
        <img src="${iconUrl}" alt="Ikona pogody">
        <p><b>Godzina:</b> ${formattedTime}</p>
        <p><b>Temperatura:</b> ${data.main.temp}°C</p>
        <p><b>Odczuwalna:</b> ${data.main.feels_like}°C</p>
        <p><b>Wilgotność:</b> ${data.main.humidity}%</p>
        <p><b>Ciśnienie:</b> ${data.main.pressure} hPa</p>
        <p><b>Opis:</b> ${data.weather[0].description}</p>
    `;
}


function getForecast(query) {
    const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric&lang=pl`;

    console.log(" Wysyłam zapytanie Fetch (forecast):", url);

    fetch(url)
        .then(res => {
            console.log("Fetch status:", res.status);
            return res.json();
        })
        .then(data => {
            console.log("Forecast surowy JSON:", data);
            console.log("Miasto:", data.city.name);
            console.log(" Kraj:", data.city.country);

            displayForecast(data);
        })
        .catch(err => {
            forecastDiv.innerHTML = "<p>Błąd pobierania prognozy.</p>";
        });
}


function displayForecast(data) {
    forecastDiv.innerHTML = `<h2>Prognoza pogodowa (co 3h)</h2>`;

    data.list.forEach(entry => {
        const date = new Date(entry.dt * 1000);
        const icon = entry.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

        forecastDiv.innerHTML += `
            <div class="forecastBox">
                <p><b>${date.toLocaleString("pl-PL")}</b></p>
                <img src="${iconUrl}" alt="Ikona prognozy">
                <p class="temp">Temp: ${entry.main.temp}°C</p>
                <p>Wilgotność: ${entry.main.humidity}%</p>
                <p>Opis: ${entry.weather[0].description}</p>
            </div>
        `;
    });
}
