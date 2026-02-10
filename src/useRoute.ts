import { useCallback, useEffect, useRef, useState } from "react";
import type {
  RouteRequestOptions,
  AppleMapsRouteResult,
  GoogleMapsRouteResult,
} from "./types/RouteOptions";
import { fetchRouteForAppleMaps, fetchRouteForGoogleMaps } from "./fetchRoute";

export type UseRouteForAppleMapsResult = AppleMapsRouteResult & {
  loading: boolean;
  refetch: () => Promise<AppleMapsRouteResult>;
};

export type UseRouteForGoogleMapsResult = GoogleMapsRouteResult & {
  loading: boolean;
  refetch: () => Promise<GoogleMapsRouteResult>;
};

/**
 * React hook to fetch a route and get polylines for **Apple Maps** (expo-maps AppleMaps.View).
 * You choose this when your screen uses AppleMaps.View.
 */
export function useRouteForAppleMaps(options: RouteRequestOptions): UseRouteForAppleMapsResult {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [state, setState] = useState<UseRouteForAppleMapsResult>({
    polylines: [],
    loading: true,
    refetch: async () => ({ polylines: [] }),
  });

  const runFetch = useCallback(async (): Promise<AppleMapsRouteResult> => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }));
    const result = await fetchRouteForAppleMaps(optionsRef.current);
    setState((prev) => ({ ...prev, ...result, loading: false }));
    return result;
  }, []);

  useEffect(() => {
    runFetch();
  }, [
    options.origin?.latitude,
    options.origin?.longitude,
    options.destination?.latitude,
    options.destination?.longitude,
    options.apiKey,
    runFetch,
  ]);

  return { ...state, refetch: runFetch };
}

/**
 * React hook to fetch a route and get polylines for **Google Maps** (expo-maps GoogleMaps.View).
 * You choose this when your screen uses GoogleMaps.View.
 */
export function useRouteForGoogleMaps(options: RouteRequestOptions): UseRouteForGoogleMapsResult {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [state, setState] = useState<UseRouteForGoogleMapsResult>({
    polylines: [],
    loading: true,
    refetch: async () => ({ polylines: [] }),
  });

  const runFetch = useCallback(async (): Promise<GoogleMapsRouteResult> => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }));
    const result = await fetchRouteForGoogleMaps(optionsRef.current);
    setState((prev) => ({ ...prev, ...result, loading: false }));
    return result;
  }, []);

  useEffect(() => {
    runFetch();
  }, [
    options.origin?.latitude,
    options.origin?.longitude,
    options.destination?.latitude,
    options.destination?.longitude,
    options.apiKey,
    runFetch,
  ]);

  return { ...state, refetch: runFetch };
}
