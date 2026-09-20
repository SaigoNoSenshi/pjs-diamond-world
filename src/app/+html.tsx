import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/** Sub-path the site is served from ("" for a root domain). Set by the build, never by PJ. */
const BASE = (process.env.EXPO_PUBLIC_WEB_BASE ?? '').replace(/\/+$/, '');

/**
 * Root HTML for the web build (static export). Adds the PWA manifest, home-screen
 * icons, mobile viewport settings and the offline service worker so the app installs
 * on tablets and phones and opens instantly on the second launch.
 * Never rendered on native.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, shrink-to-fit=no"
        />
        <title>PJ&apos;s Diamond World</title>
        <meta name="description" content="Draw, craft and grow a magical island garden." />
        <meta name="theme-color" content="#FFD93D" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Diamond World" />
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${BASE}/icons/apple-touch-icon.png`} />
        <link rel="icon" href={`${BASE}/icons/icon-192.png`} />
        <ScrollViewStyleReset />
        {/* Prevent pull-to-refresh / overscroll bounce and text selection while drawing. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body { overscroll-behavior: none; -webkit-user-select: none; user-select: none; touch-action: manipulation; background: #FFF7E6; }
              #root { min-height: 100%; }
            `,
          }}
        />
        {/* Offline + instant repeat launches. Silently skipped where unsupported (sandboxed frames, http). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){window.addEventListener('load',function(){navigator.serviceWorker.register(${JSON.stringify(`${BASE}/sw.js`)}).catch(function(){});});}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
