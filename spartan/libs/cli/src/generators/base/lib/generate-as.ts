export const generateOptions = ['library', 'entrypoint'] as const;
export type GenerateAs = (typeof generateOptions)[number];
