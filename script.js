const destinationInput = document.getElementById("destination");
const searchBtn = document.getElementById("search");
const clearBtn = document.getElementById("clear");

searchBtn.addEventListener("click", (event) => {
  let city = destinationInput.value;
  fetchAll(city);
});

destinationInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let city = destinationInput.value;
    fetchAll(city);
  }
});

async function fetchAll(city) {
  try {
    const promise1 = fetchImages(city);
    const promise2 = fetchWeather(city);
    const promise3 = fetchSights(city);
    const result = await Promise.all(promise1, promise2, promise3);
    return result;
  } catch (error) {
    console.log(`error`, error);
  }
}

async function fetchWeather(city) {
  const weatherArticle = document.getElementById("weather");
  const weatherBox = document.createElement("div");
  weatherArticle.appendChild(weatherBox);

  weatherBox.innerHTML = "";

  try {
    const { lat, lng } = await fetchCoords(city);
    const data = await fetchWeatherMap(lat, lng);

    const temperature = data.main.temp || `no information available`;
    const weatherDescription =
      data.weather[0]?.description || `no information available`;
    const weatherIcon = data.weather[0]?.icon || `.img/weather-icon.png`;
    const feelsLike = data.main.feels_like || `no information available`;
    const humidity = data.main.humidity || `no information available`;
    const wind = data.wind.speed || `no information available`;
    const precipitation = data.rain?.["1h"] || 0;

    const tempParagraph = document.createElement("p");
    tempParagraph.innerText = `Temperature: ${temperature}`;

    const weatherDescParagraph = document.createElement("p");
    weatherDescParagraph.innerText = `Weather desciption: ${weatherDescription}`;

    const weatherImg = document.createElement("img");
    weatherImg.src = weatherIcon
      ? `https://openweathermap.org/img/wn/${weatherIcon}.png`
      : "./img/weather-icon.png";

    const feelsLikeParagraph = document.createElement("p");
    feelsLikeParagraph.innerText = `Feels like: ${feelsLike}`;

    const humidityParagraph = document.createElement("p");
    humidityParagraph.innerText = `Humidity: ${humidity}`;

    const windParagraph = document.createElement("p");
    windParagraph.innerText = `Wind Speed: ${wind}`;

    const precipParagraph = document.createElement("p");
    precipParagraph.innerText = `Precipitation: ${precipitation}`;

    const title = document.createElement("h2");
    title.innerText = `The Weather in ${city} today: `;
    weatherArticle.appendChild(title);
    // title.appendChild(weatherImg);

    weatherBox.appendChild(tempParagraph);
    weatherBox.appendChild(weatherDescParagraph);
    weatherBox.appendChild(feelsLikeParagraph);
    weatherBox.appendChild(humidityParagraph);
    weatherBox.appendChild(windParagraph);
    weatherBox.appendChild(precipParagraph);
  } catch (err) {
    console.log(`Error`);
  } finally {
    console.log("complete");
  }
}

async function fetchSights(city) {
  const attractionsBox = document.getElementById("attractions");
  attractionsBox.innerHTML = "";
  try {
    const { lat, lng } = await fetchCoords(city);
    const pois = await fetchPOIs(lat, lng);

    const poiTitle = document.createElement("h2");
    poiTitle.innerText = `Points of Interest in ${city}:`;
    attractionsBox.appendChild(poiTitle);
    const attractionsDiv = document.createElement("div");
    attractionsBox.appendChild(attractionsDiv);

    for (const poi of pois.features) {
      if (poi.properties && poi.properties.formatted) {
        const poiElement = document.createElement("div");
        poiElement.innerHTML = `
        <h3>${poi.properties.formatted}
        <span><a href="${
          poi.website ||
          `https://en.wikipedia.org/wiki/${encodeURIComponent(
            poi.properties.name
          )}`
        }" target="_blank">Visit website</a></span></h3>
        `;
        attractionsDiv.appendChild(poiElement);
        const articleFlex = document.getElementById("articleflex");
        articleFlex.style.display = "flex";
      }
    }

    console.log(pois);
  } catch (error) {
    console.log(`error`, error);
  }
}

async function fetchPOIs(lat, lng) {
  const apiKey = "6adab50e4f9f4421aabb4643494054aa";
  const url = `https://api.geoapify.com/v2/places?categories=tourism&limit=10&apiKey=${apiKey}&lat=${lat}&lon=${lng}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log("didnt fetch");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.log(`error`, error);
  }
}

async function fetchWeatherMap(lat, lng) {
  const apiKey = "489f8ddbcbcd19b1065160145197ac03";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log("didnt fetch");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.log(`error`, error);
  }
}

async function fetchCoords(city) {
  const apiKey = "c9f4cfde86a74b3f81f496ef85c52936";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("didnt fetch");
    }
    const data = await response.json();
    const { lat, lng } = data.results[0].geometry;
    return { lat, lng };
  } catch (error) {
    console.log("error", error);
  }
}

async function fetchImages(city) {
  const apiKey = "z4Uya3d1JQCDBHUIO06mvA5bh1YrWExKwY65AMJx1eU3dL96bSPu9d0a";
  const query = city;
  const imgBox = document.getElementById("imgs");
  const url = `https://api.pexels.com/v1/search?query=${query}&per_page=3`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    const data = await response.json();

    imgBox.innerHTML = data.photos
      .map((pic) => {
        return `<img src="${pic.src.medium}" alt="${pic.alt}">`;
      })
      .join("");
    imgBox.style.display = "flex";
  } catch (error) {
    console.error(`Error fetching images:`, error);
  }
}
