import {
	AfterContentInit,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChildren,
	effect,
	ElementRef,
	HostListener,
	inject,
	input,
	numberAttribute,
	viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { SpnArea } from '../area/area';
import { SpnCartesianGrid } from '../cartesian-grid/cartesian-grid';
import { ChartContextService } from '../chart-context.service';
import { injectChartResponsiveSize } from '../chart-responsive-size';
import {
	calculateAxisDomain,
	calculateDataPointPosition,
	calculateSeriesYDomain,
	clearTooltip,
	createXAccessor,
	createXScale,
	createYScale,
	findNearestDataPoint,
	getXPosition,
	niceTicks,
	renderGrid,
	renderReferenceLines,
	renderXAxis,
	renderYAxis,
	toSeriesConfig,
	updateTooltip,
} from '../chart-utils';
import { CURVE_MAP } from '../constants';
import { SpnReferenceLine } from '../reference-line/reference-line';
import { ChartData, ChartLayout, ChartMargin, DEFAULT_MARGIN, Domain, getValueByDataKey, Scale } from '../types';
import { SpnXAxis } from '../x-axis/x-axis';
import { SpnYAxis } from '../y-axis/y-axis';

// Unique-per-instance clip-path id (avoids collisions when multiple charts exist)
let areaClipCounter = 0;

@Component({
	selector: 'spn-area-chart',
	host: {
		'[attr.title]': 'null',
	},
	template: `
		<svg #svgElement [attr.width]="chartWidth()" [attr.height]="chartHeight()" class="spn-area-chart">
			<defs>
				<!-- Clip only below the baseline so a curve overshoot can't invert the
             fill; the top/sides stay open so peaks and strokes aren't shaved. -->
				<clipPath [attr.id]="clipId">
					<rect x="-50" y="-2000" [attr.width]="innerWidth + 100" [attr.height]="innerHeight + 2000" />
				</clipPath>
				<!-- Reveal clip for the left-to-right entrance wipe. Width is driven
             imperatively (d3), never bound, so the transition isn't clobbered by
             change detection. Defaults wide open so non-animated renders show. -->
				<clipPath [attr.id]="revealId">
					<rect #revealRect x="0" y="-2000" width="100000" [attr.height]="innerHeight + 2000" />
				</clipPath>
				<!-- Per-area vertical fill gradients (shadcn-style 0.8 -> 0.1 fade). -->
				@for (area of areas(); track area; let i = $index) {
					@if (area.fillGradient()) {
						<linearGradient [attr.id]="clipId + '-g' + i" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" [attr.stop-color]="area.fill()" stop-opacity="0.8" />
							<stop offset="95%" [attr.stop-color]="area.fill()" stop-opacity="0.1" />
						</linearGradient>
					}
				}
			</defs>
			<g [attr.transform]="'translate(' + marginLeft + ',' + marginTop + ')'">
				<ng-content />

				<g class="grid-layer"></g>
				<g class="reference-lines-back"></g>
				<g class="axes-layer"></g>
				<g [attr.clip-path]="revealUrl">
					<g class="areas-layer" [attr.clip-path]="clipUrl"></g>
				</g>
				<g class="dots-layer"></g>
				<g class="reference-lines-front"></g>

				<rect
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

			.spn-area-chart {
				font-family: inherit;
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
export class SpnAreaChart<T = unknown> implements AfterContentInit {
	readonly data = input.required<ChartData<T>>();
	readonly width = input(600, { transform: numberAttribute });
	readonly height = input(400, { transform: numberAttribute });
	readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
	readonly layout = input<ChartLayout>('horizontal');
	readonly responsive = input(true, { transform: booleanAttribute });
	/** 'expand' normalises each stack to 0-100% (d3.stackOffsetExpand). */
	readonly stackOffset = input<'none' | 'expand'>('none');

	readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgElement');

	readonly xAxes = contentChildren(SpnXAxis);
	readonly yAxes = contentChildren(SpnYAxis);
	readonly areas = contentChildren(SpnArea);
	readonly grids = contentChildren(SpnCartesianGrid);
	readonly referenceLines = contentChildren(SpnReferenceLine);

	private readonly chartContext = inject(ChartContextService<T>);
	private readonly hostRef = inject(ElementRef<HTMLElement>);
	private readonly chartSize = injectChartResponsiveSize(this.width, this.height, this.responsive);
	protected readonly chartWidth = this.chartSize.width;
	protected readonly chartHeight = this.chartSize.height;

	// recharts-style nice y ticks for the default (no explicit y-axis) scale,
	// shared with the grid so gridlines land on the same values recharts uses.
	private defaultYTicks?: number[];

	readonly clipId = `spn-area-clip-${++areaClipCounter}`;
	get clipUrl(): string {
		return `url(#${this.clipId})`;
	}

	readonly revealId = `${this.clipId}-reveal`;
	get revealUrl(): string {
		return `url(#${this.revealId})`;
	}
	private readonly revealRect = viewChild<ElementRef<SVGRectElement>>('revealRect');
	private hasRevealed = false;

	/** Fill for an area: a gradient ref when fillGradient is set, else the flat colour. */
	private fillFor(area: SpnArea): string {
		if (!area.fillGradient()) return area.fill();
		return `url(#${this.clipId}-g${this.areas().indexOf(area)})`;
	}

	// Where an outside press began, so we can tell a tap from a scroll gesture.
	private outsidePressStart: { x: number; y: number } | null = null;

	/**
	 * Close the tooltip when *tapping* outside the chart, but not when starting a
	 * scroll there. Like shadcn, we wait for pointerup and only close if the
	 * pointer barely moved (a tap); a press that turns into a scroll leaves the
	 * tooltip open.
	 */
	@HostListener('document:pointerdown', ['$event'])
	onDocumentPointerDown(event: PointerEvent): void {
		const target = event.target as Node | null;
		if (target && this.hostRef.nativeElement.contains(target)) {
			this.outsidePressStart = null;
			return;
		}
		this.outsidePressStart = { x: event.clientX, y: event.clientY };
	}

	@HostListener('document:pointerup', ['$event'])
	onDocumentPointerUp(event: PointerEvent): void {
		const start = this.outsidePressStart;
		this.outsidePressStart = null;
		if (!start) return;
		const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
		if (moved > 10) return; // a scroll/drag, not a tap - leave the tooltip open
		clearTooltip(this.chartContext as ChartContextService<any>);
		this.updateActiveDots(-1);
	}

	@HostListener('document:pointercancel')
	onDocumentPointerCancel(): void {
		// The press became a scroll/gesture; never treat it as an outside tap.
		this.outsidePressStart = null;
	}

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

	private gridLayer?: SVGGElement;
	private referenceLinesBackLayer?: SVGGElement;
	private axesLayer?: SVGGElement;
	private areasLayer?: SVGGElement;
	private dotsLayer?: SVGGElement;
	private referenceLinesFrontLayer?: SVGGElement;
	private interactionLayerRef?: SVGRectElement;

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
			this.areas();
			this.grids();
			this.referenceLines();

			this.render();
		});
	}

	ngAfterContentInit(): void {
		this.setupLayers();
	}

	private setupLayers(): void {
		const svg = this.svgRef()?.nativeElement;
		if (!svg) return;

		this.gridLayer = svg.querySelector('.grid-layer') as SVGGElement;
		this.referenceLinesBackLayer = svg.querySelector('.reference-lines-back') as SVGGElement;
		this.axesLayer = svg.querySelector('.axes-layer') as SVGGElement;
		this.areasLayer = svg.querySelector('.areas-layer') as SVGGElement;
		this.dotsLayer = svg.querySelector('.dots-layer') as SVGGElement;
		this.referenceLinesFrontLayer = svg.querySelector('.reference-lines-front') as SVGGElement;
		this.interactionLayerRef = svg.querySelector('.interaction-layer') as SVGRectElement;
	}

	private render(): void {
		try {
			if (!this.axesLayer || !this.areasLayer || !this.gridLayer || !this.dotsLayer) {
				this.setupLayers();
				if (!this.axesLayer || !this.areasLayer || !this.gridLayer || !this.dotsLayer) return;
			}

			const data = this.data();

			// Clear previous renders first so emptying the data also clears the chart.
			d3.select(this.gridLayer).selectAll('*').remove();
			if (this.referenceLinesBackLayer) {
				d3.select(this.referenceLinesBackLayer).selectAll('*').remove();
			}
			d3.select(this.axesLayer).selectAll('*').remove();
			d3.select(this.areasLayer).selectAll('*').remove();
			d3.select(this.dotsLayer).selectAll('*').remove();
			if (this.referenceLinesFrontLayer) {
				d3.select(this.referenceLinesFrontLayer).selectAll('*').remove();
			}

			if (!data.length) return;

			this.renderAxes();
			this.ensureDefaultScales();
			this.renderGrid();
			this.renderReferenceLines(false);
			this.renderAreas();
			this.renderDots();
			this.renderReferenceLines(true);
			this.revealOnce();
		} catch (error) {
			console.error('[SpnAreaChart] Render error:', error);
		}
	}

	private renderAxes(): void {
		const data = this.data();
		const innerWidth = this.chartContext.innerWidth();
		const innerHeight = this.chartContext.innerHeight();

		// Reset each render; set below for an explicit number Y axis (and by
		// ensureDefaultScales for the default scale) so the grid lines match.
		this.defaultYTicks = undefined;

		this.xAxes().forEach((xAxis) => {
			if (xAxis.hide()) return;

			const domain = calculateAxisDomain(data, xAxis.dataKey(), xAxis.type(), xAxis.domain());
			const scale = createXScale(data, domain, xAxis.type(), xAxis.dataKey(), innerWidth);

			this.chartContext.registerXScale(scale, xAxis.axisId());
			// The end label may overhang into the right margin (recharts behaviour).
			renderXAxis(this.axesLayer!, xAxis, scale, innerHeight, this.chartContext.margin().right);
		});

		this.yAxes().forEach((yAxis) => {
			if (yAxis.hide()) return;

			let domain = this.calculateYAxisDomainFromAreas(data, yAxis.axisId(), yAxis.domain());
			// recharts-parity: for an auto number axis, nice the domain and tick
			// values (getNiceTickValues) so an explicit Y axis ticks the same way as
			// the default scale - e.g. a stacked max of 505 with 3 ticks -> 0/300/600.
			let tickValues: number[] | undefined;
			const d = yAxis.domain();
			if (yAxis.type() === 'number' && d[0] === 'auto' && d[1] === 'auto') {
				const tv = niceTicks(Number(domain[0]), Number(domain[1]), yAxis.ticks() || 5);
				domain = [tv[0], tv[tv.length - 1]];
				tickValues = tv;
				// Grid lines follow the same nice ticks as the axis.
				this.defaultYTicks = tv;
			}
			const scale = createYScale(data, domain, yAxis.type(), yAxis.dataKey(), innerHeight);

			this.chartContext.registerYScale(scale, yAxis.axisId());
			renderYAxis(this.axesLayer!, yAxis, scale, innerWidth, tickValues);
		});
	}

	/**
	 * Recharts-style fallback: when no explicit x/y axis component is declared,
	 * synthesize a default scale from the series data so series still render.
	 * The axis itself is not drawn - only the scale is registered.
	 */
	private ensureDefaultScales(): void {
		const data = this.data();
		const innerWidth = this.chartContext.innerWidth();
		const innerHeight = this.chartContext.innerHeight();

		// Guard on whether an explicit axis component owns 'default' - NOT on the
		// cached scale. The cache persists across renders, so guarding on it would
		// keep a stale scale (old innerWidth/innerHeight) after a resize, which
		// mis-maps the series (e.g. the curve dipping past the baseline).
		const hasDefaultX = this.xAxes().some((a) => a.axisId() === 'default' && !a.hide());
		if (!hasDefaultX) {
			const categories = data.map((_, i) => String(i));
			const scale = d3.scalePoint().domain(categories).range([0, innerWidth]);
			this.chartContext.registerXScale(scale as unknown as Scale, 'default');
		}

		const hasDefaultY = this.yAxes().some((a) => a.axisId() === 'default' && !a.hide());
		if (!hasDefaultY) {
			let niceDomain: Domain;
			if (this.stackOffset() === 'expand') {
				// 100% stacking: the axis is a 0-1 proportion
				this.defaultYTicks = [0, 0.25, 0.5, 0.75, 1];
				niceDomain = [0, 1];
			} else {
				const domain = this.calculateYAxisDomainFromAreas(data, 'default', ['auto', 'auto']);
				// recharts-style nice ticks/domain (e.g. max 305 -> 320, ticks every 80)
				const ticks = niceTicks(Number(domain[0]), Number(domain[1]), 5);
				niceDomain = [ticks[0], ticks[ticks.length - 1]];
				this.defaultYTicks = ticks;
			}
			const scale = createYScale(data, niceDomain, 'number', '', innerHeight);
			this.chartContext.registerYScale(scale, 'default');
		}
		// When an explicit Y axis owns 'default', renderAxes has already set
		// defaultYTicks (or left it undefined) - don't clobber it here.
	}

	private calculateYAxisDomainFromAreas(
		data: ChartData<T>,
		axisId: string,
		domainInput: Domain,
	): [number | string | Date, number | string | Date] {
		return calculateSeriesYDomain(data, toSeriesConfig(this.areas()), axisId, domainInput, {
			supportStacking: true,
			includeZero: true,
		});
	}

	private renderAreas(): void {
		const data = this.data();
		const visibleAreas = this.areas().filter((area) => !area.hide());

		// Group by stackId
		const stackGroups = new Map<string, SpnArea[]>();
		const nonStackedAreas: SpnArea[] = [];

		visibleAreas.forEach((area) => {
			const stackId = area.stackId();
			if (stackId) {
				const group = stackGroups.get(stackId) || [];
				group.push(area);
				stackGroups.set(stackId, group);
			} else {
				nonStackedAreas.push(area);
			}
		});

		// Render stacked areas
		stackGroups.forEach((stackAreas) => {
			this.renderStackedAreas(data, stackAreas);
		});

		// Render non-stacked areas
		nonStackedAreas.forEach((area) => {
			const xScale = this.chartContext.getXScale(area.xAxisId());
			const yScale = this.chartContext.getYScale(area.yAxisId());
			if (!xScale || !yScale) return;
			this.renderArea(area, data, xScale, yScale);
		});
	}

	private renderArea(area: SpnArea, data: ChartData<T>, xScale: Scale, yScale: Scale): void {
		if (!this.areasLayer) return;
		const innerHeight = this.chartContext.innerHeight();
		const xDataKey = this.xAxes()[0]?.dataKey();
		const xAccessor = createXAccessor<T>(xScale, xDataKey);

		const areaGenerator = d3
			.area<T>()
			.x((d, i) => xAccessor(d, i))
			.y0(() => innerHeight)
			.y1((d) => {
				const value = getValueByDataKey(d, area.dataKey());
				return (yScale as d3.ScaleLinear<number, number>)(value as number);
			})
			.curve((CURVE_MAP[area.curve()] || d3.curveLinear) as d3.CurveFactory);

		const pathData = areaGenerator(data);
		if (!pathData) return;

		const g = d3.select(this.areasLayer).append('g');

		// Render filled area
		const areaPath = g
			.append('path')
			.attr('fill', this.fillFor(area))
			.attr('fill-opacity', area.fillOpacity())
			.attr('stroke', 'none')
			.attr('d', pathData);

		// Render stroke line on top
		const lineGenerator = d3
			.line<T>()
			.x((d, i) => xAccessor(d, i))
			.y((d) => {
				const value = getValueByDataKey(d, area.dataKey());
				return (yScale as d3.ScaleLinear<number, number>)(value as number);
			})
			.curve((CURVE_MAP[area.curve()] || d3.curveLinear) as d3.CurveFactory);

		const lineData = lineGenerator(data);
		if (lineData) {
			g.append('path')
				.attr('fill', 'none')
				.attr('stroke', area.stroke())
				.attr('stroke-width', area.strokeWidth())
				.attr('d', lineData);
		}
		void areaPath;
	}

	private renderStackedAreas(data: ChartData<T>, stackAreas: SpnArea[]): void {
		if (!this.areasLayer) return;

		const xScale = this.chartContext.getXScale(stackAreas[0].xAxisId());
		const yScale = this.chartContext.getYScale(stackAreas[0].yAxisId());
		if (!xScale || !yScale) return;

		const dataKeys = stackAreas.map((a) => String(a.dataKey()));

		// Build stack data
		const stack = d3
			.stack<T>()
			.keys(dataKeys)
			.value((d, key) => (getValueByDataKey(d, key) as number) || 0)
			.order(d3.stackOrderNone)
			.offset(this.stackOffset() === 'expand' ? d3.stackOffsetExpand : d3.stackOffsetNone);

		const stackedData = stack(data);
		const xDataKey = this.xAxes()[0]?.dataKey();
		const xAccessor = createXAccessor<T>(xScale, xDataKey);

		const linearYScale = yScale as d3.ScaleLinear<number, number>;

		// Render each stacked layer (bottom to top)
		stackedData.forEach((layer, layerIndex) => {
			const area = stackAreas[layerIndex];
			if (!this.areasLayer) return;
			const g = d3.select(this.areasLayer).append('g');

			const areaGenerator = d3
				.area<d3.SeriesPoint<T>>()
				.x((_d, i) => xAccessor(data[i], i))
				.y0((d) => linearYScale(d[0]))
				.y1((d) => linearYScale(d[1]))
				.curve((CURVE_MAP[area.curve()] || d3.curveLinear) as d3.CurveFactory);

			const pathData = areaGenerator(layer);
			if (!pathData) return;

			const areaPath = g
				.append('path')
				.attr('fill', this.fillFor(area))
				.attr('fill-opacity', area.fillOpacity())
				.attr('stroke', 'none')
				.attr('d', pathData);

			// Stroke only the top edge of the layer (not the closed area's
			// left/right/bottom sides), matching recharts.
			const topLine = d3
				.line<d3.SeriesPoint<T>>()
				.x((_d, i) => xAccessor(data[i], i))
				.y((d) => linearYScale(d[1]))
				.curve((CURVE_MAP[area.curve()] || d3.curveLinear) as d3.CurveFactory);
			const topLineData = topLine(layer);
			if (topLineData) {
				g.append('path')
					.attr('fill', 'none')
					.attr('stroke', area.stroke())
					.attr('stroke-width', area.strokeWidth())
					.attr('d', topLineData);
			}
			void areaPath;
		});
	}

	/**
	 * recharts-style entrance: wipe the areas in left-to-right once on mount by
	 * animating the reveal clip's width from 0 to full. Skipped when no area wants
	 * animation (e.g. screenshot captures set isAnimationActive=false).
	 */
	private revealOnce(): void {
		if (this.hasRevealed) return;
		const rect = this.revealRect()?.nativeElement;
		if (!rect) return;
		const animated = this.areas().filter((a) => a.isAnimationActive() && this.chartSize.isAnimationActive());
		if (animated.length === 0) return;
		this.hasRevealed = true;

		const full = this.chartContext.innerWidth() + 2;
		const duration = Math.max(...animated.map((a) => a.animationDuration()));
		d3.select(rect)
			.attr('width', 0)
			.transition()
			.duration(duration)
			.ease(d3.easeSinOut)
			.attr('width', full)
			// Re-open fully afterwards so a later resize can't clip the chart.
			.on('end', () => rect.setAttribute('width', '100000'));
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

		renderGrid(this.gridLayer, grid, innerWidth, innerHeight, xScale, yScale, this.defaultYTicks);
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
		if (!this.areasLayer || !this.interactionLayerRef) return;

		const [mouseX, mouseY] = d3.pointer(event, this.areasLayer);
		const data = this.data();
		const xScale = this.chartContext.xScale();
		const yScale = this.chartContext.yScale();

		if (!xScale || !yScale || data.length === 0) return;

		const xAxisDataKey = this.xAxes()[0]?.dataKey();
		const { dataIndex, dataPoint } = findNearestDataPoint(mouseX, data, xScale, xAxisDataKey);

		// Get y position from the first visible area
		const firstVisibleArea = this.areas().find((area) => !area.hide());
		const position = calculateDataPointPosition(
			dataPoint,
			dataIndex,
			xScale,
			yScale,
			xAxisDataKey,
			firstVisibleArea?.dataKey(),
		);

		// Build tooltip payload from all visible areas
		const payload = this.areas()
			.filter((area) => !area.hide())
			.map((area) => ({
				name: area.name() || String(area.dataKey()),
				value: getValueByDataKey(dataPoint, area.dataKey()),
				dataKey: area.dataKey(),
				color: area.fill(),
				payload: dataPoint,
			}));

		// Get label from x-axis data key
		const label = xAxisDataKey ? String(getValueByDataKey(dataPoint, xAxisDataKey)) : String(dataIndex);

		updateTooltip(
			this.chartContext as ChartContextService<any>,
			dataIndex,
			// x snaps to the data point (active dot), y follows the pointer (recharts-style)
			{ x: position.x, y: mouseY },
			payload,
			label,
			this.marginLeft,
			this.marginTop,
			false,
			this.chartWidth(),
			this.chartHeight(),
			this.svgRef()?.nativeElement,
		);

		this.updateActiveDots(dataIndex);
	}

	onChartMouseLeave(): void {
		clearTooltip(this.chartContext as ChartContextService<any>);
		this.updateActiveDots(-1);
	}

	/**
	 * The y value a dot sits at. For non-stacked areas this is the raw value;
	 * for stacked areas it is the cumulative top of the layer (sum of this area
	 * plus all visible areas below it in the same stack, in declaration order).
	 */
	private getStackedValue(area: SpnArea, dataPoint: T): number {
		const raw = (getValueByDataKey(dataPoint, area.dataKey()) as number) || 0;
		const stackId = area.stackId();
		if (!stackId) return raw;

		let sum = 0;
		let total = 0;
		let reached = 0;
		for (const a of this.areas()) {
			if (a.hide() || a.stackId() !== stackId) continue;
			const v = (getValueByDataKey(dataPoint, a.dataKey()) as number) || 0;
			total += v;
			sum += v;
			if (a === area) reached = sum;
		}
		if (reached === 0) reached = sum;
		// 100% stacking: dots sit on the 0-1 proportion axis
		if (this.stackOffset() === 'expand') {
			return total > 0 ? reached / total : 0;
		}
		return reached;
	}

	// Render dots on areas
	private renderDots(): void {
		if (!this.dotsLayer) return;

		const data = this.data();
		const dotsLayer = this.dotsLayer;

		this.areas().forEach((area) => {
			if (area.hide() || !area.dot()) return;

			const xScale = this.chartContext.getXScale(area.xAxisId());
			const yScale = this.chartContext.getYScale(area.yAxisId());

			if (!xScale || !yScale) return;

			const xAxisDataKey = this.xAxes()[0]?.dataKey();
			const dotFill = area.dotFill() || area.fill();
			const dotStroke = area.dotStroke();
			const dotStrokeWidth = area.dotStrokeWidth();
			const dotSize = area.dotSize();

			const dotsGroup = d3.select(dotsLayer).append('g').attr('class', `dots-${area.dataKey()}`);

			data.forEach((d, i) => {
				const rawValue = getValueByDataKey(d, area.dataKey());
				if (rawValue === null || rawValue === undefined) return;

				// For stacked series the dot sits on the layer's cumulative top.
				const yValue = this.getStackedValue(area, d);
				const xPos = getXPosition(d, i, xScale, xAxisDataKey);
				const yPos = (yScale as d3.ScaleLinear<number, number>)(yValue);

				dotsGroup
					.append('circle')
					.attr('class', `dot dot-${i}`)
					.attr('cx', xPos)
					.attr('cy', yPos)
					.attr('r', dotSize)
					.attr('fill', dotFill)
					.attr('stroke', dotStroke)
					.attr('stroke-width', dotStrokeWidth)
					.style('cursor', 'pointer');
			});
		});
	}

	private updateActiveDots(activeIndex: number): void {
		if (!this.dotsLayer) return;

		const dotsLayer = d3.select(this.dotsLayer);

		this.areas().forEach((area) => {
			if (area.hide() || !area.dot() || !area.activeDot()) return;

			const dotsGroup = dotsLayer.select(`.dots-${area.dataKey()}`);
			const activeDotFill = area.activeDotFill() || area.fill();
			const activeDotStroke = area.activeDotStroke();
			const activeDotStrokeWidth = area.activeDotStrokeWidth();
			const activeDotSize = area.activeDotSize();
			const dotFill = area.dotFill() || area.fill();
			const dotStroke = area.dotStroke();
			const dotStrokeWidth = area.dotStrokeWidth();
			const dotSize = area.dotSize();

			dotsGroup
				.selectAll('circle')
				.attr('r', dotSize)
				.attr('fill', dotFill)
				.attr('stroke', dotStroke)
				.attr('stroke-width', dotStrokeWidth);

			if (activeIndex >= 0) {
				dotsGroup
					.select(`.dot-${activeIndex}`)
					.attr('r', activeDotSize)
					.attr('fill', activeDotFill)
					.attr('stroke', activeDotStroke)
					.attr('stroke-width', activeDotStrokeWidth);
			}
		});
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
}
