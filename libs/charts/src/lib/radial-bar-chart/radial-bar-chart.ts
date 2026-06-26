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
import { SpnRadialBar } from '../radial-bar/radial-bar';
import { ChartData, ChartMargin, DataKey, DEFAULT_MARGIN, getValueByDataKey } from '../types';

interface SectorDatum<T> {
	datum: T;
	value: number;
	innerRadius: number;
	outerRadius: number;
	startAngle: number; // degrees, recharts convention (0 = 3 o'clock, CCW positive)
	endAngle: number;
	fill: string;
	cornerRadius: number;
	name: string;
	dataKey: DataKey<T>;
}

/**
 * Radial bar chart container.
 *
 * Renders polar bars: each datum is an arc between an inner and outer radius,
 * with the sweep angle driven by a linear value scale. Supports a configurable
 * start/end angle, a background track, rounded corners and stacked series.
 *
 * Child <spn-radial-bar> components are configuration collectors only; this
 * container queries them and performs all SVG rendering (config-collector pattern).
 */
@Component({
	selector: 'spn-radial-bar-chart',
	host: { '[attr.title]': 'null' },
	template: `
		<svg #svgElement [attr.width]="chartWidth()" [attr.height]="chartHeight()" class="spn-radial-bar-chart">
			<ng-content />
			<g [attr.transform]="'translate(' + centerX() + ',' + centerY() + ')'">
				<g class="grid-layer"></g>
				<g class="bars-layer"></g>
				<g class="labels-layer"></g>
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
			.spn-radial-bar-chart {
				font-family: sans-serif;
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [ChartContextService],
})
export class SpnRadialBarChart<T = unknown> implements AfterContentInit {
	readonly data = input.required<ChartData<T>>();
	readonly width = input(400, { transform: numberAttribute });
	readonly height = input(400, { transform: numberAttribute });
	readonly margin = input<ChartMargin>(DEFAULT_MARGIN);
	readonly responsive = input(true, { transform: booleanAttribute });

	/** Inner radius of the innermost ring (px). */
	readonly innerRadius = input(30, { transform: numberAttribute });
	/** Outer radius of the outermost ring (px). */
	readonly outerRadius = input(110, { transform: numberAttribute });

	/** Sweep start angle in degrees (recharts convention: 0 = 3 o'clock, CCW positive). */
	readonly startAngle = input(0, { transform: numberAttribute });
	readonly endAngle = input(360, { transform: numberAttribute });

	/** Gap fraction between rings (0..1). recharts uses ~0.1875 for the default look. */
	readonly barPadding = input(0.1875, { transform: numberAttribute });

	readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgElement');
	readonly bars = contentChildren(SpnRadialBar);
	readonly grids = contentChildren(SpnPolarGrid);

	private readonly chartContext = inject(ChartContextService<T>);
	private readonly chartSize = injectChartResponsiveSize(this.width, this.height, this.responsive);
	protected readonly chartWidth = this.chartSize.width;
	protected readonly chartHeight = this.chartSize.height;

	private gridLayer?: SVGGElement;
	private barsLayer?: SVGGElement;
	private labelsLayer?: SVGGElement;

	private sectors: SectorDatum<T>[] = [];

	readonly centerX = computed(() => this.chartWidth() / 2);
	readonly centerY = computed(() => this.chartHeight() / 2);

	constructor() {
		effect(() => {
			this.chartContext.data.set(this.data());
			this.chartContext.width.set(this.chartWidth());
			this.chartContext.height.set(this.chartHeight());
			this.chartContext.margin.set(this.margin());
			this.bars();
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
		this.barsLayer = svg.querySelector('.bars-layer') as SVGGElement;
		this.labelsLayer = svg.querySelector('.labels-layer') as SVGGElement;
	}

	private render(): void {
		try {
			if (!this.barsLayer || !this.labelsLayer || !this.gridLayer) {
				this.setupLayers();
				if (!this.barsLayer || !this.labelsLayer || !this.gridLayer) return;
			}
			d3.select(this.gridLayer).selectAll('*').remove();
			d3.select(this.barsLayer).selectAll('*').remove();
			d3.select(this.labelsLayer).selectAll('*').remove();
			this.sectors = [];

			const data = this.data();
			const bars = this.bars().filter((b) => !b.hide()) as SpnRadialBar<T>[];
			if (!data.length || !bars.length) return;

			const stacked = bars.some((b) => b.stackId());
			// The polar grid sits behind the bars and uses the primary bar's value.
			this.renderPolarGrid(data, bars[0]);
			if (stacked) {
				this.renderStacked(data, bars);
			} else {
				this.renderRings(data, bars[0]);
			}
		} catch (error) {
			console.error('[SpnRadialBarChart] Render error:', error);
		}
	}

	/**
	 * Polar grid for a radial bar chart (recharts PolarGrid gridType="circle"):
	 * concentric circles at each ring band, plus radial spokes at the value
	 * axis tick positions. Only drawn when an <spn-polar-grid> child is present.
	 */
	private renderPolarGrid(data: ChartData<T>, bar: SpnRadialBar<T>): void {
		const grid = this.grids()[0];
		if (!grid) return;
		const stroke = grid.stroke();
		const strokeWidth = grid.strokeWidth();
		const layer = d3.select(this.gridLayer!);

		const inner = this.innerRadius();
		const outer = this.outerRadius();
		const n = data.length;
		const step = (outer - inner) / n;

		// Concentric circles: one per ring band, at the band centre.
		for (let i = 0; i < n; i++) {
			const r = inner + step * i + step / 2;
			layer
				.append('circle')
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', r)
				.attr('fill', 'none')
				.attr('stroke', stroke)
				.attr('stroke-width', strokeWidth);
		}

		if (grid.radialLines()) {
			// Radial spokes at the value-axis nice tick positions.
			const values = data.map((d) => Number(getValueByDataKey(d, bar.dataKey())) || 0);
			const maxValue = Math.max(...values, 0) || 1;
			const start = this.startAngle();
			const end = this.endAngle();
			const angleScale = d3.scaleLinear().domain([0, maxValue]).range([start, end]);
			const ticks = d3.ticks(0, maxValue, 14);
			ticks.forEach((v) => {
				const [x, y] = this.polar(outer, angleScale(v));
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

	/** Default mode: one ring per datum, sweep angle proportional to value. */
	private renderRings(data: ChartData<T>, bar: SpnRadialBar<T>): void {
		const radii = this.computeRingRadii(data.length);
		const dataKey = bar.dataKey();
		const values = data.map((d) => Number(getValueByDataKey(d, dataKey)) || 0);
		const maxValue = Math.max(...values, 0) || 1;

		const start = this.startAngle();
		const end = this.endAngle();
		const angleScale = d3.scaleLinear().domain([0, maxValue]).range([start, end]);

		data.forEach((datum, i) => {
			const { innerRadius, outerRadius } = radii[i];
			const value = values[i];
			const fill = bar.fill() ?? String(getValueByDataKey(datum, 'fill') ?? 'var(--chart-1)');
			const nameKey = bar.nameKey() ?? bar.labelKey();
			const name = nameKey ? String(getValueByDataKey(datum, nameKey)) : String(value);
			this.sectors.push({
				datum,
				value,
				innerRadius,
				outerRadius,
				startAngle: start,
				endAngle: angleScale(value),
				fill,
				cornerRadius: bar.cornerRadius(),
				name,
				dataKey,
			});
		});

		this.drawSectors(bar, data);
	}

	/** Stacked mode: a single datum, each series is an angular segment of one ring. */
	private renderStacked(data: ChartData<T>, bars: SpnRadialBar<T>[]): void {
		// Stacked radial uses the first datum and one ring (inner..outer).
		// recharts insets the single radial band by ~3px on each side.
		const datum = data[0];
		const innerRadius = this.innerRadius() + 3;
		const outerRadius = this.outerRadius() - 3;

		// recharts maps the angle by the largest single bar value (not the sum) and
		// stacks segments end-to-end from the start angle, clamping at the end angle.
		const start = this.startAngle();
		const end = this.endAngle();
		const maxValue = Math.max(0, ...bars.map((b) => Number(getValueByDataKey(datum, b.dataKey())) || 0)) || 1;
		const span = end - start;

		// recharts paints later-declared series outermost; segments stack from start angle.
		let cumDeg = 0;
		bars.forEach((bar) => {
			const value = Number(getValueByDataKey(datum, bar.dataKey())) || 0;
			const segDeg = (value / maxValue) * span;
			const segStart = start + cumDeg;
			const segEnd = Math.min(start + cumDeg + segDeg, end);
			cumDeg += segDeg;
			const fill = bar.fill() ?? 'var(--chart-1)';
			this.sectors.push({
				datum,
				value,
				innerRadius,
				outerRadius,
				startAngle: segStart,
				endAngle: segEnd,
				fill,
				cornerRadius: bar.cornerRadius(),
				name: bar.name() || String(bar.dataKey()),
				dataKey: bar.dataKey(),
			});
		});

		this.drawSectorsStacked(bars);
	}

	private computeRingRadii(n: number): { innerRadius: number; outerRadius: number }[] {
		const inner = this.innerRadius();
		const outer = this.outerRadius();
		const padding = this.barPadding();
		// Band scale: outermost ring is the FIRST datum (recharts paints datum 0 outermost).
		const scale = d3
			.scaleBand<number>()
			.domain(d3.range(n))
			.range([inner, outer])
			.paddingInner(padding)
			.paddingOuter(padding / 2);
		const result: { innerRadius: number; outerRadius: number }[] = [];
		for (let i = 0; i < n; i++) {
			// datum 0 -> innermost ring (matches recharts RadialBarChart).
			const r0 = scale(i)!;
			result.push({ innerRadius: r0, outerRadius: r0 + scale.bandwidth() });
		}
		return result;
	}

	/** recharts polar point: angle in degrees, 0 = 3 o'clock, positive = CCW. */
	private polar(radius: number, angleDeg: number): [number, number] {
		const rad = (-angleDeg * Math.PI) / 180;
		return [radius * Math.cos(rad), radius * Math.sin(rad)];
	}

	private arcPath(s: SectorDatum<T>): string {
		return this.sectorPath(s.innerRadius, s.outerRadius, s.startAngle, s.endAngle, s.cornerRadius);
	}

	private sectorPath(innerR: number, outerR: number, startDeg: number, endDeg: number, corner: number): string {
		const arc = d3
			.arc<unknown>()
			.innerRadius(innerR)
			.outerRadius(outerR)
			.startAngle((Math.PI / 180) * (90 - startDeg))
			.endAngle((Math.PI / 180) * (90 - endDeg))
			.cornerRadius(corner);
		return arc({}) || '';
	}

	private drawSectors(bar: SpnRadialBar<T>, data: ChartData<T>): void {
		const layer = d3.select(this.barsLayer!);

		// Background tracks (full sweep) behind each ring.
		if (bar.background()) {
			this.sectors.forEach((s) => {
				layer
					.append('path')
					.attr('class', 'radial-bar-background')
					.attr('fill', '#eee')
					.attr('opacity', 1)
					.attr('d', this.sectorPath(s.innerRadius, s.outerRadius, this.startAngle(), this.endAngle(), s.cornerRadius));
			});
		}

		const animate = bar.isAnimationActive() && this.chartSize.isAnimationActive();
		const duration = bar.animationDuration();
		this.sectors.forEach((s, i) => {
			const path = layer
				.append('path')
				.attr('class', `radial-bar-sector sector-${i}`)
				.attr('data-index', i)
				.attr('fill', s.fill)
				.attr('stroke', bar.stroke() ?? 'none')
				.attr('stroke-width', bar.strokeWidth());
			this.applySectorPath(path, s, animate, duration, i * 50);
		});

		if (bar.label()) {
			this.drawRingLabels(bar, data);
		}
	}

	private drawSectorsStacked(bars: SpnRadialBar<T>[]): void {
		const layer = d3.select(this.barsLayer!);
		this.sectors.forEach((s, i) => {
			const bar = bars[i];
			const animate = (bar?.isAnimationActive() ?? false) && this.chartSize.isAnimationActive();
			const duration = bar?.animationDuration() ?? 400;
			const path = layer
				.append('path')
				.attr('class', `radial-bar-sector sector-${i}`)
				.attr('data-index', i)
				.attr('fill', s.fill)
				.attr('stroke', bar?.stroke() ?? 'transparent')
				.attr('stroke-width', bar?.strokeWidth() ?? 0);
			this.applySectorPath(path, s, animate, duration, i * 50);
		});
	}

	/** Draw a sector's arc, optionally sweeping the end angle in from the start angle. */
	private applySectorPath(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		sel: d3.Selection<any, unknown, null, undefined>,
		s: SectorDatum<T>,
		animate: boolean,
		duration: number,
		delay: number,
	): void {
		if (animate) {
			const interpolate = d3.interpolate(s.startAngle, s.endAngle);
			sel
				.attr('d', this.sectorPath(s.innerRadius, s.outerRadius, s.startAngle, s.startAngle, s.cornerRadius))
				.transition('entry')
				.duration(duration)
				.delay(delay)
				.attrTween(
					'd',
					() => (t) => this.sectorPath(s.innerRadius, s.outerRadius, s.startAngle, interpolate(t), s.cornerRadius),
				);
		} else {
			sel.attr('d', this.arcPath(s));
		}
	}

	private drawRingLabels(bar: SpnRadialBar<T>, data: ChartData<T>): void {
		const layer = d3.select(this.labelsLayer!);
		const labelKey = bar.labelKey() ?? bar.nameKey();
		if (!labelKey) return;
		const uid = Math.random().toString(36).substr(2, 6);
		const offset = 5; // recharts LabelList offset (px along the arc)
		this.sectors.forEach((s, i) => {
			const text = String(getValueByDataKey(data[i], labelKey));
			// Label radius = centre of the bar's ring band, matching recharts.
			const r = (s.innerRadius + s.outerRadius) / 2;
			// recharts places "insideStart" labels a few px past the bar's start,
			// then runs the text along an arc following the bar's sweep direction so
			// it reads upright. Build that arc as a path and bind the text to it.
			const dir = s.endAngle >= s.startAngle ? 1 : -1;
			const offsetDeg = ((offset / r) * 180) / Math.PI;
			const a0 = s.startAngle + dir * offsetDeg;
			const a1 = a0 + dir * 359.9; // almost a full circle so the text never clips
			const [sx, sy] = this.polar(r, a0);
			const [ex, ey] = this.polar(r, a1);
			// SVG sweep flag: dir=1 (CCW / increasing recharts angle) -> sweep 0.
			const sweep = dir === 1 ? 0 : 1;
			const pathId = `spn-radial-label-${uid}-${i}`;
			const pathD = `M${sx},${sy}A${r},${r},0,1,${sweep},${ex},${ey}`;

			const textEl = layer
				.append('text')
				.attr('dominant-baseline', 'central')
				.attr('fill', '#fff')
				.attr('font-size', 11)
				.style('text-transform', 'capitalize')
				.style('mix-blend-mode', 'luminosity');
			textEl.append('defs').append('path').attr('id', pathId).attr('d', pathD);
			textEl.append('textPath').attr('href', `#${pathId}`).attr('xlink:href', `#${pathId}`).text(text);
		});
	}

	// ---- interaction ----
	onChartMouseMove(event: MouseEvent): void {
		const svg = this.svgRef()?.nativeElement;
		if (!svg || !this.sectors.length) return;
		const [mx, my] = d3.pointer(event, svg);
		const relX = mx - this.centerX();
		const relY = my - this.centerY();
		const distance = Math.sqrt(relX * relX + relY * relY);
		// recharts angle: 0 = 3 o'clock, CCW positive
		let angle = (-Math.atan2(relY, relX) * 180) / Math.PI;
		if (angle < 0) angle += 360;

		for (let i = 0; i < this.sectors.length; i++) {
			const s = this.sectors[i];
			if (distance < s.innerRadius || distance > s.outerRadius) continue;
			const lo = Math.min(s.startAngle, s.endAngle);
			const hi = Math.max(s.startAngle, s.endAngle);
			const a = angle;
			const within = (a >= lo && a <= hi) || (a + 360 >= lo && a + 360 <= hi);
			if (!within) continue;
			const payload = [
				{
					name: s.name,
					value: s.value,
					dataKey: s.dataKey,
					color: s.fill,
					payload: s.datum,
				},
			];
			updateTooltip(
				this.chartContext as ChartContextService<T>,
				i,
				{ x: mx, y: my },
				payload,
				s.name,
				0,
				0,
				false,
				this.chartWidth(),
				this.chartHeight(),
				svg,
			);
			return;
		}
		clearTooltip(this.chartContext as ChartContextService<T>);
	}

	onChartMouseLeave(): void {
		clearTooltip(this.chartContext as ChartContextService<T>);
	}
}
