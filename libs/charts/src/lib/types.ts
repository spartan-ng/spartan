import * as d3 from 'd3';

/**
 * Represents a key used to access data properties.
 * Can be a string (property name), number (array index), or function.
 */
export type DataKey<T = unknown> = string | number | ((data: T) => unknown);

/**
 * Generic chart data structure - array of records
 */
export type ChartData<T = unknown> = T[];

/**
 * Margin configuration for charts
 */
export interface ChartMargin {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

/**
 * Default margin values
 */
export const DEFAULT_MARGIN: ChartMargin = {
	top: 5,
	right: 5,
	bottom: 5,
	left: 5,
};

/**
 * Chart layout orientation
 */
export type ChartLayout = 'horizontal' | 'vertical';

/**
 * Axis types
 */
export type AxisType = 'number' | 'category' | 'time';

/**
 * Scale types from D3
 */
export type Scale =
	| d3.ScaleLinear<number, number>
	| d3.ScaleBand<string>
	| d3.ScalePoint<string>
	| d3.ScaleTime<number, number>;

/**
 * Domain specification for axes
 */
export type Domain = [number | string | Date, number | string | Date] | ['auto', 'auto'] | ['dataMin', 'dataMax'];

/**
 * Animation easing functions
 */
export type AnimationEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';

/**
 * Animation configuration
 */
export interface AnimationConfig {
	isAnimationActive?: boolean;
	animationBegin?: number;
	animationDuration?: number;
	animationEasing?: AnimationEasing;
}

/**
 * Position type for labels, legends, etc.
 */
export type HorizontalAlign = 'left' | 'center' | 'right';
export type VerticalAlign = 'top' | 'middle' | 'bottom';

/**
 * Axis orientation
 */
export type AxisOrientation = 'top' | 'bottom' | 'left' | 'right';

/**
 * Tick formatter function
 */
export type TickFormatter = (value: unknown, index: number) => string;

/**
 * Label configuration
 */
export interface LabelConfig {
	value?: string | number;
	position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'inside' | 'outside';
	offset?: number;
	angle?: number;
}

/**
 * Tooltip payload item
 */
export interface TooltipPayload<T = unknown> {
	name: string;
	value: unknown;
	dataKey: DataKey<T>;
	color: string;
	payload: T;
}

/**
 * Tooltip formatter function
 */
export type TooltipFormatter = (value: unknown, name: string, props: TooltipPayload) => [string, string] | string;

/**
 * Tooltip state for managing hover interactions
 */
export interface TooltipState<T = unknown> {
	active: boolean;
	position: { x: number; y: number };
	payload: TooltipPayload<T>[];
	label: string | number;
	activeDataIndex?: number; // Index of the active data point for dot highlighting
}

/**
 * Legend item type - includes both shape types and chart types
 */
export type LegendItemType =
	// Shape types (from Recharts)
	| 'line'
	| 'rect'
	| 'circle'
	| 'cross'
	| 'diamond'
	| 'square'
	| 'star'
	| 'triangle'
	| 'wye'
	// Chart types
	| 'bar'
	| 'area'
	| 'scatter'
	| 'pie'
	| 'histogram'
	| 'heatmap';

/**
 * Legend item
 */
export interface LegendItem {
	value: string;
	type: LegendItemType;
	id: string;
	color: string;
	inactive?: boolean;
}

/**
 * Graphical element base interface
 */
export interface GraphicalElement<T = unknown> {
	dataKey: DataKey<T>;
	name?: string;
	stroke?: string;
	fill?: string;
	strokeWidth?: number;
	hide?: boolean;
	xAxisId?: string;
	yAxisId?: string;
	stackId?: string;
}

/**
 * Bar radius configuration - single number for all corners or array for [topLeft, topRight, bottomRight, bottomLeft]
 */
export type BarRadius = number | [number, number, number, number];

/**
 * Input transform for radius/size values that accept a number or a percentage
 * string (e.g. pie `outerRadius`). Coerces a plain numeric-string attribute
 * (`outerRadius="90"`) to a number, while leaving percentage strings (`"80%"`)
 * and actual numbers untouched.
 */
export function dimensionAttribute(value: string | number): string | number {
	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (trimmed !== '' && !trimmed.endsWith('%') && !Number.isNaN(Number(trimmed))) {
			return Number(trimmed);
		}
	}
	return value;
}

/**
 * Input transform for bar `radius`. Coerces a numeric-string attribute
 * (`radius="8"`) to a number, while leaving an array bound via
 * `[radius]="[topLeft, topRight, bottomRight, bottomLeft]"` untouched.
 */
export function barRadiusAttribute(value: BarRadius | string): BarRadius {
	if (typeof value === 'string') {
		const n = Number(value);
		return Number.isNaN(n) ? 0 : n;
	}
	return value;
}

/**
 * Stack offset types for stacked bar charts
 */
export type StackOffset = 'none' | 'expand' | 'diverging' | 'silhouette' | 'wiggle';

/**
 * Scatter point shape types
 */
