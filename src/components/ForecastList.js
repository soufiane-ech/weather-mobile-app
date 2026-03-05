import React from "react";
import { View, Text, StyleSheet } from "react-native";

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

      {items.map((item) => (
        <View key={String(item.dt)} style={styles.row}>
          <Text style={styles.left}>{formatItem(item.dt_txt)}</Text>
          <Text style={styles.right}>{Math.round(item.main.temp)}°C</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginTop: 14 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  row: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left: { fontSize: 14, opacity: 0.75 },
  right: { fontSize: 15, fontWeight: "700" },
});