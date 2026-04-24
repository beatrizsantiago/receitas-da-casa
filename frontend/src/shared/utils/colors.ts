export const HUE_PRESETS: [number, number][] = [
  [18, 35],
  [42, 30],
  [12, 22],
  [45, 55],
  [28, 50],
];

export function gradientFromHues(hues?: [number, number]): string {
  if (!hues) return 'linear-gradient(135deg, #E8D8C3, #D6C6B3)';
  const c1 = `oklch(0.72 0.14 ${hues[0]})`;
  const c2 = `oklch(0.52 0.12 ${hues[1]})`;
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}

import type { CSSProperties } from 'react';

export function gradientStyle(hues: [number, number]): CSSProperties {
  return { background: gradientFromHues(hues) };
}

export function randomHues(): [number, number] {
  return [
    Math.round(20 + Math.random() * 40),
    Math.round(30 + Math.random() * 30),
  ];
}
