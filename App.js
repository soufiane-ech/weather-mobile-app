import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

import WeatherCard from "./src/components/WeatherCard";
import ForecastList from "./src/components/ForecastList";
import MapPicker from "./src/components/MapPicker";

import {
  getCurrentWeather,
  getForecast,
  getCurrentWeatherByCoords,
  getForecastByCoords,
  searchCities,
} from "./src/services/weather";

export default function App() {
  const [city, setCity] = useState("Agadir");
  const [loading, setLoading] = useState(false);

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const [error, setError] = useState("");

  // NEW: coords que la map doit viser après une recherche ville
  const [mapTarget, setMapTarget] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
    // ===== Fonction pour chercher les villes =====
  async function handleCityChange(text) {
  setCity(text);

  if (text.length < 2) {
    setSuggestions([]);
    return;
  }

  try {
    const results = await searchCities(text);
    setSuggestions(results);
  } catch (e) {
    setSuggestions([]);
  }
  }

  function hideSuggestions() {
    setSuggestions([]);
    setShowSuggestions(false);
  }


  // ===== Recherche météo par nom de ville =====
  async function searchWeather() {
    hideSuggestions();
    const trimmed = city.trim();
    if (!trimmed) {
      setError("Entrez une ville");
      return;
    }
    try {
      Keyboard.dismiss();
      setLoading(true);
      setError("");

      const current = await getCurrentWeather(trimmed);
      const forecastData = await getForecast(trimmed);

      setCurrentWeather({
        name: current.name,
        temp: current.main?.temp,
        description: current.weather?.[0]?.description || "",
      });

      setForecast((forecastData.list || []).slice(0, 5));

      // NEW: bouger la map vers la ville cherchée
      if (current?.coord?.lat && current?.coord?.lon) {
        setMapTarget({
          latitude: current.coord.lat,
          longitude: current.coord.lon,
        });
      }
    } catch (e) {
      setError("Ville introuvable ou problème réseau.");
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  // ===== Charger météo par coordonnées (clic sur map) =====
  async function loadWeatherFromCoords(latitude, longitude) {
    try {
      setLoading(true);
      setError("");

      const current = await getCurrentWeatherByCoords(latitude, longitude);
      const forecastData = await getForecastByCoords(latitude, longitude);

      setCurrentWeather({
        name: current.name,
        temp: current.main?.temp,
        description: current.weather?.[0]?.description || "",
      });

      setForecast((forecastData.list || []).slice(0, 5));

      // (optionnel mais logique) mettre la target sur le point cliqué
      setMapTarget({ latitude, longitude });
    } catch (e) {
      setError("Erreur météo (coordonnées) ou problème réseau.");
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weather App</Text>

      {/* Recherche par ville */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Entrer une ville "
          value={city}
          onChangeText={handleCityChange}
          autoCapitalize="words"
          returnKeyType="search"
          onSubmitEditing={searchWeather}
        />
        <Pressable style={styles.button} onPress={searchWeather}>
          <Text style={styles.buttonText}>Chercher</Text>
        </Pressable>
      </View>

      {/* Afficher les suggestions */}
          {suggestions.length > 0 && (
      <View style={styles.suggestionsBox}>
        {suggestions.map((item, index) => (
          <Pressable
            key={index}
            style={styles.suggestionItem}
            onPress={() => {
              setCity(`${item.name}, ${item.country}`);
              hideSuggestions();
              loadWeatherFromCoords(item.lat, item.lon);
            }}
          >
            <Text>
              {item.name}, {item.country}
            </Text>
          </Pressable>
        ))}
      </View>
    )}

      {/* Map cliquable */}
      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>Ou choisir sur la carte</Text>

        <MapPicker
          targetCoords={mapTarget} // NEW: centre la map sur la ville recherchée
          onPick={({ latitude, longitude }) =>
            loadWeatherFromCoords(latitude, longitude)
          }
        />
      </View>

      {/* Loading / Error */}
      {loading && (
        <View style={{ marginTop: 14 }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      {/* Météo actuelle */}
      {currentWeather && !loading && (
        <View style={{ width: "100%", marginTop: 16 }}>
          <WeatherCard
            city={currentWeather.name}
            temp={currentWeather.temp}
            description={currentWeather.description}
          />
        </View>
      )}

      {/* Prévisions */}
      {!loading && <ForecastList items={forecast} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  suggestionsBox: {
  backgroundColor: "white",
  width: "100%",
  borderRadius: 10,
  marginTop: 4,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  alignItems: "center",
},

suggestionItem: {
  padding: 10,
  width: "50%",
  alignItems: "center",
  borderBottomWidth: 1,
  borderColor: "#E5E7EB"
},
  container: {
    padding: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
  },
  searchBox: {
    width: "100%",
    gap: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 10,
    fontWeight: "600",
  },
  mapSection: {
    width: "100%",
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
});