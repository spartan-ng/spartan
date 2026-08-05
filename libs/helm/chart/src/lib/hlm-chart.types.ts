export type ChartConfig = Record<
	string,
	{
		label?: string;
		icon?: string;
		color?: string;
		theme?: Record<string, string>;
	}
>;

export type ChartTooltipIndicator = 'dot' | 'line' | 'dashed';
