import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TEMPERATURE_COLORS, getTemperaturePosition } from "../utils/temperatureScale";

export default function WeatherCard({ city, temp, description }) {
  const position = getTemperaturePosition(temp);

  return (
    <View style={styles.card}>
      <Text style={styles.city}>{city}</Text>

      <Text style={styles.temp}>{Math.round(temp)}°C</Text>
      <Text style={styles.desc}>{description}</Text>

      <View style={styles.scaleWrapper}>
        <View style={styles.scaleRow}>
          {TEMPERATURE_COLORS.map((color, index) => (
            <View
              key={index}
              style={[styles.scaleSegment, { backgroundColor: color }]}
            />
          ))}
        </View>

        <View style={[styles.marker, { left: `${position}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    width: "100%",
    elevation: 3,
  },
  city: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  temp: {
    fontSize: 42,
    fontWeight: "800",
    marginBottom: 6,
    color: "#111827",
  },
  desc: {
    fontSize: 16,
    color: "#4B5563",
    textTransform: "capitalize",
    marginBottom: 16,
  },
  scaleWrapper: {
    marginTop: 4,
    position: "relative",
    justifyContent: "center",
  },
  scaleRow: {
    flexDirection: "row",
    width: "100%",
    height: 12,
    borderRadius: 999,
    overflow: "hidden",
  },
  scaleSegment: {
    flex: 1,
  },
  marker: {
    position: "absolute",
    top: -4,
    width: 10,
    height: 20,
    borderRadius: 999,
    backgroundColor: "#111827",
    borderWidth: 2,
    borderColor: "white",
    marginLeft: -5,
  },
});