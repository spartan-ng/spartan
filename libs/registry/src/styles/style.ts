export const STYLES = ['nova', 'vega', 'lyra', 'maia', 'mira', 'luma'] as const;
export type Style = (typeof STYLES)[number];
