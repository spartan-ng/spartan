import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	afterNextRender,
	booleanAttribute,
	computed,
	contentChildren,
	effect,
	inject,
	input,
	numberAttribute,
	untracked,
	viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { SpnBar } from '../bar/bar';
import { SpnCartesianGrid } from '../cartesian-grid/cartesian-grid';
import { ChartContextService } from '../chart-context.service';
import { injectChartResponsiveSize } from '../chart-responsive-size';
import {
	anyElementHasHoverEffects,
	applyHoverEffect,
	clearTooltip,
	createBandScale,
	createHoverConfig,
	createLinearScale,
	findBarDataPoint,
	getHoverState,
	niceTicks,
	renderGrid,
	renderReferenceLines,
	renderXAxis,
	renderYAxis,
	updateTooltip,
} from '../chart-utils';
import { SpnReferenceLine } from '../reference-line/reference-line';
import {
	AxisType,
	BarLabelConfig,
	BarRadius,
	ChartData,
	ChartLayout,
	ChartMargin,
	DEFAULT_MARGIN,
	DataKey,
	Domain,
	Scale,
	StackOffset,
	calculateDomain,
	getValueByDataKey,
	isBandScale,
	isLinearScale,
} from '../types';
import { SpnXAxis } from '../x-axis/x-axis';
import { SpnYAxis } from '../y-axis/y-axis';

