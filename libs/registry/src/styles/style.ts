// nova first: it is the default style (the baseline), so it leads the preview style dropdown.
export const STYLES = ['nova', 'vega', 'lyra', 'maia', 'mira', 'luma'] as const;
export type Style = (typeof STYLES)[number];
