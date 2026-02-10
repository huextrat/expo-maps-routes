# expo-maps-routes

Utils for [expo-maps](https://docs.expo.dev/versions/latest/sdk/maps/) to get route polylines between coordinates using the Google Routes API.  
Inspired by [react-native-maps-routes](https://github.com/huextrat/react-native-maps-routes), but returns **polylines in expo-maps format** that you pass to either `AppleMaps.View` or `GoogleMaps.View`.  
**You choose** which map you use: the library exposes separate methods for Apple Maps and for Google Maps.

## Compatibility

| expo-maps-routes | Expo SDK | expo-maps | React Native |
| ---------------- | -------- | --------- | ------------ |
| 1.0.x            | 54+      | 0.12.10   | 0.81+        |

The returned polylines are compatible with **AppleMaps.View** (iOS) and **GoogleMaps.View** (Android).

## Installation

```sh
npx expo install expo-maps-routes expo-maps
```

You need a **Google Cloud API key** with the [Routes API](https://developers.google.com/maps/documentation/routes) enabled (Directions v2: computeRoutes).

## Usage

### Apple Maps (expo-maps `AppleMaps.View`)

Use **`fetchRouteForAppleMaps`** / **`useRouteForAppleMaps`** when your screen uses `AppleMaps.View`:

```tsx
import { AppleMaps } from "expo-maps";
import { useRouteForAppleMaps } from "expo-maps-routes";
import { Text } from "react-native";

export default function AppleMapWithRoute() {
  const { polylines, loading, error, duration, distanceMeters } = useRouteForAppleMaps({
    origin: { latitude: 48.8566, longitude: 2.3522 },
    destination: { latitude: 48.8606, longitude: 2.3376 },
    apiKey: "YOUR_GOOGLE_API_KEY",
    mode: "DRIVE",
    enableEstimatedTime: true,
    enableDistance: true,
    color: "#2196F3",
    width: 5,
  });

  if (loading) return <Text>Loading route…</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return <AppleMaps.View style={{ flex: 1 }} polylines={polylines} />;
}
```

### Google Maps (expo-maps `GoogleMaps.View`)

Use **`fetchRouteForGoogleMaps`** / **`useRouteForGoogleMaps`** when your screen uses `GoogleMaps.View`:

```tsx
import { GoogleMaps } from "expo-maps";
import { useRouteForGoogleMaps } from "expo-maps-routes";
import { Text } from "react-native";

export default function GoogleMapWithRoute() {
  const { polylines, loading, error, duration, distanceMeters } = useRouteForGoogleMaps({
    origin: { latitude: 48.8566, longitude: 2.3522 },
    destination: { latitude: 48.8606, longitude: 2.3376 },
    apiKey: "YOUR_GOOGLE_API_KEY",
    mode: "DRIVE",
    enableEstimatedTime: true,
    enableDistance: true,
    color: "#2196F3",
    width: 5,
  });

  if (loading) return <Text>Loading route…</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return <GoogleMaps.View style={{ flex: 1 }} polylines={polylines} />;
}
```

### Choosing based on platform

The library does **not** depend on `Platform`. You decide which API to call depending on which map you render:

```tsx
import { AppleMaps, GoogleMaps } from "expo-maps";
import { useRouteForAppleMaps, useRouteForGoogleMaps } from "expo-maps-routes";
import { Platform, Text } from "react-native";

const options = {
  origin: { latitude: 48.8566, longitude: 2.3522 },
  destination: { latitude: 48.8606, longitude: 2.3376 },
  apiKey: "YOUR_GOOGLE_API_KEY",
  mode: "DRIVE",
};

export default function MapWithRoute() {
  const apple = useRouteForAppleMaps(options);
  const google = useRouteForGoogleMaps(options);

  if (Platform.OS === "ios") {
    const { polylines, loading, error } = apple;
    if (loading) return <Text>Loading…</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
    return <AppleMaps.View style={{ flex: 1 }} polylines={polylines} />;
  }

  const { polylines, loading, error } = google;
  if (loading) return <Text>Loading…</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  return <GoogleMaps.View style={{ flex: 1 }} polylines={polylines} />;
}
```

### Imperative API

```tsx
import { fetchRouteForAppleMaps, fetchRouteForGoogleMaps } from "expo-maps-routes";

// For AppleMaps.View
const appleResult = await fetchRouteForAppleMaps({
  origin: { latitude: 48.8566, longitude: 2.3522 },
  destination: { latitude: 48.8606, longitude: 2.3376 },
  apiKey: "YOUR_GOOGLE_API_KEY",
  mode: "WALK",
  waypoints: [{ latitude: 48.858, longitude: 2.294 }],
  enableEstimatedTime: true,
  enableDistance: true,
});
if (!appleResult.error) {
  setPolylines(appleResult.polylines); // AppleMapsPolyline[]
}

// For GoogleMaps.View
const googleResult = await fetchRouteForGoogleMaps({ ...sameOptions });
if (!googleResult.error) {
  setPolylines(googleResult.polylines); // GoogleMapsPolyline[]
}
```

### Route modifiers (avoid tolls, highways, ferries)

Use the typed `routeModifiers` option for common routing preferences:

```tsx
useRouteForGoogleMaps({
  origin,
  destination,
  apiKey: "…",
  mode: "DRIVE",
  routeModifiers: { avoidTolls: true, avoidHighways: true },
});
```

### Customizing the Google API request

You can pass any extra parameters supported by the [computeRoutes](https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes) API via `requestBodyOverrides` (applied after built-in fields, so it can override `routeModifiers` if needed):

```tsx
useRouteForAppleMaps({
  origin,
  destination,
  apiKey: "…",
  mode: "DRIVE",
  requestBodyOverrides: {
    languageCode: "fr",
    routingPreference: "TRAFFIC_AWARE_OPTIMAL",
  },
});
```

### Identifying the route in `onPolylineClick`

Pass an `id` in options; it is set on the returned polyline. When the user taps the route, expo-maps calls `onPolylineClick` with the polyline object, so you can read `event.id` to know which route was clicked:

```tsx
const { polylines } = useRouteForAppleMaps({
  origin,
  destination,
  apiKey: "…",
  id: "route-to-work",
});

<AppleMaps.View
  polylines={polylines}
  onPolylineClick={(event) => {
    if (event.id === "route-to-work") {
      // show route details, etc.
    }
  }}
/>;
```

Or use a custom field mask:

```tsx
fetchRouteForGoogleMaps({
  origin,
  destination,
  apiKey: "…",
  fieldMask: "routes.polyline.encodedPolyline,routes.duration,routes.distanceMeters",
});
```

## API

### `fetchRouteForAppleMaps(options): Promise<AppleMapsRouteResult>`

Returns polylines for **AppleMaps.View** (`AppleMapsPolyline[]`).

### `fetchRouteForGoogleMaps(options): Promise<GoogleMapsRouteResult>`

Returns polylines for **GoogleMaps.View** (`GoogleMapsPolyline[]`).

### `useRouteForAppleMaps(options): UseRouteForAppleMapsResult`

Hook: same options, returns `{ polylines, duration?, distanceMeters?, error?, loading, refetch }` with `polylines: AppleMapsPolyline[]`.

### `useRouteForGoogleMaps(options): UseRouteForGoogleMapsResult`

Hook: same options, returns `{ polylines, duration?, distanceMeters?, error?, loading, refetch }` with `polylines: GoogleMapsPolyline[]`.

### Options (`RouteRequestOptions`)

- `origin`, `destination`, `apiKey` (required)
- `waypoints?`, `mode?` (default `'WALK'`), `color?`, `width?`, `id?` (for onPolylineClick)
- `enableEstimatedTime?`, `enableDistance?`
- `routeModifiers?` – typed route modifiers (`avoidTolls`, `avoidHighways`, `avoidFerries`, `avoidIndoor`). [API reference](https://developers.google.com/maps/documentation/routes/reference/rest/v2/RouteModifiers)
- `requestBodyOverrides?` – override or add any request body field; applied after built-in fields
- `fieldMask?` – override response field mask

### Types

- `TravelMode`: `'DRIVE' | 'BICYCLE' | 'TWO_WHEELER' | 'WALK'`
- `RouteModifiers` – for the `routeModifiers` option (`avoidTolls`, `avoidHighways`, `avoidFerries`, `avoidIndoor`)
- `ComputeRoutesRequestBody` – for typing `requestBodyOverrides`
- `Coordinates`, `AppleMapsPolyline`, `GoogleMapsPolyline` – re-exported or derived from **expo-maps** so they match the map component props
- `RouteRequestOptions`, `AppleMapsRouteResult`, `GoogleMapsRouteResult`
- `UseRouteForAppleMapsResult`, `UseRouteForGoogleMapsResult`

## License

MIT
