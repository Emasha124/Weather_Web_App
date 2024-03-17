const apiKey = "6f4c3b9854c54936849155251240603";
const apiUrl = "https://api.weatherapi.com/v1/current.json?q=";




//----------------------------------------------search--------------------------------------------------------->


const searchBox = document.querySelector(".location");
const searchBtn = document.querySelector(".search-button");
const weatherIcon = document.querySelector(".icon");



searchBtn.addEventListener("click", async () => {

    const city = searchBox.value.trim(); 
    if (city) {
        await checkWeather(city);
    } else {
        
        alert("Please enter a city.");
    }
    

});


async function checkWeather(city) {

    
        const response = await fetch(`${apiUrl}${city}&key=${apiKey}`);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();

        console.log(data);

        document.getElementById("location").innerHTML = data.location.name + " , " + data.location.country;
        document.getElementById("date").innerHTML = data.location.localtime;
        document.getElementById("current-temp").innerHTML = data.current.temp_c + "°C";
        document.getElementById("summary").innerHTML = data.current.condition.text;
        if (data.current) {
            document.getElementById("Location").innerHTML = data.location.name;
            document.getElementById("Temperature").innerHTML = data.current.temp_c + "°C";
            document.getElementById("Humidity").innerHTML = data.current.humidity;
            document.getElementById("Condition").innerHTML = data.current.condition.text;
            document.getElementById("Region").innerHTML = data.location.region;
            document.getElementById("Wind Speed").innerHTML = data.current.wind_kph + " kmph";
           
        } else {
            throw new Error("Weather data for the current time is unavailable");
        }






        //weatherIcon.src = `http:${data.current.condition.icon}`;



    }
    




    



//----------------------------------------------------------------------------time hour by hour--------------------------------------------------------------------------->


fetchFutureForecast("colombo");
function fetchFutureForecast(location) {
    const startDate = new Date();
    let currentDay = new Date(startDate);
    const timeIncrement = 1.5; 

    for (let i = 0; i < 7; i++) {
        const formattedDate = currentDay.toISOString().split('T')[0];

        
        currentDay.setHours(currentDay.getHours() + timeIncrement);
        const formattedTime = currentDay.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 


        fetch(`https://api.weatherapi.com/v1/forecast.json?key=6f4c3b9854c54936849155251240603&q=${location}&days=1&aqi=no&alerts=no&dt=${formattedDate}&time=${formattedTime}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`hour${i + 1}`).innerHTML = formattedTime;
                document.getElementById(`img${i + 1}`).src = `https:${data.forecast.forecastday[0].hour[0].condition.icon}`;
                document.getElementById(`temp${i + 1}`).innerHTML = `${data.forecast.forecastday[0].hour[0].temp_c} °C`;

            })
            .catch(error => console.error('Error fetching future forecast:', error));

        currentDay.setDate(currentDay.getDate() + 1);
    }
}

//------------------------------------------------------------future 3 days---------------------------------------------

fetchFutureForecastDays("Galle");
function fetchFutureForecastDays(location) {
    const startDate = new Date();

    for (let i = 0; i < 3; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(currentDay.getDate() + i);
        const formattedDate = currentDay.toISOString().split('T')[0];
        console.log(formattedDate);

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=6f4c3b9854c54936849155251240603 &q=${location}&days=10&aqi=yes&alerts=yes&dt=${formattedDate}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById(`date2${i+1}`).innerHTML = formattedDate;
                document.getElementById(`condition2${i+1}`).innerHTML = `${data.forecast.forecastday[0].day.condition.text}`;
                document.getElementById(`temperature2${i+1}`).innerHTML = `${data.forecast.forecastday[0].day.avgtemp_c} °C`;
                document.getElementById(`humidity2${i+1}`).innerHTML = `${data.forecast.forecastday[0].day.avghumidity} %`;
                document.getElementById(`windSpeed2${i+1}`).innerHTML = `${data.forecast.forecastday[0].day.maxwind_kph} kmph`;
                document.getElementById(`region2${i+1}`).innerHTML = `${data.location.region}`;
            })
        // .catch(error => console.error('Error fetching future forecast:', error));
    }
}


//---------------------------------------------------past 7 days-------------------------------------------
fetchPastForecastDays("Galle");
function fetchPastForecastDays(location) {
    const startDate = new Date();

    for (let i = 7; i > 0; i--) {
        const currentDay = new Date(startDate);
        currentDay.setDate(currentDay.getDate() - i);

        const formattedDate = currentDay.toLocaleDateString();

        fetch(`https://api.weatherapi.com/v1/history.json?key=6f4c3b9854c54936849155251240603&q=${location}&dt=${formattedDate}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`Date${i}`).innerHTML = formattedDate;
                document.getElementById(`Condition${i}`).innerHTML = `${data.forecast.forecastday[0].day.condition.text}`;
                document.getElementById(`Temperature${i}`).innerHTML = `${data.forecast.forecastday[0].day.avgtemp_c} °C`;
                document.getElementById(`Humidity${i}`).innerHTML = `${data.forecast.forecastday[0].day.avghumidity} %`;
                document.getElementById(`Wind Speed${i}`).innerHTML = `${data.forecast.forecastday[0].day.maxwind_kph} kmph`;
                document.getElementById(`Region${i}`).innerHTML = `${data.location.region}`;
            })
            .catch(error => console.error('Error fetching future forecast:', error));
    }
}

//---------------------------------------------------------------switch---------------------------------------------------------------------



        const darkModeSwitch = document.getElementById('darkModeSwitch');
        const bodyElement = document.body;
    
        
        // Initial check for checkbox state and set background color accordingly
        let isDarkMode = darkModeSwitch.checked; // Get initial checkbox state
        bodyElement.classList.toggle('dark-mode', isDarkMode); // Apply dark mode class if checked initially
        
        darkModeSwitch.addEventListener('change', function() {
          bodyElement.classList.toggle('dark-mode');
        });
     
        


//-------------------------------------------------------------MAP-----------------------------------------------------

let map; // Declare a variable to hold the map instance

function initializeMap(latitude, longitude, pin) {
    if (!map) {
        map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        map.setView([latitude, longitude], 13);
    }

    // Add a marker to the map
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`Location: ${pin}`)
        .openPopup();
}

// Event listener for search button
document.getElementById("search-btn").addEventListener("click", async () => {
    try {
        const searchVal = document.getElementById("location-input").value;
        const { latitude, longitude } = await fetchLocationData(searchVal);
        initializeMap(latitude, longitude, searchVal);
    } catch (error) {
        console.error('Error during fetch:', error);
        // Handle errors
    }
});

async function currentMap(currentLocation) {
    try {
        const { latitude, longitude } = await fetchLocationData(currentLocation);
        initializeMap(latitude, longitude, currentLocation);
    } catch (error) {
        console.error('Error during fetch:', error);
        // Handle errors
    }
}

async function fetchLocationData(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=6f4c3b9854c54936849155251240603&q=${location}&days=7`);
        const data = await response.json();
        return { latitude: data.location.lat, longitude: data.location.lon };
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

        