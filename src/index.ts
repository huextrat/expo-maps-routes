// Reexport the native module. On web, it will be resolved to ExpoMapsRoutesModule.web.ts
// and on native platforms to ExpoMapsRoutesModule.ts
export { default } from './ExpoMapsRoutesModule';
export { default as ExpoMapsRoutesView } from './ExpoMapsRoutesView';
export * from  './ExpoMapsRoutes.types';
