import type { AppleMapsPolyline } from "expo-maps/build/apple/AppleMaps.types";
import type { GooglePolylineRoute } from "./types/GoogleApi";
import type {
  RouteRequestOptions,
  AppleMapsRouteResult,
  GoogleMapsRouteResult,
} from "./types/RouteOptions";
import { decodeRoutesPolyline } from "./utils/decoder";
import { formatDuration } from "./utils/formatDuration";
import { generateFieldMask } from "./utils/generateFieldMask";
import type { Coordinates } from "expo-maps";
import { GoogleMapsPolyline } from "expo-maps/build/google/GoogleMaps.types";

const API_ENDPOINT = "https://routes.googleapis.com/directions/v2:computeRoutes";
const DEFAULT_TRAVEL_MODE = "WALK";

/**
 * Builds the request body for Google Routes API from options and optional overrides.
 * Order: base fields → routeModifiers (if any) → requestBodyOverrides (overrides take precedence).
 */
function buildRequestBody(options: RouteRequestOptions): Record<string, unknown> {
  const {
    origin,
    destination,
    waypoints,
    mode = DEFAULT_TRAVEL_MODE,
    routeModifiers,
    requestBodyOverrides = {},
  } = options;

  return {
    origin: {
      location: {
        latLng: {
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
      },
    },
    ...(waypoints && waypoints.length > 0
      ? {
          intermediates: waypoints.map((wp) => ({
            location: {
              latLng: { latitude: wp.latitude, longitude: wp.longitude },
            },
          })),
        }
      : {}),
    travelMode: mode,
    ...(routeModifiers && Object.keys(routeModifiers).length > 0 && { routeModifiers }),
    ...requestBodyOverrides,
  };
}

type FetchRouteRawResult =
  | {
      coordinates: Coordinates[];
      duration?: number;
      distanceMeters?: number;
      color: string;
      width: number;
      id?: string;
    }
  | { error: Error };

async function fetchRouteRaw(options: RouteRequestOptions): Promise<FetchRouteRawResult> {
  const {
    apiKey,
    enableEstimatedTime = false,
    enableDistance = false,
    fieldMask: customFieldMask,
  } = options;

  const fieldMask =
    customFieldMask ??
    generateFieldMask({
      enableEstimatedTime,
      enableDistance,
    });

  const body = buildRequestBody(options);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify(body),
    });

    const json = (await response.json()) as {
      routes?: GooglePolylineRoute[];
      error?: { message?: string; code?: number };
    };

    if (!response.ok || json.error) {
      const err = json.error ?? { message: `HTTP ${response.status}` };
      return { error: new Error(err.message ?? "Unknown error") };
    }

    const route = json.routes?.[0];
    if (!route?.polyline?.encodedPolyline) {
      return { error: new Error("No route or polyline in response") };
    }

    const coordinates = decodeRoutesPolyline(route as GooglePolylineRoute);
    const color = options.color ?? "#000";
    const width = options.width ?? 6;

    return {
      coordinates,
      duration: enableEstimatedTime ? formatDuration(route.duration) : undefined,
      distanceMeters: enableDistance ? route.distanceMeters : undefined,
      color,
      width,
      id: options.id,
    };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
}

/**
 * Fetches a route from Google Routes API and returns polylines for **Apple Maps** (expo-maps on iOS).
 * Pass the result to the `polylines` prop of `AppleMaps.View`.
 *
 * @param options - Route request options (origin, destination, apiKey, etc.). Use requestBodyOverrides to customize the API request.
 * @returns Promise with AppleMapsPolyline[] and optional duration/distance, or error.
 */
export async function fetchRouteForAppleMaps(
  options: RouteRequestOptions,
): Promise<AppleMapsRouteResult> {
  const raw = await fetchRouteRaw(options);
  if ("error" in raw) {
    return { polylines: [], error: raw.error };
  }
  const { coordinates, duration, distanceMeters, color, width, id } = raw;
  const polylines: AppleMapsPolyline[] = [{ coordinates, color, width, ...(id != null && { id }) }];
  return { polylines, duration, distanceMeters };
}

/**
 * Fetches a route from Google Routes API and returns polylines for **Google Maps** (expo-maps on Android).
 * Pass the result to the `polylines` prop of `GoogleMaps.View`.
 *
 * @param options - Route request options (origin, destination, apiKey, etc.). Use requestBodyOverrides to customize the API request.
 * @returns Promise with GoogleMapsPolyline[] and optional duration/distance, or error.
 */
export async function fetchRouteForGoogleMaps(
  options: RouteRequestOptions,
): Promise<GoogleMapsRouteResult> {
  const raw = await fetchRouteRaw(options);
  if ("error" in raw) {
    return { polylines: [], error: raw.error };
  }
  const { coordinates, duration, distanceMeters, color, width, id } = raw;
  const polylines: GoogleMapsPolyline[] = [
    { coordinates, color, width, geodesic: true, ...(id != null && { id }) },
  ];
  return { polylines, duration, distanceMeters };
}
