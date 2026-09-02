import type { ChartTheme } from '@tanstack/charts';

/** A TanStack Charts theme backed by Spartan's semantic color tokens. */
export const HLM_CHART_THEME = {
	foreground: 'var(--foreground)',
	muted: 'var(--muted-foreground)',
	grid: 'var(--muted-foreground)',
	background: 'transparent',
	palette: ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
} as const satisfies ChartTheme;
