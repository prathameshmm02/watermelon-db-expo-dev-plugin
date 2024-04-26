export let useWatermelonDevTools: typeof import('./useWatermelonDevTools').useWatermelonDevTools;

// @ts-ignore process.env.NODE_ENV is defined by metro transform plugins
if (process.env.NODE_ENV !== 'production') {
  useWatermelonDevTools = require('./useWatermelonDevTools').useWatermelonDevTools;
} else {
  useWatermelonDevTools = () => {};
}
