import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

/**
 * Tiny frame-rate readout for performance testing. Shown ONLY when the page is opened
 * with `?fps=1` (web) — never in PJ's normal use. Counts real rendered frames via
 * requestAnimationFrame and reports once a second; also counts "long frames" (> 50 ms),
 * which is what a child perceives as lag.
 */
export function isFpsMeterEnabled(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return /[?&]fps=1(&|$)/.test(window.location.search);
}

export function FpsMeter() {
  const [reading, setReading] = useState({ fps: 0, longFrames: 0 });

  useEffect(() => {
    let frames = 0;
    let longFrames = 0;
    let last = performance.now();
    let windowStart = last;
    let handle = 0;
    const tick = (now: number) => {
      frames += 1;
      if (now - last > 50) longFrames += 1;
      last = now;
      if (now - windowStart >= 1000) {
        setReading({ fps: Math.round((frames * 1000) / (now - windowStart)), longFrames });
        frames = 0;
        windowStart = now;
      }
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <View style={styles.root} pointerEvents="none" testID="fps-meter">
      <Text style={styles.text}>
        {reading.fps} fps · {reading.longFrames} long
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 4,
    left: 4,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  text: { color: '#7CFF7C', fontSize: 11, fontFamily: Platform.select({ web: 'monospace' }) },
});
