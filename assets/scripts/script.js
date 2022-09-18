const openWeatherAPIKey = "ea6c8cd00aec5e85a67ae6194df79aac";

function getForcastDataFromHistory(e) {
  if (!e.target.matches("button")) return;
  getForcastData(e.target.textContent);
}

function search(e) {
  e.preventDefault();
  let city = document.getElementById("city-input").value.trim();
  if (city === "") return;
  getForcastData(city);
}

function getForcastData(city) {
  let displayedForcast = [];
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${openWeatherAPIKey}`)
    .then(response => {
      if (response.status === 404) return alert("Sorry, something went wrong. Please check your spelling any try agian.");
      return response.json();
    })
    .then(data => {
      if (data.status === 404) return;
      makeNewHistoryButton(data.city.name);
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
          iconDescription: data.list[i].weather[0].description,
        };
        displayedForcast.push(newForcast);
      }
      displayForcast(displayedForcast);
    })
    .catch();
}

function displayForcast(data) {
  // console.log(data);
  // console.log(data[0]);
  const current = document.getElementById("current");
  current.children[0].textContent = `${data[0].city} (${data[0].date}) `;
  const icon = document.createElement("img");
  icon.setAttribute("src", `https://openweathermap.org/img/wn/${data[0].icon}@2x.png`);
  icon.setAttribute("alt", data[0].iconDescription);
  icon.setAttribute("class", "icon");
  current.children[0].appendChild(icon);
  current.children[1].children[0].textContent = data[0].temp;
  current.children[2].children[0].textContent = data[0].wind;
  current.children[3].children[0].textContent = data[0].humidity;
  // current.children[3].children[0].textContent = data[0].uvIndex;

  const fiveDayContainer = document.getElementById("five-day-container");
  // console.log(fiveDayContainer);
  let found = 0;
  for (let i = 0; i < data.length; i++) {
    const forcast = data[i];
    if (forcast.hour == 12) {
      fiveDayContainer.children[found].children[0].textContent = forcast.date;
      fiveDayContainer.children[found].children[1].setAttribute("src", `https://openweathermap.org/img/wn/${forcast.icon}@2x.png`);
      fiveDayContainer.children[found].children[1].setAttribute("alt", forcast.iconDescription);
      fiveDayContainer.children[found].children[2].children[0].textContent = forcast.temp;
      fiveDayContainer.children[found].children[3].children[0].textContent = forcast.wind;
      fiveDayContainer.children[found].children[4].children[0].textContent = forcast.humidity;
      found++;
    }
  }
}

function makeNewHistoryButton(city) {
  let localHistory = [];
  if (localStorage.getItem("history") !== null) localHistory = JSON.parse(localStorage.getItem("history"));
  const history = document.getElementById("history");
  for (let i = 0; i < history.children.length; i++) {
    const button = history.children[i];
    if (button.textContent === city) return;
  }
  if (localHistory.length >= 8) {
    localHistory.pop();
    history.children[history.children.length - 1].remove();
  }
  localHistory.unshift(city);
  const newHistoryButton = document.createElement("button");
  newHistoryButton.textContent = city;
  history.prepend(newHistoryButton);
  localStorage.setItem("history", JSON.stringify(localHistory));
}

function loadHistory() {
  let localHistory = [];
  if (localStorage.getItem("history") !== null) localHistory = JSON.parse(localStorage.getItem("history"));
  const history = document.getElementById("history");
  for (let i = 0; i < localHistory.length; i++) {
    const city = localHistory[i];
    newButton = document.createElement("button");
    newButton.textContent = city;
    history.appendChild(newButton);
  }
}

document.getElementById("search-button").addEventListener("click", search);
document.getElementById("history").addEventListener("click", getForcastDataFromHistory);
loadHistory();
