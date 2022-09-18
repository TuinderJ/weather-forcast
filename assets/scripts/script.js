const openWeatherAPIKey = "ea6c8cd00aec5e85a67ae6194df79aac";

function getLatLonFromCity(e) {
  e.preventDefault();
  let city = document.getElementById("city-input").value.trim();
  let displayedForcast = [];
  fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${openWeatherAPIKey}`)
    .then(response => {
      if (response.status === 404) return alert("Sorry, something went wrong. Please check your spelling any try agian.");
      makeNewHistoryButton();
      return response.json();
    })
    .then(data => {
      if (data.status === 404) return;
      // console.log(data);
      for (let i = 0; i < data.list.length; i++) {
        let newForcast = {
          city: data.city.name,
          date: moment.unix(data.list[i].dt).format("M/D/YYYY"),
          hour: moment.unix(data.list[i].dt).format("H"),
          temp: data.list[i].main.temp,
          wind: data.list[i].wind.speed,
          humidity: data.list[i].main.humidity,
          icon: data.list[i].weather[0].icon,
        };
        displayedForcast.push(newForcast);
      }
      displayForcast(displayedForcast);
    })
    .catch();
}

function displayForcast(data) {
  console.log(data);
  console.log(data[0]);
  const current = document.getElementById("current");
  current.children[0].innerText = `${data[0].city} (${data[0].date})`;
  current.children[1].children[0].innerText = data[0].temp;
  current.children[2].children[0].innerText = data[0].wind;
  current.children[3].children[0].innerText = data[0].humidity;
  // current.children[3].children[0].innerText = data[0].uvIndex;

  const fiveDayContainer = document.getElementById("five-day-container");
  console.log(fiveDayContainer);
  let found = 0;
  for (let i = 0; i < data.length; i++) {
    const forcast = data[i];
    if (forcast.hour == 12) {
      fiveDayContainer.children[found].children[0].textContent = forcast.date;
      fiveDayContainer.children[found].children[2].children[0].textContent = forcast.temp;
      fiveDayContainer.children[found].children[3].children[0].textContent = forcast.wind;
      fiveDayContainer.children[found].children[4].children[0].textContent = forcast.humidity;
      found++;
    }
  }
}

function makeNewHistoryButton() {}

document.getElementById("search-button").addEventListener("click", getLatLonFromCity);
