export const STYLES = ['vega', 'lyra', 'maia', 'mira', 'nova', 'luma'] as const;
export type Style = (typeof STYLES)[number];
