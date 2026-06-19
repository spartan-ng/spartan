// todo remove them when the registry is build up and published to npm
export const STYLES = ['nova', 'vega', 'lyra', 'maia', 'mira', 'luma'] as const;
export type Style = (typeof STYLES)[number];
