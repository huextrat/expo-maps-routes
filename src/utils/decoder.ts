import type { Coordinates } from "expo-maps";
import type { GooglePolylineRoute } from "../types/GoogleApi";

/**
 * Decodes Google's encoded polyline from Routes API into an array of coordinates.
 * @see https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
export function decodeRoutesPolyline(route: GooglePolylineRoute): Coordinates[] {
  const points: Coordinates[] = [];
  const encoded = route.polyline.encodedPolyline;
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dLat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dLng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}
