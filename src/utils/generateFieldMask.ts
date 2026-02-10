export type FieldMaskParams = {
  enableEstimatedTime?: boolean;
  enableDistance?: boolean;
};

/**
 * Builds the X-Goog-FieldMask header value for Google Routes API.
 * Request only the fields you need to reduce response size.
 */
export function generateFieldMask(params: FieldMaskParams): string {
  const baseFields = ["routes.polyline.encodedPolyline"];

  if (params.enableEstimatedTime) {
    baseFields.push("routes.duration");
  }
  if (params.enableDistance) {
    baseFields.push("routes.distanceMeters");
  }

  return baseFields.join(",");
}
