import * as React from 'react';

import { ExpoMapsRoutesViewProps } from './ExpoMapsRoutes.types';

export default function ExpoMapsRoutesView(props: ExpoMapsRoutesViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
