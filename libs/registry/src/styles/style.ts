export const STYLES = ['vega', 'lyra', 'maia', 'mira', 'nova'] as const;
export type Style = (typeof STYLES)[number];
