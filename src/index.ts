// Route API: fetch polylines for expo-maps (AppleMaps.View / GoogleMaps.View)
export { fetchRouteForAppleMaps, fetchRouteForGoogleMaps } from "./fetchRoute";
export { useRouteForAppleMaps, useRouteForGoogleMaps } from "./useRoute";
export type { UseRouteForAppleMapsResult, UseRouteForGoogleMapsResult } from "./useRoute";

export type {
  RouteRequestOptions,
  AppleMapsRouteResult,
  GoogleMapsRouteResult,
} from "./types/RouteOptions";
export type { TravelMode } from "./types/TravelMode";
export type {
  ComputeRoutesRequestBody,
  GooglePolylineRoute,
  RouteModifiers,
} from "./types/GoogleApi";
