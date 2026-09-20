import type { RefObject } from 'react';
import type { View } from 'react-native';

import type { CanvasCapture } from '@/features/drawing/saveDrawing';

import type { CaptureDrawingOptions } from './captureDrawing';

/**
 * Web: build one SVG from the live canvas DOM (stroke layer + stamp icons, which
 * react-native-svg renders as real <svg> elements), paint it onto a <canvas> and
 * export PNG base64. Deterministic and dependency-free — html2canvas-style capture
 * of SVG content is unreliable in browsers.
 */
export async function captureDrawing(
  ref: RefObject<View | null>,
  options: CaptureDrawingOptions,
): Promise<CanvasCapture> {
  const container = ref.current as unknown as HTMLElement | null;
  if (!container || typeof container.getBoundingClientRect !== 'function') {
    throw new Error('canvas element unavailable');
  }
  const rect = container.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width || options.width));
  const height = Math.max(1, Math.round(rect.height || options.height));

  const svgs = [...container.querySelectorAll('svg')];
  const strokeLayer = svgs.find((s) => s.id === 'stroke-layer') ?? svgs[0];
  const parts: string[] = [];
  parts.push(
    `<rect x="0" y="0" width="${width}" height="${height}" fill="${escapeAttr(options.backgroundColor)}"/>`,
  );

  if (strokeLayer) {
    parts.push(
      `<svg x="0" y="0" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${strokeLayer.innerHTML}</svg>`,
    );
  }
  for (const svg of svgs) {
    if (svg === strokeLayer) continue;
    const r = svg.getBoundingClientRect();
    const viewBox = svg.getAttribute('viewBox') ?? '0 0 100 100';
    parts.push(
      `<svg x="${(r.left - rect.left).toFixed(1)}" y="${(r.top - rect.top).toFixed(1)}" width="${r.width.toFixed(1)}" height="${r.height.toFixed(1)}" viewBox="${escapeAttr(viewBox)}">${svg.innerHTML}</svg>`,
    );
  }

  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join('')}</svg>`;
  const base64 = await rasterize(markup, width, height, options.targetWidth);
  return { kind: 'base64', base64 };
}

function rasterize(
  svgMarkup: string,
  width: number,
  height: number,
  targetWidth?: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const scale = targetWidth ? targetWidth / width : Math.min(2, window.devicePixelRatio || 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('2d context unavailable'));
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
    };
    img.onerror = () => reject(new Error('svg rasterisation failed'));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
  });
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
