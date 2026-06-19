// todo remove them when the registry is build up and published to npm
export const STYLES = ['vega', 'lyra', 'maia', 'mira', 'nova', 'luma'] as const;
export type Style = (typeof STYLES)[number];