export type ScatterShape = 'circle'; // Extensible: | 'diamond' | 'square' | 'star' | 'triangle'

/**
 * Bar label configuration
 */
export interface BarLabelConfig {
	position?: 'top' | 'center' | 'bottom' | 'inside' | 'outside' | 'insideLeft' | 'right';
	formatter?: (value: unknown, index: number) => string;
	fill?: string;
	fontSize?: number;
	/** Distance in px from the bar edge (recharts LabelList offset). */
	offset?: number;
	/** Show another field of the data row instead of the bar's value. */
	dataKey?: string;
}

/**
 * Curve types for Line and Area charts (from D3)
 */
export type CurveType =
	| 'basis'
	| 'basisClosed'
	| 'basisOpen'
	| 'bundle'
	| 'cardinal'
	| 'cardinalClosed'
	| 'cardinalOpen'
	| 'catmullRom'
	| 'catmullRomClosed'
	| 'catmullRomOpen'
	| 'linear'
	| 'linearClosed'
	| 'monotoneX'
	| 'monotoneY'
	| 'natural'
	| 'step'
	| 'stepAfter'
	| 'stepBefore';

/** Context handed to a custom line dot renderer for each data point. */
export interface LineDotContext {
	cx: number;
	cy: number;
	index: number;
	payload: Record<string, unknown>;
}

/** Returns an SVG fragment drawn centred on a line dot (translate already applied). */
export type LineDotRenderer = (context: LineDotContext) => string;

/**
 * Heatmap color scheme types
 */
export type HeatmapColorScheme =
	| 'blues' // d3.interpolateBlues
	| 'greens' // d3.interpolateGreens
	| 'reds' // d3.interpolateReds
	| 'purples' // d3.interpolatePurples
	| 'oranges' // d3.interpolateOranges
	| 'viridis' // d3.interpolateViridis
	| 'plasma' // d3.interpolatePlasma
	| 'warm' // d3.interpolateWarm
	| 'cool' // d3.interpolateCool
	| 'RdYlBu' // d3.interpolateRdYlBu (diverging)
	| 'RdYlGn' // d3.interpolateRdYlGn (diverging)
	| 'spectral'; // d3.interpolateSpectral (diverging)

/**
 * Heatmap label configuration
 */
export interface HeatmapLabelConfig {
	formatter?: (value: number) => string; // Custom label formatter
	fill?: string; // Label text color (default: auto based on cell color)
	fontSize?: number; // Font size in pixels (default: 12)
	fontWeight?: string | number; // Font weight (default: 'normal')
}

/**
 * Pie chart label position types
 */
export type PieLabelPosition = 'inside' | 'outside' | 'center';

/**
 * Hover state for chart context
 */
export interface HoverState {
	/** Index of the hovered data point (-1 if none) */
	activeDataIndex: number;
	/** ID of the hovered series/element (for multi-series charts) */
	activeSeriesId?: string;
	/** Type of element being hovered */
	elementType?: 'bar' | 'cell' | 'slice' | 'point';
}

/**
 * Pie chart label configuration
 */
export interface PieLabelConfig {
	position?: PieLabelPosition;
	offset?: number;
	fill?: string;
	fontSize?: number;
	fontWeight?: string | number;
	formatter?: (value: number, name: string, percent: number) => string;
}

/**
 * Pie chart label line configuration (connector lines for outside labels)
 */
export interface PieLabelLineConfig {
	stroke?: string;
	strokeWidth?: number;
}

/**
 * Default color palette for pie charts
 */
export const DEFAULT_PIE_COLORS = [
	'#8884d8',
	'#82ca9d',
	'#ffc658',
	'#ff7300',
	'#00C49F',
	'#FFBB28',
	'#FF8042',
	'#0088FE',
	'#00C49F',
	'#FFBB28',
];

/**
 * Type guard for D3 linear scale
 */
export function isLinearScale(scale: Scale): scale is d3.ScaleLinear<number, number> {
	return 'invert' in scale && 'ticks' in scale && !('bandwidth' in scale) && !isTimeScale(scale);
}

/**
 * Type guard for D3 band scale
 */
export function isBandScale(scale: Scale): scale is d3.ScaleBand<string> {
	return 'bandwidth' in scale && 'paddingInner' in scale;
}

/**
 * Type guard for D3 point scale
 */
export function isPointScale(scale: Scale): scale is d3.ScalePoint<string> {
	return 'step' in scale && !('bandwidth' in scale);
}

/**
 * Type guard for D3 time scale
 */
export function isTimeScale(scale: Scale): scale is d3.ScaleTime<number, number> {
	if (!('invert' in scale) || !('ticks' in scale)) return false;
	const domain = scale.domain();
	return domain.length > 0 && domain[0] instanceof Date;
}

/**
 * Helper to extract value from data using DataKey
 * Defensive implementation that handles errors gracefully
 */
