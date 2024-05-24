let savedCity = JSON.parse(localStorage.getItem('city'));
const searchBtn = $('#search-btn');
const searchTag = $('#past-city');


// This function will save on localStorage the cities we looked for
function saveCity(cities){
  localStorage.setItem('city', JSON.stringify(cities));
};

// This will read from localStorage to see what cities have been looked, if it's empty it will return nothing
function readFromStorage(){
  // if the savedCity is empty it will return []
  if (!savedCity){
    savedCity = [];
  }
  return savedCity;
};

// This handle event is to save the cities looked for in the localStorage and will beggin the fetch to find the weather
function handleAddCities(event){
  event.preventDefault();
  const city = $('#search-city').val();
  // This will create the localStorage object
  const citiesSearched = {
    city: city
  }
  // Check if there is info stored in localStorage
  const savedCities = readFromStorage();
  // Add city into object
  savedCities.push(citiesSearched);
  // Save to localStorage
  saveCity(savedCities);
  // Fetch the latitude and longitude to fecth the weather info
  latNlot(city);
  // Render tags of past searched cities
  renderTags()
};

// This renders the weather in the HTML
function renderWeather(data){
  const futureForecast = $('#future-forecast');
  // Get the date of today
  const today = dayjs();
  const cityNday = $('#city');
  const symbolWeather = $('#symbol');
  const currentTemp = $('#temp');
  const currentWind = $('#wind');
  const currentHumidity = $('#humi');
  // check for the weather status and return the symbol of the weather
  const symbolsW = weathersymbol(data.current.weather[0].main);

  // Render current weather info and forecast
  // Append day format
  cityNday.append(` ${today.format('MMM D, YYYY')} `);
  // Append weather symbol
  symbolWeather.append(`${symbolsW}`);
  // Append temperature returned in Fahrenheit
  currentTemp.append(`${data.current.temp} °F`);
  // Append wind_speed in MPH
  currentWind.append(`${data.current.wind_speed} MPH`);
  // Append humidity in %
  currentHumidity.append(`${data.current.humidity} %`);  
  
  // This will iterate to find the forecast of 5 days
  for (let i=1; i<6; i++){
    // Check for the weather symbol and append it

    console.log(data.daily[i].weather.main);
    let weather = weathersymbol(data.daily[i].weather[0].main);
    let weathersym = $('<p>').append(` ${weather}`); 
    // This will return the day of the forecast 
    const day = dayjs.unix(data.daily[i].dt).format('dddd, MMMM D YYYY');
    let date = $('<p>').append(day);
    // Add the forecast of 5 days temperature, wind, and humidity
    let forecast = $('<div>').addClass('future-card');
    let temperature = $('<p>').append(`Temperature: ${data.daily[i].temp.day} °F`);
    let wind = $('<p>').append(`Wind: ${data.daily[i].wind_speed} MPH`);
    let humidity = $('<p>').append(`Humidity: ${data.daily[i].humidity} %`);
    // Add to the html the info
    forecast.append(date, weathersym, temperature, wind, humidity);
    futureForecast.append(forecast);
  }
  return futureForecast
};

// This renders the tags in the HTML
function renderTags(){
  const tags = $('#past-city');
  // empty tags div to return new tags
  tags.empty();
  const savedCities = readFromStorage();
  // Iterate on the saved cities to render each tag of the past cities, and append on the HTML
  for (let i=0; i<savedCities.length; i++){
    let tagsBtn = $('<button>').addClass('search-tag').text(savedCities[i].city);
    tags.append(tagsBtn);
  }
  return tags
}

// This checks the weather symbols and returns a symbol depending on the weather
function weathersymbol(data){
  if (data === 'Clear'){
    return "☀"
  } else if (data === 'Clouds') {
    return "⛅"
  } else if (data === 'Rain'){
    return "🌧"
  } else if (data === 'Snow'){
    return "❆"
  }
}
//----------------FETCH------------------------------
// This will return the latitude and longitude of the city
function latNlot(city){
  const searchCity = (city).replace(" ", "");
  const key1 = '3cc847a8b34559de906860d8ac32d016';
  const locationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=5&appid=${key1}`
  // Clear page to render new info
  clearPage();
  // Add city to the HTML
  $('#city').append(city);
  fetch(locationURL)
  .then(response => response.json())
  .then(data => {
    // GET latitude and longitude to enter on another fetch to get the weather
    let lat = data[0].lat;
    let lon = data[0].lon;
    weather(lat, lon);
  })
  .catch(error=>{
    console.error(`There was a problem with the fetch ${error}`);
  })
}

// This will return the temperature, wind, and humidity, the forecast for 5 days and render on screen
function weather(latitude, longitude){
  const key2 ='383a88c13eedddfc5da6282ef1da1f0c'
  const tempURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key2}`;
  console.log(tempURL)
  fetch(tempURL)
    .then(response=>response.json())
    .then(data=>{
      // Runs renderWeather function to render the date, temperature, wind, and humidity
      renderWeather(data);
      $('#search-city').val('');
    })
    .catch(error=>{
      console.error(error);
    })
}

// This function erase the data stored in the page
function clearPage(){
  $('#city').empty();
  $('#symbol').empty();
  $('#temp').empty();
  $('#wind').empty();
  $('#humi').empty();
  $('#future-forecast').empty();
}

searchBtn.on('click', handleAddCities);

searchTag.on('click', function(){
  const thisCity = document.activeElement.textContent;
  latNlot(thisCity);

})

// When initiate render tags to be visible in homepage
$(document).ready(function(){
  renderTags();
  
})