import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapPicker({ onPick, targetCoords }) {
  const mapRef = useRef(null);

  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Permission localisation refusée.");
          setRegion({
            latitude: 34.020882,
            longitude: -6.84165,
            latitudeDelta: 5,
            longitudeDelta: 5,
          });
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        });
      } catch (e) {
        setError("Localisation indisponible.");
        setRegion({
          latitude: 34.020882,
          longitude: -6.84165,
          latitudeDelta: 5,
          longitudeDelta: 5,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!targetCoords?.latitude || !targetCoords?.longitude) return;

    const nextRegion = {
      latitude: targetCoords.latitude,
      longitude: targetCoords.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

    setMarker({
      latitude: targetCoords.latitude,
      longitude: targetCoords.longitude,
    });

    if (mapRef.current) {
      mapRef.current.animateToRegion(nextRegion, 800);
    }
  }, [targetCoords]);

  function handlePress(e) {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    onPick({ latitude, longitude });
  }

  if (!region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onPress={handlePress}
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>
      </View>

      <Text style={styles.hint}>
        Clique sur la carte pour choisir une zone.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: 12,
  },
  mapContainer: {
    width: "100%",
    height: 280,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#DDEAFE",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
  },
  error: {
    color: "red",
    marginBottom: 8,
    fontWeight: "600",
  },
  loading: {
    width: "100%",
    height: 260,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#6B7280",
  },
});