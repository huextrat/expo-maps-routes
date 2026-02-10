import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoMapsRoutesViewProps } from './ExpoMapsRoutes.types';

const NativeView: React.ComponentType<ExpoMapsRoutesViewProps> =
  requireNativeView('ExpoMapsRoutes');

export default function ExpoMapsRoutesView(props: ExpoMapsRoutesViewProps) {
  return <NativeView {...props} />;
}
