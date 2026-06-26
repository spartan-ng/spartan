import {
	AfterContentInit,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChildren,
	effect,
	ElementRef,
	inject,
	input,
	numberAttribute,
	viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { ChartContextService } from '../chart-context.service';
import { injectChartResponsiveSize } from '../chart-responsive-size';
import {
	anyElementHasHoverEffects,
	applyPieHoverEffect,
	clearTooltip,
	createHoverConfig,
	getHoverState,
	updateTooltip,
} from '../chart-utils';
import { SpnPie } from '../pie/pie';
import {
	ChartData,
	ChartMargin,
	DataKey,
	DEFAULT_MARGIN,
	DEFAULT_PIE_COLORS,
	getValueByDataKey,
	PieLabelConfig,
	PieLabelLineConfig,
} from '../types';

interface PieArcData<T> {
	data: T;
	value: number;
	index: number;
	startAngle: number;
	endAngle: number;
	padAngle: number;
}

@Component({
	selector: 'spn-pie-chart',
	host: {
		'[attr.title]': 'null',
	},
	template: `
		<svg #svgElement [attr.width]="chartWidth()" [attr.height]="chartHeight()" class="spn-pie-chart">
			<!-- Content projection for config components (hidden) -->
			<ng-content />

			<!-- Centered group for pie -->
			<g [attr.transform]="'translate(' + centerX + ',' + centerY + ')'">
				<g class="pies-layer"></g>
				<g class="labels-layer"></g>
			</g>

			<!-- Interaction layer for mouse events -->
			<rect
				#interactionLayer
				class="interaction-layer"
				[attr.width]="chartWidth()"
				[attr.height]="chartHeight()"
				fill="transparent"
				(mousemove)="onChartMouseMove($event)"
				(mouseleave)="onChartMouseLeave()"
			/>
		</svg>
		<ng-content select="spn-legend" />
		<ng-content select="spn-tooltip" />
	`,
	styles: [
		`
			:host {
				display: block;
				position: relative;
				width: 100%;
			}

			.spn-pie-chart {
				font-family: sans-serif;
				display: block;
			}

			.interaction-layer {
				cursor: pointer;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [ChartContextService],
})
export class SpnPieChart<T = unknown> implements AfterContentInit {
	// Signal-based inputs
	readonly data = input.required<ChartData<T>>();
	readonly width = input(400, { transform: numberAttribute });
	readonly height = input(400, { transform: numberAttribute });
	readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
	readonly responsive = input(true, { transform: booleanAttribute });

	// Center position (supports number or percentage string like '50%')
	readonly cx = input<string | number>('50%');
	readonly cy = input<string | number>('50%');

	// View references
	readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgElement');

	// Content children - config components
	readonly pies = contentChildren(SpnPie);

	private readonly chartContext = inject(ChartContextService<T>);
	private readonly chartSize = injectChartResponsiveSize(this.width, this.height, this.responsive);
	protected readonly chartWidth = this.chartSize.width;
	protected readonly chartHeight = this.chartSize.height;

	// Validated inputs with safe defaults
	private readonly validatedWidth = computed(() => Math.max(0, this.chartWidth()));
	private readonly validatedHeight = computed(() => Math.max(0, this.chartHeight()));
	private readonly validatedMargin = computed(() => {
		const m = this.margin();
		return {
			top: Math.max(0, m.top),
			right: Math.max(0, m.right),
			bottom: Math.max(0, m.bottom),
			left: Math.max(0, m.left),
		};
	});

	// SVG layer references
	private piesLayer?: SVGGElement;
	private labelsLayer?: SVGGElement;

	// Store arc data for hover detection
	private readonly arcDataMap: Map<
		number,
		{
			pieIndex: number;
			arcData: PieArcData<T>[];
			arcGenerator: d3.Arc<unknown, PieArcData<T>>;
			colors: string[];
			pie: SpnPie<T>;
		}
	> = new Map();

	// Hover state tracking
	private activeSliceIndex = -1;
	private activeSlicePieIndex = -1;

	constructor() {
		// Single consolidated effect for syncing and rendering
		effect(() => {
			// Sync validated inputs to context service
			this.chartContext.data.set(this.data());
			this.chartContext.width.set(this.validatedWidth());
			this.chartContext.height.set(this.validatedHeight());
			this.chartContext.margin.set(this.validatedMargin());

			// Track child changes to trigger re-render
			this.pies();

			this.render();
		});
	}

	ngAfterContentInit(): void {
		this.setupLayers();
	}

	private setupLayers(): void {
		const svg = this.svgRef()?.nativeElement;
		if (!svg) return;

		this.piesLayer = svg.querySelector('.pies-layer') as SVGGElement;
		this.labelsLayer = svg.querySelector('.labels-layer') as SVGGElement;
	}

	private render(): void {
		try {
			if (!this.piesLayer || !this.labelsLayer) {
				this.setupLayers();
				if (!this.piesLayer || !this.labelsLayer) return;
			}

			// Clear previous renders
			d3.select(this.piesLayer).selectAll('*').remove();
			d3.select(this.labelsLayer).selectAll('*').remove();
			this.arcDataMap.clear();
			// Drop last render's sector registrations so the legend doesn't accumulate duplicates.
			this.chartContext.clearGraphicalElementsByType('pie');

			// Render each pie
			this.pies().forEach((pie, pieIndex) => {
				if (pie.hide()) return;
				this.renderPie(pie as SpnPie<T>, pieIndex);
			});
		} catch (error) {
			console.error('[SpnPieChart] Render error:', error);
		}
	}

	private renderPie(pie: SpnPie<T>, pieIndex: number): void {
		// Get data for this pie (use pie's own data or chart's data)
		const pieData = (pie.data() as ChartData<T>) || this.data();
		if (!pieData.length) return;

		const width = this.validatedWidth();
		const height = this.validatedHeight();
		const margin = this.validatedMargin();

		// Calculate available radius
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;
		const maxRadius = Math.min(innerWidth, innerHeight) / 2;

		// Parse radius values
		const innerRadius = this.parseRadius(pie.innerRadius(), maxRadius);
		const outerRadius = this.parseRadius(pie.outerRadius(), maxRadius);

		// Create pie generator.
		// recharts lays slices out counter-clockwise from 3 o'clock (angle 0 = East, CCW positive),
		// whereas d3 starts at 12 o'clock going clockwise. Map recharts angles -> d3 with `90 - a`
		// so our slice order/direction matches the shadcn pies.
		const pieGenerator = d3
			.pie<T>()
			.value((d) => Number(getValueByDataKey(d, pie.dataKey())))
			.startAngle(this.degreesToRadians(90 - pie.startAngle()))
			.endAngle(this.degreesToRadians(90 - pie.endAngle()))
			.padAngle(this.degreesToRadians(pie.paddingAngle()))
			.sort(null);

		// Create arc generator
		const arcGenerator = d3
			.arc<PieArcData<T>>()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius)
			.cornerRadius(pie.cornerRadius());

		// Active "shape" for a highlighted sector: an enlarged sector plus a detached outer ring,
		// matching the recharts activeShape used in the shadcn interactive pie.
		const activeIndex = pie.activeIndex();
		const activeArcGenerator = d3
			.arc<PieArcData<T>>()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius + 6)
			.cornerRadius(pie.cornerRadius());
		const activeRingGenerator = d3
			.arc<PieArcData<T>>()
			.innerRadius(outerRadius + 12)
			.outerRadius(outerRadius + 25);

		// Generate arcs
		const arcs = pieGenerator(pieData) as unknown as PieArcData<T>[];

		// Get colors
		const colors = pie.colors() || DEFAULT_PIE_COLORS;

		// Store arc data for hover detection
		this.arcDataMap.set(pieIndex, {
			pieIndex,
			arcData: arcs,
			arcGenerator,
			colors,
			pie,
		});

		// Create a group for this pie
		const pieGroup = d3.select(this.piesLayer!).append('g').attr('class', `pie-${pieIndex}`);

		// Animation settings
		const isAnimationActive = pie.isAnimationActive() && this.chartSize.isAnimationActive();
		const animationDuration = pie.animationDuration();

		// Render arcs
		arcs.forEach((arc, i) => {
			const color = colors[i % colors.length];
			const isActive = i === activeIndex;
			const gen = isActive ? activeArcGenerator : arcGenerator;
			const path = pieGroup
				.append('path')
				.attr('class', `arc arc-${i}`)
				.attr('data-pie-index', pieIndex)
				.attr('data-arc-index', i)
				.attr('data-base-fill', color)
				.attr('data-base-stroke', pie.stroke())
				.attr('data-base-stroke-width', pie.strokeWidth())
				.attr('fill', color)
				.attr('stroke', pie.stroke())
				.attr('stroke-width', pie.strokeWidth())
				.attr('opacity', 1)
				.style('cursor', 'pointer');

			if (isAnimationActive) {
				// Animate from start angle to final position
				const interpolate = d3.interpolate(
					{ startAngle: arc.startAngle, endAngle: arc.startAngle },
					{ startAngle: arc.startAngle, endAngle: arc.endAngle },
				);

				path
					.transition('entry')
					.duration(animationDuration)
					.delay(i * 50)
					.attrTween('d', () => (t) => gen(interpolate(t) as PieArcData<T>) || '');
			} else {
				path.attr('d', gen(arc) || '');
			}

			// Detached outer ring for the active sector (opt-in).
			if (isActive && pie.activeRing()) {
				pieGroup
					.append('path')
					.attr('class', `arc-active-ring arc-active-ring-${i}`)
					.attr('fill', color)
					.attr('opacity', 1)
					.attr('d', activeRingGenerator(arc) || '');
			}
		});

		// Render labels if enabled
		const labelConfig = pie.label();
		if (labelConfig) {
			this.renderLabels(pie, arcs, arcGenerator, colors, pieIndex);
		}

		// Register pie sectors with chart context for legend
		this.registerPieSectors(pie, arcs, colors, pieIndex);
	}

	private renderLabels(
		pie: SpnPie<T>,
		arcs: PieArcData<T>[],
		arcGenerator: d3.Arc<unknown, PieArcData<T>>,
		colors: string[],
		pieIndex: number,
	): void {
		const labelConfig = pie.label();
		const config: PieLabelConfig = typeof labelConfig === 'boolean' ? {} : (labelConfig as PieLabelConfig);
		const position = config.position || 'inside';
		const offset = config.offset ?? 0;
		const fontSize = config.fontSize ?? 12;
		const fontWeight = config.fontWeight ?? 'normal';
		const formatter = config.formatter;
		const labelLineConfig = pie.labelLine();

		const labelsGroup = d3.select(this.labelsLayer!).append('g').attr('class', `labels-${pieIndex}`);

		// Calculate total for percentage
		const total = arcs.reduce((sum, arc) => sum + arc.value, 0);

		arcs.forEach((arc, i) => {
			const centroid = arcGenerator.centroid(arc);
			let labelX = centroid[0];
			let labelY = centroid[1];

			const nameKey = pie.nameKey();
			const name = nameKey ? String(getValueByDataKey(arc.data, nameKey)) : `Sector ${i + 1}`;
			const percent = total > 0 ? (arc.value / total) * 100 : 0;

			// Format label text
			let labelText: string;
			if (formatter) {
				labelText = formatter(arc.value, name, percent);
			} else {
				labelText = `${percent.toFixed(1)}%`;
			}

			// Calculate label position based on position type
			if (position === 'outside') {
				// Position label outside the arc
				const midAngle = (arc.startAngle + arc.endAngle) / 2;
				const outerRadius = (arcGenerator.outerRadius() as () => number)();
				const labelRadius = outerRadius + 20 + offset;
				labelX = Math.sin(midAngle) * labelRadius;
				labelY = -Math.cos(midAngle) * labelRadius;

				// Draw connector line if enabled
				if (labelLineConfig) {
					const lineConfig: PieLabelLineConfig = typeof labelLineConfig === 'boolean' ? {} : labelLineConfig;
					const lineStroke = lineConfig.stroke || colors[i % colors.length];
					const lineStrokeWidth = lineConfig.strokeWidth ?? 1;

					const outerPoint = [Math.sin(midAngle) * (outerRadius + 5), -Math.cos(midAngle) * (outerRadius + 5)];
					const labelPoint = [Math.sin(midAngle) * (labelRadius - 5), -Math.cos(midAngle) * (labelRadius - 5)];

					labelsGroup
						.append('line')
						.attr('class', `label-line label-line-${i}`)
						.attr('x1', outerPoint[0])
						.attr('y1', outerPoint[1])
						.attr('x2', labelPoint[0])
						.attr('y2', labelPoint[1])
						.attr('stroke', lineStroke)
						.attr('stroke-width', lineStrokeWidth);
				}
			} else if (position === 'center') {
				labelX = 0;
				labelY = 0;
			}
			// 'inside' position uses centroid (default)

			// Determine fill color
			let fill = config.fill;
			if (!fill && position === 'inside') {
				// Auto-contrast for inside labels
				fill = this.getContrastColor(colors[i % colors.length]);
			}
			fill = fill || '#333';

			labelsGroup
				.append('text')
				.attr('class', `label label-${i}`)
				.attr('x', labelX + offset * (position === 'outside' ? 0 : 1))
				.attr('y', labelY)
				.attr('text-anchor', position === 'outside' ? (labelX > 0 ? 'start' : 'end') : 'middle')
				.attr('dominant-baseline', 'central')
				.attr('fill', fill)
				.attr('font-size', fontSize)
				.attr('font-weight', fontWeight)
				.style('pointer-events', 'none')
				.text(labelText);
		});
	}

	private registerPieSectors(pie: SpnPie<T>, arcs: PieArcData<T>[], colors: string[], pieIndex: number): void {
		const nameKey = pie.nameKey();

		arcs.forEach((arc, i) => {
			const name = nameKey ? String(getValueByDataKey(arc.data, nameKey)) : pie.name() || `Sector ${i + 1}`;
			const color = colors[i % colors.length];

			this.chartContext.registerGraphicalElement({
				id: `pie-sector-${pieIndex}-${i}`,
				dataKey: pie.dataKey() as DataKey,
				name,
				color,
				type: 'pie',
				hide: false,
			});
		});
	}

	private parseRadius(value: string | number, maxRadius: number): number {
		if (typeof value === 'number') {
			return value;
		}
		if (typeof value === 'string' && value.endsWith('%')) {
			const percent = parseFloat(value) / 100;
			return maxRadius * percent;
		}
		return parseFloat(value) || 0;
	}

	private degreesToRadians(degrees: number): number {
		return (degrees * Math.PI) / 180;
	}

	private getContrastColor(backgroundColor: string): string {
		const color = d3.color(backgroundColor);
		if (!color) return '#000000';

		const rgb = color.rgb();
		const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
		return luminance > 0.5 ? '#000000' : '#ffffff';
	}

	// Calculate center position
	get centerX(): number {
		return this.parsePosition(this.cx(), this.validatedWidth());
	}

	get centerY(): number {
		return this.parsePosition(this.cy(), this.validatedHeight());
	}

	private parsePosition(value: string | number, dimension: number): number {
		if (typeof value === 'number') {
			return value;
		}
		if (typeof value === 'string' && value.endsWith('%')) {
			const percent = parseFloat(value) / 100;
			return dimension * percent;
		}
		return parseFloat(value) || dimension / 2;
	}

	// Mouse interaction handlers
	onChartMouseMove(event: MouseEvent): void {
		const svg = this.svgRef()?.nativeElement;
		if (!svg || this.arcDataMap.size === 0) return;

		// Get mouse position relative to chart center
		const [mouseX, mouseY] = d3.pointer(event, svg);
		const relX = mouseX - this.centerX;
		const relY = mouseY - this.centerY;

		// Convert to polar coordinates
		const distance = Math.sqrt(relX * relX + relY * relY);
		const angle = Math.atan2(relX, -relY); // 0 at 12 o'clock, clockwise

		// Find which arc the mouse is over
		for (const [pieIndex, { arcData, arcGenerator, colors, pie }] of this.arcDataMap) {
			const innerRadius = (arcGenerator.innerRadius() as () => number)();
			const outerRadius = (arcGenerator.outerRadius() as () => number)();
			// The active sector is rendered enlarged (see activeArcGenerator, +6), so its outer band
			// must still register as a hit.
			const activeIndex = pie.activeIndex();
			const maxOuter = activeIndex >= 0 ? outerRadius + 6 : outerRadius;

			// Check if within radius
			if (distance < innerRadius || distance > maxOuter) continue;

			// Check which arc
			for (let i = 0; i < arcData.length; i++) {
				const arc = arcData[i];
				// Sectors beyond the active one stop at the base radius.
				if (i !== activeIndex && distance > outerRadius) continue;
				// Normalise the pointer angle into this arc's range, handling both
				// winding directions (startAngle > endAngle for clockwise pies) and
				// 2pi wrapping.
				const lo = Math.min(arc.startAngle, arc.endAngle);
				const hi = Math.max(arc.startAngle, arc.endAngle);
				const twoPi = 2 * Math.PI;
				const a = ((((angle - lo) % twoPi) + twoPi) % twoPi) + lo;
				if (a >= lo && a <= hi) {
					// Found the arc
					const nameKey = pie.nameKey();
					const name = nameKey ? String(getValueByDataKey(arc.data, nameKey)) : pie.name() || `Sector ${i + 1}`;

					const payload = [
						{
							name,
							value: arc.value,
							dataKey: pie.dataKey(),
							color: colors[i % colors.length],
							payload: arc.data,
						},
					];

					// Update hover state for visual feedback
					this.chartContext.setHoverState({
						activeDataIndex: i,
						elementType: 'slice',
					});

					if (this.activeSliceIndex !== i || this.activeSlicePieIndex !== pieIndex) {
						this.activeSliceIndex = i;
						this.activeSlicePieIndex = pieIndex;
						if (this.hasHoverEffectsConfigured()) {
							this.updateHoverStyles();
						}
					}

					updateTooltip(
						this.chartContext as ChartContextService<T>,
						i,
						{ x: mouseX, y: mouseY },
						payload,
						name,
						0,
						0,
						false,
						this.chartWidth(),
						this.chartHeight(),
						svg,
					);
					return;
				}
			}
		}

		// Not over any arc
		clearTooltip(this.chartContext as ChartContextService<T>);
		this.chartContext.clearHoverState();
		if (this.activeSliceIndex !== -1) {
			this.activeSliceIndex = -1;
			this.activeSlicePieIndex = -1;
			if (this.hasHoverEffectsConfigured()) {
				this.updateHoverStyles();
			}
		}
	}

	onChartMouseLeave(): void {
		clearTooltip(this.chartContext as ChartContextService<T>);
		this.chartContext.clearHoverState();
		if (this.activeSliceIndex !== -1) {
			this.activeSliceIndex = -1;
			this.activeSlicePieIndex = -1;
			if (this.hasHoverEffectsConfigured()) {
				this.updateHoverStyles();
			}
		}
	}

	/**
	 * Check if any pie has hover effects configured
	 */
	private hasHoverEffectsConfigured(): boolean {
		for (const [, { pie }] of this.arcDataMap) {
			// Create a compatible object for the utility
			const inputs = {
				hoverFill: () => pie.hoverFill(),
				hoverStroke: () => pie.hoverStroke(),
				hoverStrokeWidth: () => pie.hoverStrokeWidth(),
				hoverOpacity: () => pie.hoverOpacity(),
				dimOthers: () => pie.dimOthers(),
				dimOpacity: () => pie.dimOpacity(),
				hoverTransitionDuration: () => pie.hoverTransitionDuration(),
				hoverExplodeOffset: () => pie.hoverExplodeOffset(),
			};
			if (anyElementHasHoverEffects([inputs], () => true)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Update hover styles for all pie slices based on activeSliceIndex
	 */
	private updateHoverStyles(): void {
		if (!this.piesLayer) return;

		// Process each pie
		for (const [pieIndex, { arcData, pie }] of this.arcDataMap) {
			const hoverConfig = createHoverConfig(pie);
			const explodeOffset = pie.hoverExplodeOffset();
			const baseStroke = pie.stroke();
			const baseStrokeWidth = pie.strokeWidth();

			// Select all arcs for this pie
			const pieGroup = d3.select(this.piesLayer).select(`.pie-${pieIndex}`);
			const allArcs = pieGroup.selectAll<SVGPathElement, unknown>('.arc');

			allArcs.each((_, i, nodes) => {
				const element = d3.select(nodes[i]);
				const arcIndex = parseInt(element.attr('data-arc-index'), 10);
				const arcPieIndex = parseInt(element.attr('data-pie-index'), 10);

				const baseFill = element.attr('data-base-fill');
				if (!baseFill) {
					return;
				}

				// Determine state - pie has special logic for same-pie dimming
				let state = getHoverState(arcIndex, this.activeSliceIndex, pie.dimOthers());

				// Special case: only dim slices in the same pie
				if (state === 'dimmed' && arcPieIndex !== this.activeSlicePieIndex) {
					state = 'normal';
				}

				// Also check if this is the active slice in this specific pie
				if (state === 'active' && arcPieIndex !== this.activeSlicePieIndex) {
					state = 'normal';
				}

				// Calculate explode transform for active slice
				let explodeTransform: string | undefined;
				if (state === 'active' && explodeOffset > 0) {
					const arc = arcData[arcIndex];
					const midAngle = (arc.startAngle + arc.endAngle) / 2;
					const dx = Math.sin(midAngle) * explodeOffset;
					const dy = -Math.cos(midAngle) * explodeOffset;
					explodeTransform = `translate(${dx},${dy})`;
				}

				applyPieHoverEffect(element, state, baseFill, hoverConfig, baseStroke, baseStrokeWidth, explodeTransform);
			});
		}
	}
}
