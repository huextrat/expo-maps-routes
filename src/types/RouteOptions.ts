import type { TravelMode } from "./TravelMode";
import type { ComputeRoutesRequestBody, RouteModifiers } from "./GoogleApi";
import type { Coordinates } from "expo-maps";
import type { AppleMapsPolyline } from "expo-maps/build/apple/AppleMaps.types";
import type { GoogleMapsPolyline } from "expo-maps/build/google/GoogleMaps.types";

/**
 * Options for fetching a route from Google Routes API.
 * Mirrors react-native-maps-routes API with extra customization for the request body.
 */
export type RouteRequestOptions = {
  /** Origin coordinates */
  origin: Coordinates;
  /** Destination coordinates */
  destination: Coordinates;
  /** Google Cloud API key (Routes API must be enabled) */
  apiKey: string;
  /** Optional waypoints between origin and destination */
  waypoints?: Coordinates[];
  /** Travel mode (default: WALK) */
  mode?: TravelMode;
  /** Polyline color (default: #000). Maps to expo-maps polyline `color`. */
  color?: string;
  /** Polyline width (default: 6). Maps to expo-maps polyline `width`. */
  width?: number;
  /**
   * Optional id set on the returned polyline. Use it in onPolylineClick to identify which route was clicked.
   * @see https://docs.expo.dev/versions/latest/sdk/maps/#onpolylineclick
   */
  id?: string;
  /** Request duration in the response (adds routes.duration to field mask) */
  enableEstimatedTime?: boolean;
  /** Request distance in the response (adds routes.distanceMeters to field mask) */
  enableDistance?: boolean;
  /**
   * Route modifiers (e.g. avoidTolls, avoidHighways). Typed for discoverability.
   * @see https://developers.google.com/maps/documentation/routes/reference/rest/v2/RouteModifiers
   */
  routeModifiers?: RouteModifiers;
  /**
   * Override or add any field to the request body sent to Google Routes API.
   * Applied after built-in fields (origin, destination, travelMode, routeModifiers).
   * @see https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes
   */
  requestBodyOverrides?: Partial<ComputeRoutesRequestBody> & Record<string, unknown>;
  /**
   * Custom field mask for the response. If provided, replaces the default mask.
   * Default is built from enableEstimatedTime and enableDistance.
   */
  fieldMask?: string;
};

/** Result when fetching for Apple Maps (expo-maps AppleMaps.View). */
export type AppleMapsRouteResult = {
  polylines: AppleMapsPolyline[];
  duration?: number;
  distanceMeters?: number;
  error?: Error;
};

/** Result when fetching for Google Maps (expo-maps GoogleMaps.View). */
export type GoogleMapsRouteResult = {
  polylines: GoogleMapsPolyline[];
  duration?: number;
  distanceMeters?: number;
  error?: Error;
};
