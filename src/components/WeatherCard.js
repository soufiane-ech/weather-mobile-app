import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function WeatherCard({ city, temp, description }) {
  return (
    <View style={styles.card}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.temp}>{Math.round(temp)}°C</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    width: "100%",
    elevation: 3,
  },
  city: { fontSize: 18, fontWeight: "700" },
  temp: { fontSize: 42, fontWeight: "800", marginVertical: 8 },
  desc: { fontSize: 16, opacity: 0.7 },
});