import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TEMPERATURE_COLORS, getTemperaturePosition } from "../utils/temperatureScale";

function formatItem(dt_txt) {
  if (!dt_txt) return "";
  const [date, time] = dt_txt.split(" ");
  return `${date} ${time.slice(0, 5)}`;
}

export default function ForecastList({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prévisions (prochaines heures)</Text>

      {items.map((item) => {
        const temp = Math.round(item.main.temp);
        const position = getTemperaturePosition(temp);

        return (
          <View key={String(item.dt)} style={styles.row}>
            <View style={styles.topRow}>
              <Text style={styles.left}>{formatItem(item.dt_txt)}</Text>
              <Text style={styles.right}>{temp}°C</Text>
            </View>

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
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  left: {
    fontSize: 14,
    color: "#374151",
  },
  right: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  scaleWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  scaleRow: {
    flexDirection: "row",
    width: "100%",
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  scaleSegment: {
    flex: 1,
  },
  marker: {
    position: "absolute",
    top: -4,
    width: 9,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#111827",
    borderWidth: 2,
    borderColor: "white",
    marginLeft: -4.5,
  },
});