export function getValueByDataKey<T>(data: T, dataKey: DataKey<T>): unknown {
	if (data == null) return undefined;

	if (typeof dataKey === 'function') {
		try {
			return dataKey(data);
		} catch {
			return undefined;
		}
	}
	if (typeof dataKey === 'number') {
		return Array.isArray(data) ? data[dataKey] : undefined;
	}
	return (data as Record<string, unknown>)[dataKey];
}

/**
 * Helper to get unique values from data array using DataKey
 */
export function getUniqueValues<T>(data: ChartData<T>, dataKey: DataKey<T>): unknown[] {
	return Array.from(new Set(data.map((item) => getValueByDataKey(item, dataKey))));
}

/**
 * Helper to calculate domain from data
 */
export function calculateDomain<T>(
	data: ChartData<T>,
	dataKey: DataKey<T>,
	type: AxisType = 'number',
): [number | Date, number | Date] {
	if (type === 'category') {
		return [0, data.length - 1];
	}

	const values = data.map((item) => getValueByDataKey(item, dataKey)).filter((v) => v != null);

	if (type === 'time') {
		return [d3.min(values as Date[]) as Date, d3.max(values as Date[]) as Date];
	}

	return [d3.min(values as number[]) as number, d3.max(values as number[]) as number];
}

// =============================================================================
// Template Context Types for Custom Rendering
// =============================================================================

/**
 * Context for customizing individual legend items
 */
export interface LegendItemContext {
	/** The legend item (same as item) */
	$implicit: LegendItem;
	/** The legend item */
	item: LegendItem;
	/** Index of the item in the legend */
	index: number;
	/** Whether this is the first item */
	first: boolean;
	/** Whether this is the last item */
	last: boolean;
	/** Click handler to toggle the item */
	onClick: () => void;
}

/**
 * Context for customizing legend icons only
 */
export interface LegendIconContext {
	/** The legend item (same as $implicit) */
	$implicit: LegendItem;
	/** Size of the icon in pixels */
	iconSize: number;
	/** Color of the icon */
	color: string;
	/** Type of the legend item (line, rect, circle, etc.) */
	type: string;
}

/**
 * Context for fully customizing the entire legend
 */
export interface LegendContext {
	/** All legend items (same as items) */
	$implicit: LegendItem[];
	/** All legend items */
	items: LegendItem[];
	/** Layout direction */
	layout: 'horizontal' | 'vertical';
	/** Horizontal alignment */
	align: HorizontalAlign;
	/** Icon size in pixels */
	iconSize: number;
	/** Click handler for legend items */
	onItemClick: (item: LegendItem) => void;
}

/**
 * Context for fully customizing the tooltip content
 */
export interface TooltipContext<T = unknown> {
	/** The tooltip state (same as state) */
	$implicit: TooltipState<T>;
	/** The full tooltip state */
	state: TooltipState<T>;
	/** The label (category) for the hovered data point */
	label: string | number;
	/** Array of data series values at this point */
	payload: TooltipPayload<T>[];
	/** Position of the tooltip */
	position: { x: number; y: number };
	/** Whether the tooltip is active */
	active: boolean;
}

/**
 * Context for customizing individual tooltip items
 */
export interface TooltipItemContext<T = unknown> {
	/** The tooltip payload item (same as item) */
	$implicit: TooltipPayload<T>;
	/** The tooltip payload item */
	item: TooltipPayload<T>;
	/** Index of the item in the payload */
	index: number;
	/** Separator string between name and value */
	separator: string;
	/** Pre-formatted value string */
	formattedValue: string;
}

/**
 * Context for customizing just the tooltip label
 */
export interface TooltipLabelContext {
	/** The label value (same as label) */
	$implicit: string | number;
	/** The label (category) value */
	label: string | number;
}

/**
 * Tick information for heatmap legend
 */
export interface HeatmapLegendTick {
	/** The numeric value at this tick */
	value: number;
	/** Pre-formatted label string */
	formattedLabel: string;
	/** Position as percentage (0-100) along the gradient */
	percent: number;
	/** CSS styles for positioning the tick */
	style: Record<string, string>;
}

/**
 * Context for fully customizing the heatmap legend
 */
export interface HeatmapLegendContext {
	/** Array of ticks (same as ticks) */
	$implicit: HeatmapLegendTick[];
	/** Array of tick values and positions */
	ticks: HeatmapLegendTick[];
	/** Minimum value in the color scale */
	minValue: number;
	/** Maximum value in the color scale */
	maxValue: number;
	/** D3 color interpolator function */
	colorInterpolator: (t: number) => string;
	/** Whether the legend is vertical (right position) */
	isVertical: boolean;
	/** CSS gradient style for the legend bar */
	gradientStyle: string;
	/** Width of the gradient bar in pixels */
	width: number;
	/** Height of the gradient bar in pixels */
	height: number;
}

/**
 * Context for customizing individual heatmap legend ticks
 */
export interface HeatmapLegendTickContext {
	/** The tick (same as tick) */
	$implicit: HeatmapLegendTick;
	/** The tick data */
	tick: HeatmapLegendTick;
	/** Index of the tick */
	index: number;
}
