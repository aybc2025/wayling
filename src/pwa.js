import { registerSW } from 'virtual:pwa-register';

/** Registers the service worker; `onNeedRefresh` fires when a new version is waiting. */
export function setupPwa(onNeedRefresh) {
  const update = registerSW({ onNeedRefresh, onOfflineReady() {} });
  return update;
}
