const apiKey = "c3474b306e37ebb3f9cc43f3736a80d1";
    let darkMode = false;

    function toggleTheme() {
      document.body.classList.toggle("dark");
      darkMode = !darkMode;
    }

    function getWeather(city = null) {
      const inputCity = document.getElementById("cityInput").value.trim();
      const targetCity = city || inputCity;
      if (!targetCity) return;

      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${targetCity}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          updateUI(data);
          fetchForecast(data.coord.lat, data.coord.lon);
        })
        .catch(() => {
          document.getElementById("error").textContent = "City not found";
        });
    }

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
            .then(res => res.json())
            .then(data => {
              updateUI(data);
              fetchForecast(latitude, longitude);
            })
            .catch(() => {
              document.getElementById("error").textContent = "Unable to retrieve weather.";
            });
        }, () => {
          document.getElementById("error").textContent = "Geolocation access denied.";
        });
      } else {
        document.getElementById("error").textContent = "Geolocation is not supported.";
      }
    }

    function updateUI(data) {
      document.getElementById("error").textContent = "";
      document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
      document.getElementById("dateTime").textContent = new Date().toLocaleString();
      document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
      document.getElementById("description").textContent = data.weather[0].description;
      document.getElementById("details").innerHTML = `Feels like: ${Math.round(data.main.feels_like)}°C<br>Humidity: ${data.main.humidity}%<br>Wind: ${data.wind.speed} m/s`;
    }

    function fetchForecast(lat, lon) {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          const forecastContainer = document.getElementById("forecast");
          forecastContainer.innerHTML = "";
          const nextHours = data.list.slice(0, 6);
          nextHours.forEach(item => {
            const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temp = Math.round(item.main.temp);
            const icon = item.weather[0].icon;
            const div = document.createElement("div");
            div.classList.add("forecast-item");
            div.innerHTML = `<span>${time}</span><br><img src="https://openweathermap.org/img/wn/${icon}.png" width="40"><br><span>${temp}°C</span>`;
            forecastContainer.appendChild(div);
          });
        });
    }