// Mirror of `libs/registry/src/styles/style.ts`; keep them in sync (the first entry is the default
// style). The published cli cannot depend on the unpublished registry, hence the local copy.
export const STYLES = ['nova', 'vega', 'lyra', 'maia', 'mira', 'luma'] as const;
export type Style = (typeof STYLES)[number];
