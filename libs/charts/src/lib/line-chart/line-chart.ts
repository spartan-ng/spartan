import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	booleanAttribute,
	computed,
	contentChildren,
	effect,
	inject,
	input,
	numberAttribute,
	viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { SpnCartesianGrid } from '../cartesian-grid/cartesian-grid';
import { ChartContextService } from '../chart-context.service';
import { injectChartResponsiveSize } from '../chart-responsive-size';
import {
	anyElementHasHoverEffects,
	applyLineHoverEffect,
	calculateAxisDomain,
	calculateDataPointPosition,
	calculateSeriesYDomain,
	clearTooltip,
	createHoverConfig,
	createXScale,
	createYScale,
	findNearestDataPoint,
	getHoverState,
	getXPosition,
	renderGrid,
	renderReferenceLines,
	renderXAxis,
	renderYAxis,
	toSeriesConfig,
	updateTooltip,
} from '../chart-utils';
import { CURVE_MAP } from '../constants';
import { SpnLine } from '../line/line';
import { SpnReferenceLine } from '../reference-line/reference-line';
import { ChartData, ChartLayout, ChartMargin, DEFAULT_MARGIN, Domain, Scale, getValueByDataKey } from '../types';
import { SpnXAxis } from '../x-axis/x-axis';
import { SpnYAxis } from '../y-axis/y-axis';