@Component({
	selector: 'spn-bar-chart',
	host: {
		'[attr.title]': 'null',
	},
	template: `
		<svg #svgElement [attr.width]="chartWidth()" [attr.height]="chartHeight()" class="spn-bar-chart">
			<g [attr.transform]="'translate(' + marginLeft + ',' + marginTop + ')'">
				<!-- Content projection for config components (hidden) -->
				<ng-content />

				<!-- Rendered layers (created by this component) -->
				<g class="grid-layer"></g>
				<g class="reference-lines-back"></g>
				<g class="axes-layer"></g>
				<g class="bars-layer"></g>
				<g class="labels-layer"></g>
				<g class="reference-lines-front"></g>

				<!-- Interaction layer for mouse events -->
				<rect
					#interactionLayer
					class="interaction-layer"
					[attr.width]="innerWidth"
					[attr.height]="innerHeight"
					fill="transparent"
					(mousemove)="onChartMouseMove($event)"
					(mouseleave)="onChartMouseLeave()"
				/>
			</g>
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

			.spn-bar-chart {
				font-family: sans-serif;
				display: block;
			}

			.interaction-layer {
				cursor: default;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [ChartContextService],
})
export class SpnBarChart<T = unknown> {
	// Signal-based inputs
	readonly data = input.required<ChartData<T>>();
	readonly width = input(600, { transform: numberAttribute });
	readonly height = input(400, { transform: numberAttribute });
	readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
	readonly layout = input<ChartLayout>('vertical');
	readonly responsive = input(true, { transform: booleanAttribute });
	// Show the tooltip for this data index by default (recharts `defaultIndex`). -1 = off.
	readonly defaultIndex = input(-1, { transform: numberAttribute });

	// Bar spacing configuration
	readonly barGap = input(4, { transform: numberAttribute });

	// Stack configuration
	readonly stackOffset = input<StackOffset>('none');

	// View references
	readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgElement');

	// Content children - config components
	readonly xAxes = contentChildren(SpnXAxis);
	readonly yAxes = contentChildren(SpnYAxis);
	readonly bars = contentChildren(SpnBar);
	readonly grids = contentChildren(SpnCartesianGrid);
	readonly referenceLines = contentChildren(SpnReferenceLine);

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
	private gridLayer?: SVGGElement;
	private referenceLinesBackLayer?: SVGGElement;
	private axesLayer?: SVGGElement;
	private barsLayer?: SVGGElement;
	private labelsLayer?: SVGGElement;
	private referenceLinesFrontLayer?: SVGGElement;

	// Hover state tracking
	private activeBarIndex = -1;

	constructor() {
		// Single consolidated effect for syncing and rendering
		effect(() => {
			// Sync validated inputs to context service
			this.chartContext.data.set(this.data());
			this.chartContext.width.set(this.validatedWidth());
			this.chartContext.height.set(this.validatedHeight());
			this.chartContext.margin.set(this.validatedMargin());
			this.chartContext.layout.set(this.layout());

			// Track child changes to trigger re-render
			this.xAxes();
			this.yAxes();
			this.bars();
			this.grids();
			this.referenceLines();

			this.render();
		});

		afterNextRender(() => this.setupLayers());
	}

	private setupLayers(): void {
		const svg = this.svgRef()?.nativeElement;
		if (!svg) return;

		this.gridLayer = svg.querySelector('.grid-layer') as SVGGElement;
		this.referenceLinesBackLayer = svg.querySelector('.reference-lines-back') as SVGGElement;
		this.axesLayer = svg.querySelector('.axes-layer') as SVGGElement;
		this.barsLayer = svg.querySelector('.bars-layer') as SVGGElement;
		this.labelsLayer = svg.querySelector('.labels-layer') as SVGGElement;
		this.referenceLinesFrontLayer = svg.querySelector('.reference-lines-front') as SVGGElement;
	}

	private render(): void {
		try {
			if (!this.axesLayer || !this.barsLayer || !this.gridLayer) {
				this.setupLayers();
				if (!this.axesLayer || !this.barsLayer || !this.gridLayer) return;
			}

			const data = this.data();

			// Clear previous renders first so emptying the data also clears the chart.
			d3.select(this.gridLayer).selectAll('*').remove();
			if (this.referenceLinesBackLayer) {
				d3.select(this.referenceLinesBackLayer).selectAll('*').remove();
			}
			d3.select(this.axesLayer).selectAll('*').remove();
			d3.select(this.barsLayer).selectAll('*').remove();
			if (this.labelsLayer) {
				d3.select(this.labelsLayer).selectAll('*').remove();
			}
			if (this.referenceLinesFrontLayer) {
				d3.select(this.referenceLinesFrontLayer).selectAll('*').remove();
			}

			if (!data.length) return;

			// Render in correct z-order
			this.renderAxes();
			this.ensureDefaultValueScale();
			this.renderGrid();
			this.renderReferenceLines(false);
			this.renderBars();
			this.renderReferenceLines(true);

			// Show the default tooltip once drawn, unless the user is actively hovering.
			// untracked: showTooltipForIndex reads the x/y scale signals this effect just wrote.
			if (this.activeBarIndex === -1) {
				untracked(() => this.applyDefaultTooltip());
			}
		} catch (error) {
			console.error('[SpnBarChart] Render error:', error);
		}
	}

	private renderAxes(): void {
		const data = this.data();
		const innerWidth = this.chartContext.innerWidth();
		const innerHeight = this.chartContext.innerHeight();
		const isHorizontal = this.layout() === 'horizontal';

		// Render X axes
		this.xAxes().forEach((xAxis) => {
			if (xAxis.hide()) return;

			let scale: Scale;
			if (isHorizontal) {
				// For horizontal layout, X-axis shows values (linear scale)
				// Calculate domain from bars' values
				const domain = this.calculateValueAxisDomain(data, xAxis.domain());
				scale = createLinearScale(domain, innerWidth, false);
			} else {
				// For vertical layout, X-axis shows categories (band scale)
				scale = createBandScale(data, xAxis.dataKey(), innerWidth);
			}

			this.chartContext.registerXScale(scale, xAxis.axisId());
			renderXAxis(this.axesLayer!, xAxis, scale, innerHeight);
		});

		// Render Y axes
		this.yAxes().forEach((yAxis) => {
			if (yAxis.hide()) return;

			let scale: Scale;

			if (isHorizontal) {
				// For horizontal layout, Y-axis shows categories (band scale). recharts
				// orders the first category at the top, so do NOT reverse the range.
				scale = createBandScale(data, yAxis.dataKey(), innerHeight, false);
			} else {
				// For vertical layout, Y-axis shows values (linear scale)
				const domain = this.calculateValueAxisDomain(data, yAxis.domain());
				scale = createLinearScale(domain, innerHeight, true);
			}

			this.chartContext.registerYScale(scale, yAxis.axisId());
			renderYAxis(this.axesLayer!, yAxis, scale, innerWidth);
		});
	}

	// recharts-style nice ticks for the value axis when no explicit axis is
	// declared, shared with the grid so its lines match.
	private defaultValueTicks?: number[];

	/**
	 * shadcn bar charts declare no value axis, so synthesize one (recharts-nice
	 * domain) when the relevant axis is missing - otherwise there's no value
	 * scale and the bars can't be positioned.
	 */
	private ensureDefaultValueScale(): void {
		this.defaultValueTicks = undefined;
		const isHorizontal = this.layout() === 'horizontal';
		const hasX = this.xAxes().some((a) => a.axisId() === 'default' && !a.hide());
		const hasY = this.yAxes().some((a) => a.axisId() === 'default' && !a.hide());
		const valueAxisMissing = isHorizontal ? !hasX : !hasY;
		if (!valueAxisMissing) return;

		const [min, max] = this.calculateValueAxisDomain(this.data(), ['auto', 'auto']);
		const ticks = niceTicks(min, max, 5);
		const niceDomain: [number, number] = [ticks[0], ticks[ticks.length - 1]];
		this.defaultValueTicks = ticks;

		if (isHorizontal) {
			const scale = createLinearScale(niceDomain, this.chartContext.innerWidth(), false);
			this.chartContext.registerXScale(scale, 'default');
		} else {
			const scale = createLinearScale(niceDomain, this.chartContext.innerHeight(), true);
			this.chartContext.registerYScale(scale, 'default');
		}
	}

	private calculateAxisDomain(
		data: ChartData<T>,
		dataKey: DataKey<T>,
		type: AxisType,
		domainInput: Domain,
	): [number | string | Date, number | string | Date] {
		if (domainInput[0] !== 'auto' && domainInput[0] !== 'dataMin') {
			return domainInput as [number | string | Date, number | string | Date];
		}

		if (!dataKey) {
			return type === 'category' ? [0, data.length - 1] : [0, 100];
		}

		return calculateDomain(data, dataKey, type);
	}

	private calculateValueAxisDomain(data: ChartData<T>, domainInput: Domain): [number, number] {
		if (domainInput[0] !== 'auto' && domainInput[0] !== 'dataMin') {
			return domainInput as [number, number];
		}

		const visibleBars = this.bars().filter((bar) => !bar.hide());
		const stackGroups = this.getStackGroups(visibleBars);
		const nonStackedBars = visibleBars.filter((bar) => !bar.stackId());

		let minValue = 0;
		let maxValue = 0;

		// Calculate domain from stacked bars - need to sum all values in each stack
		stackGroups.forEach((stackBars) => {
			data.forEach((d) => {
				let positiveSum = 0;
				let negativeSum = 0;
				stackBars.forEach((bar) => {
					const value = (getValueByDataKey(d, bar.dataKey()) as number) || 0;
					if (value >= 0) {
						positiveSum += value;
					} else {
						negativeSum += value;
					}
				});
				maxValue = Math.max(maxValue, positiveSum);
				minValue = Math.min(minValue, negativeSum);
			});
		});

		// Calculate domain from non-stacked bars
		nonStackedBars.forEach((bar) => {
			data.forEach((d) => {
				const value = (getValueByDataKey(d, bar.dataKey()) as number) || 0;
				maxValue = Math.max(maxValue, value);
				minValue = Math.min(minValue, value);
			});
		});

		// Ensure domain starts at 0 for bar charts (unless there are negative values)
		return [Math.min(0, minValue), maxValue];
	}

	private getStackGroups(bars: readonly SpnBar[]): Map<string, SpnBar[]> {
		const stackGroups = new Map<string, SpnBar[]>();

		bars.forEach((bar) => {
			const stackId = bar.stackId();
			if (stackId) {
				const group = stackGroups.get(stackId) || [];
				group.push(bar);
				stackGroups.set(stackId, group);
			}
		});

		return stackGroups;
	}

	private renderBars(): void {
		const data = this.data();
		const visibleBars = this.bars().filter((bar) => !bar.hide());
		const isHorizontal = this.layout() === 'horizontal';

		const stackGroups = this.getStackGroups(visibleBars);
		const nonStackedBars = visibleBars.filter((bar) => !bar.stackId());

		// Calculate total series count for grouped bars
		const totalSeries = nonStackedBars.length + stackGroups.size;

		// Render stacked bars
		stackGroups.forEach((stackBars) => {
			this.renderStackedBars(data, stackBars, totalSeries, isHorizontal);
		});

		// Render non-stacked (grouped) bars
		if (nonStackedBars.length > 0) {
			this.renderGroupedBars(data, nonStackedBars, totalSeries, isHorizontal);
		}
	}

	private renderStackedBars(data: ChartData<T>, stackBars: SpnBar[], totalSeries: number, isHorizontal: boolean): void {
		if (!this.barsLayer) return;

		const xScale = this.chartContext.xScale();
		const yScale = this.chartContext.yScale();
		if (!xScale || !yScale) return;

		// Get category dataKey from the correct axis based on layout
		const categoryDataKey = isHorizontal ? this.yAxes()[0]?.dataKey() || '' : this.xAxes()[0]?.dataKey() || '';

		// Get the band scale based on layout
		const bandScale = isHorizontal ? yScale : xScale;
		if (!isBandScale(bandScale)) return;

		const bandwidth = bandScale.bandwidth();
		const barGap = this.barGap();
		const barWidth = Math.max(0, (bandwidth - barGap * (totalSeries - 1)) / totalSeries);

		// Track cumulative values for stacking
		const cumulativeValues = new Map<number, number>();

		stackBars.forEach((bar) => {
			if (!this.barsLayer) return;
			const barsGroup = d3.select(this.barsLayer).append('g').attr('class', `bars-${bar.dataKey()}`);

			data.forEach((d, i) => {
				const value = getValueByDataKey(d, bar.dataKey()) as number;
				if (value === null || value === undefined) return;

				const category = String(getValueByDataKey(d, categoryDataKey));
				const cumulative = cumulativeValues.get(i) || 0;
				cumulativeValues.set(i, cumulative + value);

				let x: number, y: number, width: number, height: number;

				if (isHorizontal && isLinearScale(xScale)) {
					x = xScale(cumulative);
					y = bandScale(category) || 0;
					width = xScale(cumulative + value) - xScale(cumulative);
					height = barWidth;
				} else if (!isHorizontal && isLinearScale(yScale)) {
					x = bandScale(category) || 0;
					y = yScale(cumulative + value);
					width = barWidth;
					height = yScale(cumulative) - yScale(cumulative + value);
				} else {
					return; // Skip if scales don't match expected types
				}

				this.renderBarRect(barsGroup, bar, x, y, width, height, i);
			});
		});
	}

	private renderGroupedBars(data: ChartData<T>, bars: SpnBar[], totalSeries: number, isHorizontal: boolean): void {
		if (!this.barsLayer) return;

		const xScale = this.chartContext.xScale();
		const yScale = this.chartContext.yScale();
		if (!xScale || !yScale) return;

		// Get category dataKey from the correct axis based on layout
		const categoryDataKey = isHorizontal ? this.yAxes()[0]?.dataKey() || '' : this.xAxes()[0]?.dataKey() || '';

		// Get the band scale based on layout
		const bandScale = isHorizontal ? yScale : xScale;
		if (!isBandScale(bandScale)) return;

		const bandwidth = bandScale.bandwidth();
		const barGap = this.barGap();
		const barWidth = Math.max(0, (bandwidth - barGap * (totalSeries - 1)) / totalSeries);

		bars.forEach((bar, barIndex) => {
			if (!this.barsLayer) return;
			const barsGroup = d3.select(this.barsLayer).append('g').attr('class', `bars-${bar.dataKey()}`);

			data.forEach((d, i) => {
				const value = getValueByDataKey(d, bar.dataKey()) as number;
				if (value === null || value === undefined) return;

				const category = String(getValueByDataKey(d, categoryDataKey));
				const offset = barIndex * (barWidth + barGap);

				let x: number, y: number, width: number, height: number;

				if (isHorizontal && isLinearScale(xScale)) {
					// Support negative values (bar grows left of the zero line).
					x = Math.min(xScale(0), xScale(value));
					y = (bandScale(category) || 0) + offset;
					width = Math.abs(xScale(value) - xScale(0));
					height = barWidth;
				} else if (!isHorizontal && isLinearScale(yScale)) {
					x = (bandScale(category) || 0) + offset;
					y = Math.min(yScale(0), yScale(value));
					width = barWidth;
					height = Math.abs(yScale(0) - yScale(value));
				} else {
					return; // Skip if scales don't match expected types
				}

				// recharts colours each cell from a `fill` field on the data row.
				const cellFill = (d as Record<string, unknown>)?.['fill'] as string | undefined;
				this.renderBarRect(barsGroup, bar, x, y, width, height, i, cellFill);
				const labelCfg = bar.label();
				if (labelCfg) {
					const configs = Array.isArray(labelCfg) ? labelCfg : typeof labelCfg === 'object' ? [labelCfg] : [{}];
					configs.forEach((c) => this.renderBarLabel(bar, c, x, y, width, height, value, i, isHorizontal, d, cellFill));
				}
			});
		});
	}

	/** Renders a value label for a bar (recharts LabelList) into the labels layer. */
	private renderBarLabel(
		bar: SpnBar,
		config: BarLabelConfig,
		x: number,
		y: number,
		width: number,
		height: number,
		value: number,
		index: number,
		isHorizontal: boolean,
		d?: T,
		cellFill?: string,
	): void {
		if (!this.labelsLayer) return;
		const offset = config.offset ?? 5;
		const fontSize = config.fontSize ?? 12;
		// Default to the bar's own colour (recharts LabelList inherits the cell fill).
		const fill = config.fill ?? cellFill ?? 'currentColor';
		// A label can show another field of the row (recharts LabelList dataKey).
		const raw = config.dataKey && d !== undefined ? getValueByDataKey(d, config.dataKey) : value;
		const text = config.formatter ? config.formatter(value, index) : String(raw);
		const position = config.position ?? (isHorizontal ? 'right' : 'top');

		const t = d3.select(this.labelsLayer).append('text').text(text);
		if (position === 'insideLeft') {
			t.attr('x', x + offset)
				.attr('y', y + height / 2)
				.attr('text-anchor', 'start')
				.attr('dominant-baseline', 'central');
		} else if (position === 'right') {
			t.attr('x', x + width + offset)
				.attr('y', y + height / 2)
				.attr('text-anchor', 'start')
				.attr('dominant-baseline', 'central');
		} else {
			// 'top': above the bar for positive values, below it for negative values
			// (recharts places the label past the bar's value end either way).
			t.attr('x', x + width / 2).attr('text-anchor', 'middle');
			if (value < 0) {
				t.attr('y', y + height + offset).attr('dominant-baseline', 'hanging');
			} else {
				t.attr('y', y - offset);
			}
		}
		t.style('font-size', `${fontSize}px`).style('fill', fill);
	}

	/** Highlight the active bar (recharts active shape): dimmed fill + dashed stroke in its colour. */
	private applyActiveStyle(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		sel: d3.Selection<any, unknown, null, undefined>,
		bar: SpnBar,
		index: number,
		fill: string,
	): void {
		if (index !== bar.activeIndex()) return;
		sel.attr('fill-opacity', bar.activeFillOpacity()).attr('stroke', fill);
		const dash = bar.activeStrokeDasharray();
		if (dash) sel.attr('stroke-dasharray', dash).attr('stroke-width', 1);
	}

	private renderBarRect(
		group: d3.Selection<SVGGElement, unknown, null, undefined>,
		bar: SpnBar,
		x: number,
		y: number,
		width: number,
		height: number,
		index: number,
		fillOverride?: string,
	): void {
		const radius = bar.radius();
		const [topLeft, topRight, bottomRight, bottomLeft] = this.parseRadius(radius);
		const hasVariableRadius = topLeft !== topRight || topRight !== bottomRight || bottomRight !== bottomLeft;
		const hasAnyRadius = topLeft > 0 || topRight > 0 || bottomRight > 0 || bottomLeft > 0;

		// Use path for variable radius, rect for uniform or no radius
		if (hasVariableRadius && hasAnyRadius) {
			this.renderBarPath(
				group,
				bar,
				x,
				y,
				width,
				height,
				index,
				[topLeft, topRight, bottomRight, bottomLeft],
				fillOverride,
			);
		} else {
			this.renderBarRectSimple(group, bar, x, y, width, height, index, topLeft, fillOverride);
		}
	}

	private renderBarRectSimple(
		group: d3.Selection<SVGGElement, unknown, null, undefined>,
		bar: SpnBar,
		x: number,
		y: number,
		width: number,
		height: number,
		index: number,
		radius: number,
		fillOverride?: string,
	): void {
		const rect = group.append('rect');
		const fill = fillOverride ?? bar.fill();

		rect
			.attr('class', `bar bar-${index}`)
			.attr('data-base-fill', fill)
			.attr('x', x)
			.attr('y', y)
			.attr('fill', fill)
			.attr('opacity', 1)
			.style('cursor', 'pointer');

		const stroke = bar.stroke();
		if (stroke) {
			rect.attr('stroke', stroke).attr('stroke-width', bar.strokeWidth());
		}

		if (radius > 0) {
			rect.attr('rx', radius).attr('ry', radius);
		}

		this.applyActiveStyle(rect, bar, index, fill);

		// Animation
		if (bar.isAnimationActive() && this.chartSize.isAnimationActive()) {
			const isHorizontal = this.layout() === 'horizontal';
			if (isHorizontal) {
				rect
					.attr('width', 0)
					.attr('height', height)
					.transition()
					.duration(bar.animationDuration())
					.ease(d3.easeQuadOut)
					.attr('width', width);
			} else {
				rect
					.attr('width', width)
					.attr('height', 0)
					.attr('y', y + height)
					.transition()
					.duration(bar.animationDuration())
					.ease(d3.easeQuadOut)
					.attr('height', height)
					.attr('y', y);
			}
		} else {
			rect.attr('width', width).attr('height', height);
		}
	}

	private renderBarPath(
		group: d3.Selection<SVGGElement, unknown, null, undefined>,
		bar: SpnBar,
		x: number,
		y: number,
		width: number,
		height: number,
		index: number,
		radii: [number, number, number, number],
		fillOverride?: string,
	): void {
		const path = group.append('path');
		const [tl, tr, br, bl] = radii;
		const fill = fillOverride ?? bar.fill();

		path
			.attr('class', `bar bar-${index}`)
			.attr('data-base-fill', fill)
			.attr('fill', fill)
			.attr('opacity', 1)
			.style('cursor', 'pointer');

		const stroke = bar.stroke();
		if (stroke) {
			path.attr('stroke', stroke).attr('stroke-width', bar.strokeWidth());
		}

		this.applyActiveStyle(path, bar, index, fill);

		const createRoundedRectPath = (w: number, h: number, yOffset: number): string => {
			// Clamp radii to half the width/height
			const maxRadiusX = w / 2;
			const maxRadiusY = h / 2;
			const rtl = Math.min(tl, maxRadiusX, maxRadiusY);
			const rtr = Math.min(tr, maxRadiusX, maxRadiusY);
			const rbr = Math.min(br, maxRadiusX, maxRadiusY);
			const rbl = Math.min(bl, maxRadiusX, maxRadiusY);

			return `
        M ${x + rtl} ${yOffset}
        L ${x + w - rtr} ${yOffset}
        Q ${x + w} ${yOffset} ${x + w} ${yOffset + rtr}
        L ${x + w} ${yOffset + h - rbr}
        Q ${x + w} ${yOffset + h} ${x + w - rbr} ${yOffset + h}
        L ${x + rbl} ${yOffset + h}
        Q ${x} ${yOffset + h} ${x} ${yOffset + h - rbl}
        L ${x} ${yOffset + rtl}
        Q ${x} ${yOffset} ${x + rtl} ${yOffset}
        Z
      `;
		};

		// Animation
		if (bar.isAnimationActive() && this.chartSize.isAnimationActive()) {
			const isHorizontal = this.layout() === 'horizontal';
			if (isHorizontal) {
				// Animate width from 0
				path.attr('d', createRoundedRectPath(0, height, y));
				path
					.transition()
					.duration(bar.animationDuration())
					.ease(d3.easeQuadOut)
					.attr('d', createRoundedRectPath(width, height, y));
			} else {
				// Animate height from 0 (growing upward)
				path.attr('d', createRoundedRectPath(width, 0, y + height));
				path
					.transition()
					.duration(bar.animationDuration())
					.ease(d3.easeQuadOut)
					.attr('d', createRoundedRectPath(width, height, y));
			}
		} else {
			path.attr('d', createRoundedRectPath(width, height, y));
		}
	}

	private parseRadius(radius: BarRadius): [number, number, number, number] {
		if (typeof radius === 'number') {
			return [radius, radius, radius, radius];
		}
		return radius;
	}

	get innerWidth(): number {
		return this.chartContext.innerWidth();
	}

	get innerHeight(): number {
		return this.chartContext.innerHeight();
	}

	get marginLeft(): number {
		return this.validatedMargin().left;
	}

	get marginTop(): number {
		return this.validatedMargin().top;
	}

	// Grid rendering
	private renderGrid(): void {
		if (!this.gridLayer) return;

		const grids = this.grids();
		if (grids.length === 0) return;

		const grid = grids[0];
		const innerWidth = this.chartContext.innerWidth();
		const innerHeight = this.chartContext.innerHeight();
		const xScale = this.chartContext.xScale();
		const yScale = this.chartContext.yScale();

		if (!xScale || !yScale) return;

		const isHorizontal = this.layout() === 'horizontal';
		renderGrid(
			this.gridLayer,
			grid,
			innerWidth,
			innerHeight,
			xScale,
			yScale,
			isHorizontal ? undefined : this.defaultValueTicks,
		);
	}

	// Reference line rendering
	private renderReferenceLines(isFront: boolean): void {
		const layer = isFront ? this.referenceLinesFrontLayer : this.referenceLinesBackLayer;
		if (!layer) return;

		const innerWidth = this.chartContext.innerWidth();
		const innerHeight = this.chartContext.innerHeight();

		renderReferenceLines(
			layer,
			this.referenceLines(),
			innerWidth,
			innerHeight,
			this.chartContext as ChartContextService<any>,
			isFront,
		);
	}

	// Mouse interaction handlers
	onChartMouseMove(event: MouseEvent): void {
		if (!this.barsLayer) return;

		const [mouseX, mouseY] = d3.pointer(event, this.barsLayer);
		const data = this.data();
		const xScale = this.chartContext.xScale();
		const yScale = this.chartContext.yScale();
		const isHorizontal = this.layout() === 'horizontal';

		if (!xScale || !yScale || data.length === 0) return;

		// Get category dataKey from the correct axis based on layout
		const categoryDataKey = isHorizontal ? this.yAxes()[0]?.dataKey() || '' : this.xAxes()[0]?.dataKey() || '';

		const bandScale = (isHorizontal ? yScale : xScale) as d3.ScaleBand<string>;
		const mousePos = isHorizontal ? mouseY : mouseX;

		const result = findBarDataPoint(mousePos, data, bandScale, categoryDataKey);
		if (!result) {
			clearTooltip(this.chartContext as ChartContextService<any>);
			this.chartContext.clearHoverState();
			if (this.activeBarIndex !== -1) {
				this.activeBarIndex = -1;
				if (this.hasHoverEffectsConfigured()) {
					this.updateHoverStyles();
				}
			}
			return;
		}

		const { dataIndex } = result;
		this.showTooltipForIndex(dataIndex, isHorizontal ? mouseX : mouseY);
	}

	/**
	 * Build and show the tooltip for a data index. Used by hover and by `defaultIndex`.
	 * `crossPos` is the mouse coordinate along the value axis (mouseY for vertical bars);
	 * when omitted (the default tooltip), it is derived from the top of the stacked bar.
	 */
	private showTooltipForIndex(dataIndex: number, crossPos?: number): void {
		const data = this.data();
		const dataPoint = data[dataIndex];
		if (!dataPoint) return;

		const isHorizontal = this.layout() === 'horizontal';
		const xScale = this.chartContext.xScale();
		const yScale = this.chartContext.yScale();
		if (!xScale || !yScale) return;

		const categoryDataKey = isHorizontal ? this.yAxes()[0]?.dataKey() || '' : this.xAxes()[0]?.dataKey() || '';
		const bandScale = (isHorizontal ? yScale : xScale) as d3.ScaleBand<string>;
		const valueScale = (isHorizontal ? xScale : yScale) as d3.ScaleLinear<number, number>;

		// Update hover state for visual feedback
		this.chartContext.setHoverState({ activeDataIndex: dataIndex, elementType: 'bar' });
		if (this.activeBarIndex !== dataIndex) {
			this.activeBarIndex = dataIndex;
			if (this.hasHoverEffectsConfigured()) {
				this.updateHoverStyles();
			}
		}

		const category = String(getValueByDataKey(dataPoint, categoryDataKey));
		const bandPos = bandScale(category) || 0;
		const bandwidth = bandScale.bandwidth();

		const visibleBars = this.bars().filter((bar) => !bar.hide());

		// Derive a position along the value axis when no mouse coordinate is given (default tooltip):
		// float just above the bar - the stacked total for stacked bars, the tallest series otherwise.
		const seriesValues = visibleBars.map((bar) => Number(getValueByDataKey(dataPoint, bar.dataKey()) ?? 0));
		const isStacked = visibleBars.some((bar) => bar.stackId());
		const anchorValue = isStacked ? seriesValues.reduce((sum, v) => sum + v, 0) : Math.max(0, ...seriesValues);
		const valuePos = crossPos ?? valueScale(anchorValue);

		const position = isHorizontal
			? { x: valuePos, y: bandPos + bandwidth / 2 }
			: { x: bandPos + bandwidth / 2, y: valuePos };

		const payload = visibleBars.map((bar) => ({
			name: bar.name() || String(bar.dataKey()),
			value: getValueByDataKey(dataPoint, bar.dataKey()),
			dataKey: bar.dataKey(),
			color: ((dataPoint as Record<string, unknown>)?.['fill'] as string) || bar.fill(),
			payload: dataPoint,
		}));

		updateTooltip(
			this.chartContext as ChartContextService<any>,
			dataIndex,
			position,
			payload,
			category,
			this.marginLeft,
			this.marginTop,
			false,
			this.chartWidth(),
			this.chartHeight(),
			this.svgRef()?.nativeElement,
		);
	}

	/** Show the `defaultIndex` tooltip (if configured) when nothing is hovered. */
	private applyDefaultTooltip(): void {
		const index = this.defaultIndex();
		if (index < 0 || index >= this.data().length) return;
		this.showTooltipForIndex(index);
	}

	onChartMouseLeave(): void {
		this.chartContext.clearHoverState();
		if (this.activeBarIndex !== -1) {
			this.activeBarIndex = -1;
			if (this.hasHoverEffectsConfigured()) {
				this.updateHoverStyles();
			}
		}
		// Return to the default tooltip instead of clearing, matching recharts `defaultIndex`.
		if (this.defaultIndex() >= 0) {
			this.applyDefaultTooltip();
		} else {
			clearTooltip(this.chartContext as ChartContextService<any>);
		}
	}

	/**
	 * Check if any bar has hover effects configured
	 */
	private hasHoverEffectsConfigured(): boolean {
		return anyElementHasHoverEffects(this.bars(), (bar) => !bar.hide());
	}

	/**
	 * Update hover styles for all bars based on activeBarIndex
	 */
	private updateHoverStyles(): void {
		if (!this.barsLayer) return;

		const visibleBars = this.bars().filter((bar) => !bar.hide());
		if (visibleBars.length === 0) return;

		// Get hover configuration from the first bar
		const bar = visibleBars[0];
		const hoverConfig = createHoverConfig(bar);

		// Select all bar elements (both rect and path)
		const allBars = d3.select(this.barsLayer).selectAll<SVGElement, unknown>('.bar');

		allBars.each((_, i, nodes) => {
			const element = d3.select(nodes[i]);
			const barIndex = this.getBarDataIndex(element);

			// Get the base fill from data attribute - REQUIRED for proper restoration
			const baseFill = element.attr('data-base-fill');
			if (!baseFill) {
				return;
			}

			const state = getHoverState(barIndex, this.activeBarIndex, bar.dimOthers());
			applyHoverEffect(element, state, baseFill, hoverConfig);
		});
	}

	/**
	 * Extract data index from bar element class
	 */
	private getBarDataIndex(element: d3.Selection<SVGElement, unknown, null, undefined>): number {
		const className = element.attr('class') || '';
		const match = className.match(/bar-(\d+)/);
		return match ? parseInt(match[1], 10) : -1;
	}
}
