export const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = Record<
	string,
	{
		label?: string;
		icon?: string;
	} & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
>;
