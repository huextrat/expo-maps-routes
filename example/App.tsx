import type { RouteRequestOptions } from "expo-maps-routes";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { useRouteForAppleMaps, useRouteForGoogleMaps } from "expo-maps-routes";
import { Platform, StyleSheet, Text, View } from "react-native";

function AppleMapScreen({ options }: { options: RouteRequestOptions }) {
  const { polylines, loading, error, duration, distanceMeters } = useRouteForAppleMaps(options);

  if (loading)
    return (
      <View style={styles.centered}>
        <Text>Loading route…</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error.message}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <AppleMaps.View
        style={styles.map}
        polylines={polylines}
        cameraPosition={{
          coordinates: { latitude: ORIGIN.latitude, longitude: ORIGIN.longitude },
          zoom: 8,
        }}
      />
      <View style={styles.info}>
        <Text style={styles.infoText}>
          {duration != null && `${(duration / 1000 / 60).toFixed(1)} min`}
          {duration != null && distanceMeters != null && " · "}
          {distanceMeters != null && `${(distanceMeters / 1000).toFixed(2)} km`}
        </Text>
      </View>
    </View>
  );
}

function GoogleMapScreen({ options }: { options: RouteRequestOptions }) {
  const { polylines, loading, error, duration, distanceMeters } = useRouteForGoogleMaps(options);

  if (loading)
    return (
      <View style={styles.centered}>
        <Text>Loading route…</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error.message}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <GoogleMaps.View
        style={styles.map}
        polylines={polylines}
        cameraPosition={{
          coordinates: { latitude: ORIGIN.latitude, longitude: ORIGIN.longitude },
          zoom: 8,
        }}
      />
      <View style={styles.info}>
        <Text style={styles.infoText}>
          {duration != null && `${(duration / 1000 / 60).toFixed(1)} min`}
          {duration != null && distanceMeters != null && " · "}
          {distanceMeters != null && `${(distanceMeters / 1000).toFixed(2)} km`}
        </Text>
      </View>
    </View>
  );
}

// Set your Google Routes API key (or use EXPO_PUBLIC_GOOGLE_API_KEY in .env)
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? "YOUR_GOOGLE_API_KEY";

const ORIGIN = { latitude: 48.8566, longitude: 2.3522 };
const DESTINATION = { latitude: 48.8606, longitude: 2.3376 };

const routeOptions: RouteRequestOptions = {
  origin: ORIGIN,
  destination: DESTINATION,
  apiKey: GOOGLE_API_KEY,
  mode: "DRIVE",
  color: "#2196F3",
  width: 5,
  id: "demo-route",
  enableEstimatedTime: true,
  enableDistance: true,
};

export default function App() {
  const isWeb = Platform.OS === "web";
  const isApple = Platform.OS === "ios";

  if (isWeb) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>expo-maps-routes</Text>
        <Text style={styles.hint}>
          Run on iOS or Android (expo run:ios / expo run:android) to see the map.
        </Text>
      </View>
    );
  }

  if (GOOGLE_API_KEY === "YOUR_GOOGLE_API_KEY") {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>expo-maps-routes</Text>
        <Text style={styles.hint}>
          Set EXPO_PUBLIC_GOOGLE_API_KEY in a .env file (or edit App.tsx) with a Google Routes API
          key, then run the app.
        </Text>
      </View>
    );
  }

  if (isApple) return <AppleMapScreen options={routeOptions} />;
  return <GoogleMapScreen options={routeOptions} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  hint: {
    textAlign: "center",
    color: "#666",
  },
  error: {
    color: "#c00",
  },
  info: {
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
});
