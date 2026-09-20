import { Platform } from 'react-native';

/**
 * Browsers refuse to start audio before the user has interacted with the page
 * (autoplay policy) and reject `play()` with an unhandled promise. On web we wait
 * for the first pointer/key interaction before any sound; on native this is always
 * true. Also installs a guard that downgrades those specific rejections to a log.
 */
let interacted = Platform.OS !== 'web';
let installed = false;

export function installUserGestureTracking(onAutoplayBlocked?: (message: string) => void): void {
  if (installed || Platform.OS !== 'web' || typeof window === 'undefined') return;
  installed = true;
  const mark = () => {
    interacted = true;
    window.removeEventListener('pointerdown', mark, true);
    window.removeEventListener('keydown', mark, true);
    window.removeEventListener('touchstart', mark, true);
  };
  window.addEventListener('pointerdown', mark, true);
  window.addEventListener('keydown', mark, true);
  window.addEventListener('touchstart', mark, true);
  window.addEventListener('unhandledrejection', (event) => {
    const message = String((event.reason && (event.reason.message ?? event.reason)) ?? '');
    if (/play\(\) failed|NotAllowedError|user didn't interact/i.test(message)) {
      event.preventDefault();
      onAutoplayBlocked?.(message);
    }
  });
}

export function hasUserInteracted(): boolean {
  return interacted;
}
