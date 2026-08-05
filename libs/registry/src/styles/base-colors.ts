export const BASE_COLORS = ['neutral', 'stone', 'zinc', 'gray', 'slate'] as const;
export type BaseColor = (typeof BASE_COLORS)[number];
