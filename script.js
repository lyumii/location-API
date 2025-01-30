import { createClient } from "pexels";
const client = createClient(
  "z4Uya3d1JQCDBHUIO06mvA5bh1YrWExKwY65AMJx1eU3dL96bSPu9d0a"
);

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
  const apiKey = "3463a3654ba01dfc7b98e056105b25bd";
  const url = `https://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
  const weatherBox = document.getElementById("weather");

  weatherBox.innerHTML = "";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    if (data.current) {
      const temperature = data.current.temperature;
      const weatherDescription = data.current.weather_descriptions;
      const weatherIcon = data.current.weather_icons;
      const feelsLike = data.current.feelslike;
      const humidity = data.current.humidity;
      const wind = data.current.wind_speed;
      const precipitation = data.current.precip;

      const tempParagraph = document.createElement("p");
      tempParagraph.innerText = `Temperature: ${temperature}`;

      const weatherDescParagraph = document.createElement("p");
      weatherDescParagraph.innerText = `Weather desciption: ${weatherDescription}`;

      const weatherImg = document.createElement("img");
      weatherImg.src = weatherIcon;

      const feelsLikeParagraph = document.createElement("p");
      feelsLikeParagraph.innerText = `Feels like: ${feelsLike}`;

      const humidityParagraph = document.createElement("p");
      humidityParagraph.innerText = `Humidity: ${humidity}`;

      const windParagraph = document.createElement("p");
      windParagraph.innerText = `Wind Speed: ${wind}`;

      const precipParagraph = document.createElement("p");
      precipParagraph.innerText = `Precipitation: ${precipitation}`;

      const title = document.createElement("h2");
      title.innerText = `The Weather in ${city} today:`;

      weatherBox.appendChild(title);
      weatherBox.appendChild(tempParagraph);
      weatherBox.appendChild(weatherDescParagraph);
      weatherBox.appendChild(weatherImg);
      weatherBox.appendChild(feelsLikeParagraph);
      weatherBox.appendChild(humidityParagraph);
      weatherBox.appendChild(windParagraph);
      weatherBox.appendChild(precipParagraph);
    } else {
      weatherBox.textContent = `Nope`;
    }
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
    poiTitle.innerText = `Points of Interest in ${city}`;
    attractionsBox.appendChild(poiTitle);

    for (const poi of pois.features) {
      if (poi.properties && poi.properties.formatted) {
        const poiElement = document.createElement("div");
        poiElement.innerHTML = `
        <h3>${poi.properties.formatted}</h3>
        <p><a href="${
          poi.website ||
          `https://en.wikipedia.org/wiki/${encodeURIComponent(
            poi.properties.name
          )}`
        }" target="_blank">Visit website</a></p>
        <hr>
        `;
        attractionsBox.appendChild(poiElement);
      }
    }

    console.log(pois);
  } catch (error) {
    console.log(`error`, error);
  }
}

async function fetchPOIs(lat, lng) {
  const apiKey = "6adab50e4f9f4421aabb4643494054aa";
  const url = `https://api.geoapify.com/v2/places?categories=tourism&limit=10&apiKey=${apiKey}&lat=${lat}&lon=${lng}`;

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
  const query = city;
  const imgBox = document.getElementById("imgs");

  try {
    const response = await client.photos.search({ query, per_page: 3 });
    imgBox.innerHTML = response.photos
      .map((pic) => {
        return `<img src="${pic.src.medium}">`;
      })
      .join("");
  } catch (error) {
    console.log(`error`, error);
  }
}
