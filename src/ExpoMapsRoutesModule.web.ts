import { registerWebModule, NativeModule } from 'expo';

import { ExpoMapsRoutesModuleEvents } from './ExpoMapsRoutes.types';

class ExpoMapsRoutesModule extends NativeModule<ExpoMapsRoutesModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoMapsRoutesModule, 'ExpoMapsRoutesModule');
