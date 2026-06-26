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
import { clearTooltip, updateTooltip } from '../chart-utils';
import { SpnPolarGrid } from '../polar-grid/polar-grid';
import { SpnRadar } from '../radar/radar';
import { ChartData, ChartMargin, DataKey, DEFAULT_MARGIN, getValueByDataKey } from '../types';

/**
 * A styled segment of a custom radar axis label. `break: true` moves the
 * following content onto a new line below the previous one.
 */
export interface RadarAxisLabelLine {
	text: string;
	muted?: boolean;
	break?: boolean;
}

/**
 * Radar chart container.
 *
 * Renders equiangular axes (one per category), a linear radius scale, and a
 * closed path per series (line and/or filled area), plus a polar grid (polygon
 * or circle), axis labels and optional dots. Multiple <spn-radar> series are
 * supported.
 *
 * Child components (<spn-radar>, <spn-polar-grid>) are configuration collectors
 * only; this container performs all SVG rendering (config-collector pattern).
 */
@Component({
	selector: 'spn-radar-chart',
	host: { '[attr.title]': 'null' },
	template: `
		<svg #svgElement [attr.width]="chartWidth()" [attr.height]="chartHeight()" class="spn-radar-chart">
			<ng-content />
			<g [attr.transform]="'translate(' + centerX() + ',' + centerY() + ')'">
				<g class="grid-layer"></g>
				<g class="axis-layer"></g>
				<g class="series-layer"></g>
				<g class="dots-layer"></g>
			</g>
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
			.spn-radar-chart {
				font-family: sans-serif;
				display: block;
				overflow: visible;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [ChartContextService],
})
export class SpnRadarChart<T = unknown> implements AfterContentInit {
	readonly data = input.required<ChartData<T>>();
	readonly width = input(400, { transform: numberAttribute });
	readonly height = input(400, { transform: numberAttribute });
	readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
	readonly responsive = input(true, { transform: booleanAttribute });

	/** Category (angle) field. */
	readonly dataKey = input.required<DataKey<T>>();

	/** Outer radius (px). When 0 (default) it is derived from the chart size. */
	readonly outerRadius = input(0, { transform: numberAttribute });

	/**
	 * Render a polar radius axis (tick value labels along a spoke at `radiusAxisAngle`
	 * degrees). Matches shadcn's radar "radius" variant. 0 disables it.
	 */
	readonly showRadiusAxis = input(false, { transform: booleanAttribute });
	/** Angle (recharts convention, 0 = 3 o'clock, CCW) of the radius axis spoke. */
	readonly radiusAxisAngle = input(60, { transform: numberAttribute });
	readonly radiusAxisStroke = input<string>('var(--foreground)');

	/**
	 * Optional custom angle-axis label. Returns either a plain string or an array
	 * of styled line segments. Each segment is one tspan; an explicit `break`
	 * starts a new line below. Enables shadcn's multi-line "value/value + month"
	 * tick labels.
	 */
	readonly axisLabel = input<((datum: T, index: number) => RadarAxisLabelLine[]) | undefined>(undefined);

	readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgElement');
	readonly series = contentChildren(SpnRadar);
	readonly grids = contentChildren(SpnPolarGrid);

	private readonly chartContext = inject(ChartContextService<T>);
	private readonly chartSize = injectChartResponsiveSize(this.width, this.height, this.responsive);
	protected readonly chartWidth = this.chartSize.width;
	protected readonly chartHeight = this.chartSize.height;

	private gridLayer?: SVGGElement;
	private axisLayer?: SVGGElement;
	private seriesLayer?: SVGGElement;
	private dotsLayer?: SVGGElement;

	// Stored for hover hit-testing: vertex coords per series.
	private vertexData: {
		name: string;
		color: string;
		dataKey: DataKey<T>;
		points: { x: number; y: number; value: number; datum: T }[];
	}[] = [];
	private categoryAngles: number[] = [];

	readonly centerX = computed(() => {
		const m = this.margin();
		return m.left + (this.chartWidth() - m.left - m.right) / 2;
	});
	readonly centerY = computed(() => {
		const m = this.margin();
		return m.top + (this.chartHeight() - m.top - m.bottom) / 2;
	});

	constructor() {
		effect(() => {
			this.chartContext.data.set(this.data());
			this.chartContext.width.set(this.chartWidth());
			this.chartContext.height.set(this.chartHeight());
			this.chartContext.margin.set(this.margin());
			this.series();
			this.grids();
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
		this.axisLayer = svg.querySelector('.axis-layer') as SVGGElement;
		this.seriesLayer = svg.querySelector('.series-layer') as SVGGElement;
		this.dotsLayer = svg.querySelector('.dots-layer') as SVGGElement;
	}

	private computeOuterRadius(): number {
		const explicit = this.outerRadius();
		if (explicit > 0) return explicit;
		const m = this.margin();
		const innerW = this.chartWidth() - m.left - m.right;
		const innerH = this.chartHeight() - m.top - m.bottom;
		return (Math.min(innerW, innerH) / 2) * 0.8;
	}

	/**
	 * recharts-style nice domain max for the radius axis.
	 * Ported from recharts-scale getNiceTickValues / getAdaptiveStep so the data
	 * polygon reaches the same radius as the recharts reference.
	 */
	private niceMax(maxValue: number, tickCount = 5): number {
		if (maxValue <= 0) return 1;
		const tickMax = this.calculateStep(0, maxValue, tickCount, 0);
		return tickMax;
	}

	private digitCount(value: number): number {
		if (value === 0) return 0;
		return Math.floor(Math.log10(Math.abs(value))) + 1;
	}

	private adaptiveStep(roughStep: number, correctionFactor: number): number {
		if (roughStep <= 0) return 0;
		const dc = this.digitCount(roughStep);
		const digitCountValue = Math.pow(10, dc);
		const stepRatio = roughStep / digitCountValue;
		const stepRatioScale = dc !== 1 ? 0.05 : 0.1;
		const amendStepRatio = (Math.ceil(stepRatio / stepRatioScale) + correctionFactor) * stepRatioScale;
		return amendStepRatio * digitCountValue;
	}

	/** Returns the nice tickMax for [min,max] with 0 in range (our radar always has min=0). */
	private calculateStep(min: number, max: number, tickCount: number, correctionFactor: number): number {
		const step = this.adaptiveStep((max - min) / (tickCount - 1), correctionFactor);
		if (step <= 0) return max || 1;
		// 0 is inside [min,max], so middle = 0.
		const middle = 0;
		const belowCount = Math.ceil((middle - min) / step);
		let upCount = Math.ceil((max - middle) / step);
		const scaleCount = belowCount + upCount + 1;
		if (scaleCount > tickCount) {
			return this.calculateStep(min, max, tickCount, correctionFactor + 1);
		}
		if (scaleCount < tickCount) {
			upCount = max > 0 ? upCount + (tickCount - scaleCount) : upCount;
		}
		return middle + upCount * step;
	}

	/** recharts polar point: angle in degrees, 0 = 3 o'clock, positive = CCW. */
	private polar(radius: number, angleDeg: number): [number, number] {
		const rad = (-angleDeg * Math.PI) / 180;
		return [radius * Math.cos(rad), radius * Math.sin(rad)];
	}

	private render(): void {
		try {
			if (!this.gridLayer || !this.axisLayer || !this.seriesLayer || !this.dotsLayer) {
				this.setupLayers();
				if (!this.gridLayer || !this.axisLayer || !this.seriesLayer || !this.dotsLayer) {
					return;
				}
			}
			d3.select(this.gridLayer).selectAll('*').remove();
			d3.select(this.axisLayer).selectAll('*').remove();
			d3.select(this.seriesLayer).selectAll('*').remove();
			d3.select(this.dotsLayer).selectAll('*').remove();
			this.vertexData = [];

			const data = this.data();
			const series = this.series().filter((s) => !s.hide()) as SpnRadar<T>[];
			if (!data.length || !series.length) return;

			const n = data.length;
			const outerR = this.computeOuterRadius();
			const categoryKey = this.dataKey();

			// Angle per category: first at top (90deg), going clockwise.
			this.categoryAngles = data.map((_, k) => 90 - (k * 360) / n);

			// Radius scale across all series values.
			let maxValue = 0;
			for (const s of series) {
				for (const d of data) {
					const v = Number(getValueByDataKey(d, s.dataKey())) || 0;
					if (v > maxValue) maxValue = v;
				}
			}
			const domainMax = this.niceMax(maxValue, 5);
			const radiusScale = d3.scaleLinear().domain([0, domainMax]).range([0, outerR]);

			this.renderGrid(outerR, n);
			this.renderAxis(data, categoryKey, outerR, n);
			this.renderSeries(data, series, radiusScale);
			if (this.showRadiusAxis()) {
				this.renderRadiusAxis(radiusScale, domainMax);
			}
		} catch (error) {
			console.error('[SpnRadarChart] Render error:', error);
		}
	}

	private renderGrid(outerR: number, _n: number): void {
		const grid = this.grids()[0];
		if (!grid) return;
		const gridType = grid.gridType();
		const radialLines = grid.radialLines();
		const stroke = grid.stroke();
		const strokeWidth = grid.strokeWidth();
		const fill = grid.fill();
		const fillOpacity = grid.fillOpacity();
		const polarRadius = grid.polarRadius();
		const layer = d3.select(this.gridLayer!);

		// Determine ring radii: explicit polarRadius, or evenly-spaced tick rings.
		let radii: number[];
		if (grid.hideRings()) {
			radii = [];
		} else if (polarRadius && polarRadius.length) {
			radii = polarRadius;
		} else {
			const rings = 5; // recharts default tickCount (incl. centre)
			radii = [];
			for (let i = 1; i < rings; i++) {
				radii.push((i / (rings - 1)) * outerR);
			}
		}

		// recharts paints the largest ring first so smaller filled rings layer on top.
		const ordered = [...radii].sort((a, b) => b - a);
		ordered.forEach((r) => {
			if (gridType === 'circle') {
				layer
					.append('circle')
					.attr('cx', 0)
					.attr('cy', 0)
					.attr('r', r)
					.attr('fill', fill ?? 'none')
					.attr('fill-opacity', fill ? fillOpacity : null)
					.attr('stroke', stroke)
					.attr('stroke-width', strokeWidth);
			} else {
				const pts = this.categoryAngles.map((a) => this.polar(r, a));
				layer
					.append('path')
					.attr('fill', fill ?? 'none')
					.attr('fill-opacity', fill ? fillOpacity : null)
					.attr('stroke', stroke)
					.attr('stroke-width', strokeWidth)
					.attr('d', this.closedPath(pts));
			}
		});

		if (radialLines) {
			this.categoryAngles.forEach((a) => {
				const [x, y] = this.polar(outerR, a);
				layer
					.append('line')
					.attr('x1', 0)
					.attr('y1', 0)
					.attr('x2', x)
					.attr('y2', y)
					.attr('stroke', stroke)
					.attr('stroke-width', strokeWidth);
			});
		}
	}

	private renderAxis(data: ChartData<T>, categoryKey: DataKey<T>, outerR: number, _n: number): void {
		const layer = d3.select(this.axisLayer!);
		const labelOffset = 8;
		const custom = this.axisLabel();
		data.forEach((d, k) => {
			const angle = this.categoryAngles[k];
			const [lx, ly] = this.polar(outerR + labelOffset, angle);
			// Text anchor based on horizontal position relative to centre.
			const cos = Math.cos((-angle * Math.PI) / 180);
			let anchor: 'start' | 'middle' | 'end' = 'middle';
			if (cos > 1e-6) anchor = 'start';
			else if (cos < -1e-6) anchor = 'end';
			// Vertical dy to roughly match recharts baseline handling.
			const sin = Math.sin((-angle * Math.PI) / 180);
			let dy = '0.355em';
			if (Math.abs(sin) > 0.99) dy = sin < 0 ? '0em' : '0.71em';

			if (custom) {
				// recharts renders the custom tick at the tick point with the default
				// (alphabetic) baseline - no vertical dy - and nudges the top (index 0)
				// label up by 10px. The month line drops by 1rem.
				const text = layer
					.append('text')
					.attr('x', lx)
					.attr('y', ly + (k === 0 ? -10 : 0))
					.attr('text-anchor', anchor)
					.attr('fill', 'var(--foreground)')
					.attr('font-size', 13)
					.attr('font-weight', 500);
				const lines = custom(d, k);
				lines.forEach((seg) => {
					const t = text.append('tspan').text(seg.text);
					if (seg.muted) t.attr('fill', 'var(--muted-foreground)');
					if (seg.break) t.attr('x', lx).attr('dy', '1rem').attr('font-size', 12);
				});
				return;
			}

			layer
				.append('text')
				.attr('x', lx)
				.attr('y', ly)
				.attr('text-anchor', anchor)
				.attr('dy', dy)
				.attr('fill', 'var(--muted-foreground)')
				.attr('font-size', 12)
				.text(String(getValueByDataKey(d, categoryKey)));
		});
	}

	/**
	 * Radius axis: tick value labels (0, step, ... domainMax) along a spoke at
	 * `radiusAxisAngle`. Matches shadcn's radar "radius" variant.
	 */
	private renderRadiusAxis(radiusScale: d3.ScaleLinear<number, number>, domainMax: number): void {
		const layer = d3.select(this.axisLayer!);
		const angle = this.radiusAxisAngle();
		const stroke = this.radiusAxisStroke();
		// recharts rotates the radius tick labels so they sit tangent to the spoke:
		// rotate(90 - angle) about the chart centre (the layer is already centred).
		const rotate = 90 - angle;
		const tickCount = 5;
		for (let i = 0; i < tickCount; i++) {
			const value = (i / (tickCount - 1)) * domainMax;
			const r = radiusScale(value);
			const [x, y] = this.polar(r, angle);
			// recharts renders the radius tick at the default (alphabetic) baseline,
			// no vertical dy.
			layer
				.append('text')
				.attr('x', x)
				.attr('y', y)
				.attr('transform', `rotate(${rotate}, ${x}, ${y})`)
				.attr('text-anchor', 'middle')
				.attr('fill', stroke)
				.attr('font-size', 12)
				.text(String(Math.round(value)));
		}
	}

	private renderSeries(data: ChartData<T>, series: SpnRadar<T>[], radiusScale: d3.ScaleLinear<number, number>): void {
		const seriesLayer = d3.select(this.seriesLayer!);
		const dotsLayer = d3.select(this.dotsLayer!);

		series.forEach((s) => {
			const dataKey = s.dataKey();
			const stroke = s.stroke() ?? s.fill();
			const points = data.map((d, k) => {
				const value = Number(getValueByDataKey(d, dataKey)) || 0;
				const r = radiusScale(value);
				const [x, y] = this.polar(r, this.categoryAngles[k]);
				return { x, y, value, datum: d };
			});

			// Points are relative to the centre-translated series layer, so the
			// collapsed (t=0) polygon is every vertex at the origin; scale to t=1.
			const finalPts = points.map((p) => [p.x, p.y] as [number, number]);
			const path = seriesLayer
				.append('path')
				.attr('fill', s.fill())
				.attr('fill-opacity', s.fillOpacity())
				.attr('stroke', stroke)
				.attr('stroke-width', s.strokeWidth())
				.attr('stroke-linejoin', 'miter');

			if (s.isAnimationActive() && this.chartSize.isAnimationActive()) {
				path
					.attr('d', this.closedPath(finalPts.map(() => [0, 0] as [number, number])))
					.transition()
					.duration(s.animationDuration())
					.ease(d3.easeCubicOut)
					.attrTween(
						'd',
						() => (t: number) => this.closedPath(finalPts.map(([x, y]) => [x * t, y * t] as [number, number])),
					);
			} else {
				path.attr('d', this.closedPath(finalPts));
			}

			if (s.dot()) {
				points.forEach((p) => {
					const dot = dotsLayer
						.append('circle')
						.attr('cx', p.x)
						.attr('cy', p.y)
						.attr('r', s.dotRadius())
						.attr('fill', stroke)
						.attr('fill-opacity', 1)
						.attr('stroke', stroke);
					if (s.isAnimationActive() && this.chartSize.isAnimationActive()) {
						dot.attr('opacity', 0).transition().delay(s.animationDuration()).duration(120).attr('opacity', 1);
					}
				});
			}

			this.vertexData.push({
				name: s.name() || String(dataKey),
				color: s.fill(),
				dataKey,
				points,
			});
		});
	}

	private closedPath(points: [number, number][]): string {
		if (!points.length) return '';
		const [first, ...rest] = points;
		return `M${first[0]},${first[1]}` + rest.map((p) => `L${p[0]},${p[1]}`).join('') + 'Z';
	}

	// ---- interaction: hover over a category spoke shows all series values ----
	onChartMouseMove(event: MouseEvent): void {
		const svg = this.svgRef()?.nativeElement;
		if (!svg || !this.vertexData.length || !this.categoryAngles.length) return;
		const [mx, my] = d3.pointer(event, svg);
		const relX = mx - this.centerX();
		const relY = my - this.centerY();
		const distance = Math.sqrt(relX * relX + relY * relY);
		if (distance < 6) {
			clearTooltip(this.chartContext as ChartContextService<T>);
			return;
		}
		let angle = (-Math.atan2(relY, relX) * 180) / Math.PI;
		if (angle < 0) angle += 360;

		// Nearest category by angle.
		let best = 0;
		let bestDiff = Infinity;
		this.categoryAngles.forEach((a, k) => {
			const norm = ((a % 360) + 360) % 360;
			let diff = Math.abs(norm - angle);
			if (diff > 180) diff = 360 - diff;
			if (diff < bestDiff) {
				bestDiff = diff;
				best = k;
			}
		});

		const payload = this.vertexData.map((s) => ({
			name: s.name,
			value: s.points[best].value,
			dataKey: s.dataKey,
			color: s.color,
			payload: s.points[best].datum,
		}));
		const label = String(getValueByDataKey(this.data()[best], this.dataKey()));
		updateTooltip(
			this.chartContext as ChartContextService<T>,
			best,
			{ x: mx, y: my },
			payload,
			label,
			0,
			0,
			false,
			this.chartWidth(),
			this.chartHeight(),
			svg,
		);
	}

	onChartMouseLeave(): void {
		clearTooltip(this.chartContext as ChartContextService<T>);
	}
}
