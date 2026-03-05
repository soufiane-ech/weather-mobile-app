import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapPicker({ onPick, targetCoords }) {
  const mapRef = useRef(null);

  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState("");

  // Init: centrer sur la position actuelle (ou Rabat fallback)
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Permission localisation refusée. (Carte sur Rabat)");
          const fallback = {
            latitude: 34.020882,
            longitude: -6.84165,
            latitudeDelta: 5,
            longitudeDelta: 5,
          };
          setRegion(fallback);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const start = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        };
        setRegion(start);
      } catch (e) {
        setError("Localisation indisponible. (Carte sur Rabat)");
        setRegion({
          latitude: 34.020882,
          longitude: -6.84165,
          latitudeDelta: 5,
          longitudeDelta: 5,
        });
      }
    })();
  }, []);

  // NEW: quand on reçoit targetCoords (depuis recherche ville), on recentre la map + marker
  useEffect(() => {
    if (!targetCoords?.latitude || !targetCoords?.longitude) return;

    const nextRegion = {
      latitude: targetCoords.latitude,
      longitude: targetCoords.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

    setMarker({ latitude: targetCoords.latitude, longitude: targetCoords.longitude });
    setRegion((prev) => prev || nextRegion);

    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(nextRegion, 600);
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
        <Text style={{ marginTop: 10 }}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onPress={handlePress}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <Text style={styles.hint}>
        Clique sur la carte pour choisir une zone et afficher la météo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", marginTop: 12 },
  map: { width: "100%", height: 320, borderRadius: 12 },
  hint: { marginTop: 8, opacity: 0.7 },
  error: { color: "red", marginBottom: 8 },
  loading: { marginTop: 40, alignItems: "center" },
});