@Component({
	selector: 'spn-line-chart',
	host: {
		'[attr.title]': 'null',
	},
	template: `
		<svg #svgElement [attr.width]="chartWidth()" [attr.height]="chartHeight()" class="spn-line-chart">
			<g [attr.transform]="'translate(' + marginLeft + ',' + marginTop + ')'">
				<!-- Content projection for config components (hidden) -->
				<ng-content />

				<!-- Rendered layers (created by this component) -->
				<g class="grid-layer"></g>
				<g class="reference-lines-back"></g>
				<g class="axes-layer"></g>
				<g class="lines-layer"></g>
				<g class="dots-layer"></g>
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

			.spn-line-chart {
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
export class SpnLineChart<T = unknown> implements AfterContentInit {
	// Signal-based inputs
	readonly data = input.required<ChartData<T>>();
	readonly width = input(600, { transform: numberAttribute });
	readonly height = input(400, { transform: numberAttribute });
	readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
	readonly layout = input<ChartLayout>('horizontal');
	readonly responsive = input(true, { transform: booleanAttribute }); // Enable responsive by default

	// View references
	readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgElement');

	// Content children - config components
	readonly xAxes = contentChildren(SpnXAxis);
	readonly yAxes = contentChildren(SpnYAxis);
	readonly lines = contentChildren(SpnLine);
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
	private linesLayer?: SVGGElement;
	private dotsLayer?: SVGGElement;
	private referenceLinesFrontLayer?: SVGGElement;
	private interactionLayerRef?: SVGRectElement;

	// Hover effect state
	private activeLineIndex = -1;

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
			this.lines();
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
		this.linesLayer = svg.querySelector('.lines-layer') as SVGGElement;
		this.dotsLayer = svg.querySelector('.dots-layer') as SVGGElement;
		this.referenceLinesFrontLayer = svg.querySelector('.reference-lines-front') as SVGGElement;
		this.interactionLayerRef = svg.querySelector('.interaction-layer') as SVGRectElement;
	}

	private render(): void {
		try {
			if (!this.axesLayer || !this.linesLayer || !this.gridLayer || !this.dotsLayer) {
				this.setupLayers();
				if (!this.axesLayer || !this.linesLayer || !this.gridLayer || !this.dotsLayer) return;
			}

			const data = this.data();

			// Clear previous renders first so emptying the data also clears the chart.
			d3.select(this.gridLayer).selectAll('*').remove();
			if (this.referenceLinesBackLayer) {
				d3.select(this.referenceLinesBackLayer).selectAll('*').remove();
			}
			d3.select(this.axesLayer).selectAll('*').remove();
			d3.select(this.linesLayer).selectAll('*').remove();
			d3.select(this.dotsLayer).selectAll('*').remove();
			if (this.referenceLinesFrontLayer) {
				d3.select(this.referenceLinesFrontLayer).selectAll('*').remove();
			}

			if (!data.length) return;

			// Render in correct z-order
			this.renderAxes(); // Create scales first
			this.renderGrid(); // Use scales to draw grid
			this.renderReferenceLines(false); // Back reference lines
			this.renderLines(); // Draw data lines
			this.renderDots(); // Draw dots on lines
			this.renderReferenceLines(true); // Front reference lines
		} catch (error) {
			console.error('[SpnLineChart] Render error:', error);
		}
	}

	private renderAxes(): void {
		const data = this.data();
		const innerWidth = this.chartContext.innerWidth();
		const innerHeight = this.chartContext.innerHeight();

		// Render X axes
		this.xAxes().forEach((xAxis) => {
			if (xAxis.hide()) return;

			const domain = calculateAxisDomain(data, xAxis.dataKey(), xAxis.type(), xAxis.domain());
			const scale = createXScale(data, domain, xAxis.type(), xAxis.dataKey(), innerWidth);

			this.chartContext.registerXScale(scale, xAxis.axisId());
			// The end label may overhang into the right margin (recharts behaviour).
			renderXAxis(this.axesLayer!, xAxis, scale, innerHeight, this.chartContext.margin().right);
		});

		// Render Y axes
		this.yAxes().forEach((yAxis) => {
			if (yAxis.hide()) return;

			const domain = this.calculateYAxisDomainFromLines(data, yAxis.axisId(), yAxis.domain());
			const scale = createYScale(data, domain, yAxis.type(), yAxis.dataKey(), innerHeight);

			this.chartContext.registerYScale(scale, yAxis.axisId());
			renderYAxis(this.axesLayer!, yAxis, scale, innerWidth);
		});
	}

	private calculateYAxisDomainFromLines(
		data: ChartData<T>,
		axisId: string,
		domainInput: Domain,
	): [number | string | Date, number | string | Date] {
		return calculateSeriesYDomain(data, toSeriesConfig(this.lines()), axisId, domainInput, {
			supportStacking: false,
			includeZero: false,
		});
	}

	private renderLines(): void {
		const data = this.data();

		this.lines().forEach((line, lineIndex) => {
			if (line.hide()) return;

			const xScale = this.chartContext.getXScale(line.xAxisId());
			const yScale = this.chartContext.getYScale(line.yAxisId());

			if (!xScale || !yScale) return;

			this.renderLine(line, lineIndex, data, xScale, yScale);
		});
	}

	private renderLine(line: SpnLine, lineIndex: number, data: ChartData<T>, xScale: Scale, yScale: Scale): void {
		if (!this.linesLayer) return;

		const xDataKey = this.xAxes()[0]?.dataKey();

		const lineGenerator = d3
			.line<T>()
			.x((d, i) => getXPosition(d, i, xScale, xDataKey))
			.y((d) => {
				const value = getValueByDataKey(d, line.dataKey());
				return (yScale as d3.ScaleLinear<number, number>)(value as number);
			})
			.curve(CURVE_MAP[line.curve()] || d3.curveLinear);

		const pathData = lineGenerator(data);
		if (!pathData) return;

		const path = d3
			.select(this.linesLayer)
			.append('path')
			.attr('class', `line-path line-${lineIndex}`)
			.attr('data-line-index', lineIndex)
			.attr('data-base-stroke', line.stroke())
			.attr('data-base-stroke-width', line.strokeWidth())
			.attr('fill', line.fill())
			.attr('stroke', line.stroke())
			.attr('stroke-width', line.strokeWidth());

		if (line.isAnimationActive() && this.chartSize.isAnimationActive()) {
			path
				.attr('d', pathData)
				.attr('stroke-dasharray', function (this: SVGPathElement) {
					const length = this.getTotalLength();
					return `${length} ${length}`;
				})
				.attr('stroke-dashoffset', function (this: SVGPathElement) {
					return this.getTotalLength();
				})
				.transition()
				.duration(line.animationDuration())
				.ease(d3.easeLinear)
				.attr('stroke-dashoffset', 0)
				.on('end', function (this: SVGPathElement) {
					d3.select(this).attr('stroke-dasharray', 'none');
				});
		} else {
			path.attr('d', pathData);
		}
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

		const grid = grids[0]; // Use first grid config
		const innerWidth = this.chartContext.innerWidth();
		const innerHeight = this.chartContext.innerHeight();
		const xScale = this.chartContext.xScale();
		const yScale = this.chartContext.yScale();

		if (!xScale || !yScale) return;

		renderGrid(this.gridLayer, grid, innerWidth, innerHeight, xScale, yScale);
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
		if (!this.linesLayer || !this.interactionLayerRef) return;

		const [mouseX, mouseY] = d3.pointer(event, this.linesLayer);
		const data = this.data();
		const xScale = this.chartContext.xScale();
		const yScale = this.chartContext.yScale();

		if (!xScale || !yScale || data.length === 0) return;

		const xAxisDataKey = this.xAxes()[0]?.dataKey();
		const { dataIndex, dataPoint } = findNearestDataPoint(mouseX, data, xScale, xAxisDataKey);

		// Get y position from the first visible line
		const firstVisibleLine = this.lines().find((line) => !line.hide());
		const dataPos = calculateDataPointPosition(
			dataPoint,
			dataIndex,
			xScale,
			yScale,
			xAxisDataKey,
			firstVisibleLine?.dataKey(),
		);
		// recharts anchors the tooltip at the cursor height (mouse-follow), aligned
		// horizontally with the hovered category - not at the line's data point.
		const position = { x: dataPos.x, y: mouseY };

		// Build tooltip payload from all visible lines
		const payload = this.lines()
			.filter((line) => !line.hide())
			.map((line) => ({
				name: line.name() || String(line.dataKey()),
				value: getValueByDataKey(dataPoint, line.dataKey()),
				dataKey: line.dataKey(),
				color: line.stroke(),
				payload: dataPoint,
			}));

		// Get label from x-axis data key
		const label = xAxisDataKey ? String(getValueByDataKey(dataPoint, xAxisDataKey)) : String(dataIndex);

		updateTooltip(
			this.chartContext as ChartContextService<any>,
			dataIndex,
			position,
			payload,
			label,
			this.marginLeft,
			this.marginTop,
			false,
			this.chartWidth(),
			this.chartHeight(),
			this.svgRef()?.nativeElement,
		);

		// Update active dots
		this.updateActiveDots(dataIndex);

		// Find which line is closest to mouse Y position and update hover styles
		const closestLineIndex = this.findClosestLine(mouseY, dataIndex);
		if (this.activeLineIndex !== closestLineIndex) {
			this.activeLineIndex = closestLineIndex;
			if (this.hasHoverEffectsConfigured()) {
				this.updateHoverStyles();
			}
		}
	}

	onChartMouseLeave(): void {
		clearTooltip(this.chartContext as ChartContextService<any>);
		this.updateActiveDots(-1); // Clear active dots
		if (this.activeLineIndex !== -1) {
			this.activeLineIndex = -1;
			if (this.hasHoverEffectsConfigured()) {
				this.updateHoverStyles();
			}
		}
	}

	// Render dots on lines
	private renderDots(): void {
		if (!this.dotsLayer) return;

		const data = this.data();
		const dotsLayer = this.dotsLayer; // Store reference for TypeScript

		this.lines().forEach((line) => {
			if (line.hide() || !line.dot()) return;

			const xScale = this.chartContext.getXScale(line.xAxisId());
			const yScale = this.chartContext.getYScale(line.yAxisId());

			if (!xScale || !yScale) return;

			const xAxisDataKey = this.xAxes()[0]?.dataKey();
			const dotFill = line.dotFill() || line.stroke();
			const dotStroke = line.dotStroke();
			const dotStrokeWidth = line.dotStrokeWidth();
			const dotSize = line.dotSize();
			const dotRenderer = line.dotRenderer();

			// Create dots group for this line
			const dotsGroup = d3.select(dotsLayer).append('g').attr('class', `dots-${line.dataKey()}`);

			// Render dots for each data point
			data.forEach((d, i) => {
				const yValue = getValueByDataKey(d, line.dataKey());
				if (yValue === null || yValue === undefined) return;

				const xPos = getXPosition(d, i, xScale, xAxisDataKey);
				const yPos = (yScale as d3.ScaleLinear<number, number>)(yValue as number);

				if (dotRenderer) {
					// Custom dot: render-prop returns an SVG fragment drawn at the origin.
					const group = dotsGroup
						.append('g')
						.attr('class', `dot dot-${i}`)
						.attr('transform', `translate(${xPos},${yPos})`);
					group.node()!.innerHTML = dotRenderer({
						cx: xPos,
						cy: yPos,
						index: i,
						payload: d as Record<string, unknown>,
					});
					return;
				}

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

	// Update active dots styling
	private updateActiveDots(activeIndex: number): void {
		if (!this.dotsLayer) return;

		const dotsLayer = d3.select(this.dotsLayer);

		this.lines().forEach((line) => {
			if (line.hide() || !line.dot() || !line.activeDot()) return;

			const dotsGroup = dotsLayer.select(`.dots-${line.dataKey()}`);
			const activeDotFill = line.activeDotFill() || line.stroke();
			const activeDotStroke = line.activeDotStroke();
			const activeDotStrokeWidth = line.activeDotStrokeWidth();
			const activeDotSize = line.activeDotSize();
			const dotFill = line.dotFill() || line.stroke();
			const dotStroke = line.dotStroke();
			const dotStrokeWidth = line.dotStrokeWidth();
			const dotSize = line.dotSize();

			// Reset all dots to normal state
			dotsGroup
				.selectAll('circle')
				.attr('r', dotSize)
				.attr('fill', dotFill)
				.attr('stroke', dotStroke)
				.attr('stroke-width', dotStrokeWidth);

			// Highlight active dot
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

	// Find the closest line to the mouse Y position
	private findClosestLine(mouseY: number, dataIndex: number): number {
		const visibleLines = this.lines().filter((line) => !line.hide());
		if (visibleLines.length <= 1) return visibleLines.length === 1 ? 0 : -1;

		const data = this.data();
		const dataPoint = data[dataIndex];
		if (!dataPoint) return -1;

		let closestIndex = -1;
		let closestDistance = Infinity;

		this.lines().forEach((line, index) => {
			if (line.hide()) return;

			const yScale = this.chartContext.getYScale(line.yAxisId());
			if (!yScale) return;

			const value = getValueByDataKey(dataPoint, line.dataKey()) as number;
			if (value == null) return;

			const yPos = (yScale as d3.ScaleLinear<number, number>)(value);
			const distance = Math.abs(mouseY - yPos);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = index;
			}
		});

		return closestIndex;
	}

	// Check if any line has hover effects configured
	private hasHoverEffectsConfigured(): boolean {
		return anyElementHasHoverEffects(this.lines(), (line) => !line.hide());
	}

	// Update line hover styles
	private updateHoverStyles(): void {
		if (!this.linesLayer) return;

		const allLinePaths = d3.select(this.linesLayer).selectAll<SVGPathElement, unknown>('.line-path');

		allLinePaths.each((_, i, nodes) => {
			const element = d3.select(nodes[i]);
			const lineIndex = parseInt(element.attr('data-line-index'), 10);

			// Find the corresponding line config
			const lineConfig = this.lines()[lineIndex];
			if (!lineConfig || lineConfig.hide()) return;

			const baseStroke = element.attr('data-base-stroke');
			const baseStrokeWidth = element.attr('data-base-stroke-width');
			if (!baseStroke) return;

			const hoverConfig = createHoverConfig(lineConfig);
			const state = getHoverState(lineIndex, this.activeLineIndex, lineConfig.dimOthers());

			applyLineHoverEffect(element, state, baseStroke, parseFloat(baseStrokeWidth), hoverConfig);
		});
	}
}
