const OPENWEATHER_API_KEY = "27b4b158168296b2ff8729ff230e99fa"; // <-- remplace par ta clé

export async function getCurrentWeather(city) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}` +
    `&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur météo");
  return res.json();
}

export async function getForecast(city) {
  const url =
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}` +
    `&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur prévisions");
  return res.json();
}


export async function getCurrentWeatherByCoords(lat, lon) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}` +
    `&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur météo coords");
  return res.json();
}

export async function getForecastByCoords(lat, lon) {
  const url =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}` +
    `&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur prévisions coords");
  return res.json();
}

export async function searchCities(query) {
  const url =
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Erreur recherche villes");

  return res.json();
}