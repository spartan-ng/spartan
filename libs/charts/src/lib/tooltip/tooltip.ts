import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	DestroyRef,
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	numberAttribute,
	PLATFORM_ID,
	signal,
	TemplateRef,
	viewChild,
} from '@angular/core';
import { ChartContextService } from '../chart-context.service';
import { TooltipContext, TooltipFormatter, TooltipItemContext, TooltipLabelContext, TooltipPayload } from '../types';

/**
 * Directive to define a custom template for the entire tooltip content.
 * Full replacement - you control positioning wrapper and all content.
 *
 * @example
 * ```html
 * <spn-tooltip>
 *   <ng-template spnTooltipContent let-state>
 *     <div class="my-tooltip">
 *       <h4>{{ state.label }}</h4>
 *       @for (item of state.payload; track item.dataKey) {
 *         <div>{{ item.name }}: {{ item.value }}</div>
 *       }
 *     </div>
 *   </ng-template>
 * </spn-tooltip>
 * ```
 */
@Directive({ selector: 'ng-template[spnTooltipContent]', standalone: true })
export class SpnTooltipContentDef<T = unknown> {
	readonly template = inject<TemplateRef<TooltipContext<T>>>(TemplateRef);
}

/**
 * Directive to define a custom template for just the tooltip label.
 *
 * @example
 * ```html
 * <spn-tooltip>
 *   <ng-template spnTooltipLabel let-label>
 *     <div class="custom-label">Date: {{ label }}</div>
 *   </ng-template>
 * </spn-tooltip>
 * ```
 */
@Directive({ selector: 'ng-template[spnTooltipLabel]', standalone: true })
export class SpnTooltipLabelDef {
	readonly template = inject<TemplateRef<TooltipLabelContext>>(TemplateRef);
}

/**
 * Directive to define a custom template for individual tooltip items.
 *
 * @example
 * ```html
 * <spn-tooltip>
 *   <ng-template spnTooltipItem let-item let-formattedValue="formattedValue">
 *     <div [style.color]="item.color">
 *       {{ item.name }}: {{ formattedValue }}
 *     </div>
 *   </ng-template>
 * </spn-tooltip>
 * ```
 */
@Directive({ selector: 'ng-template[spnTooltipItem]', standalone: true })
export class SpnTooltipItemDef<T = unknown> {
	readonly template = inject<TemplateRef<TooltipItemContext<T>>>(TemplateRef);
}

/**
 * Tooltip component that displays data on hover.
 * Self-renders as HTML overlay positioned at mouse coordinates.
 *
 * Supports custom templates via:
 * - `spnTooltipContent` - Full replacement of entire tooltip
 * - `spnTooltipLabel` - Custom template for just the label
 * - `spnTooltipItem` - Custom template for each payload item
 */
@Component({
	selector: 'spn-tooltip',
	imports: [NgTemplateOutlet],
	template: `
		@if (tooltipData(); as data) {
			@if (data.active && data.payload.length > 0) {
				<!-- Full content template override - no default styling, just positioning -->
				@if (contentTemplate()?.template; as template) {
					<div #tipBox class="spn-tooltip-wrapper" [style.transform]="tooltipTransform()">
						<ng-container *ngTemplateOutlet="template; context: createTooltipContext()" />
					</div>
				} @else {
					<div #tipBox class="spn-tooltip" [style.transform]="tooltipTransform()">
						<!-- Label template override -->
						@if (labelTemplate()?.template; as template) {
							<ng-container *ngTemplateOutlet="template; context: createLabelContext()" />
						} @else {
							<div class="tooltip-label">{{ data.label }}</div>
						}
						@for (item of data.payload; track item.dataKey; let i = $index) {
							<!-- Item template override -->
							@if (itemTemplate()?.template; as template) {
								<ng-container *ngTemplateOutlet="template; context: createItemContext(item, i)" />
							} @else {
								<div class="tooltip-item" [style.color]="item.color">
									<span class="item-name">{{ item.name }}</span>
									<span class="item-separator">{{ separator() }}</span>
									<span class="item-value">{{ formatValue(item) }}</span>
								</div>
							}
						}
					</div>
				}
			}
		}
	`,
	styles: [
		`
			:host {
				pointer-events: none;
				position: absolute;
				/* Below the app's z-50 overlay layer (dialogs, the charts code drawer) so a
				   default-shown tooltip never paints over an open drawer, but above chart content. */
				z-index: 40;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}

			.spn-tooltip {
				position: absolute;
				top: 0;
				left: 0;
				background: white;
				border: 1px solid #ccc;
				border-radius: 4px;
				padding: 10px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
				font-size: 14px;
				font-family: sans-serif;
				min-width: 100px;
				animation: fadeIn 0.2s ease-in-out;
				transition: transform 0.35s ease;
				z-index: 10;
			}

			/* Positioning-only wrapper for custom content templates */
			.spn-tooltip-wrapper {
				position: absolute;
				top: 0;
				left: 0;
				animation: fadeIn 0.2s ease-in-out;
				transition: transform 0.35s ease;
				z-index: 10;
			}

			@keyframes fadeIn {
				from {
					opacity: 0;
				}
				to {
					opacity: 1;
				}
			}

			.tooltip-label {
				font-weight: 600;
				margin-bottom: 8px;
				color: #333;
			}

			.tooltip-item {
				display: flex;
				align-items: center;
				margin-bottom: 4px;
				font-size: 13px;
			}

			.tooltip-item:last-child {
				margin-bottom: 0;
			}

			.item-name {
				margin-right: 4px;
			}

			.item-separator {
				margin-right: 4px;
			}

			.item-value {
				font-weight: 600;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnTooltip {
	private readonly chartContext = inject(ChartContextService);

	// Configuration inputs
	readonly separator = input(' : ');
	readonly offset = input(10, { transform: numberAttribute });
	readonly isAnimationActive = input(true, { transform: booleanAttribute });
	readonly formatter = input<TooltipFormatter>();

	// Template queries
	readonly contentTemplate = contentChild(SpnTooltipContentDef);
	readonly labelTemplate = contentChild(SpnTooltipLabelDef);
	readonly itemTemplate = contentChild(SpnTooltipItemDef);

	// Get tooltip data from context
	readonly tooltipData = this.chartContext.tooltipData;

	// Measured tooltip box size, so we flip on real overflow (recharts behaviour)
	private readonly tipBox = viewChild<ElementRef<HTMLElement>>('tipBox');
	private readonly tipW = signal(0);
	private readonly tipH = signal(0);

	constructor() {
		const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
		let frame: number | undefined;
		inject(DestroyRef).onDestroy(() => {
			if (frame !== undefined) cancelAnimationFrame(frame);
		});

		effect(() => {
			const el = this.tipBox()?.nativeElement;
			this.tooltipData(); // re-measure when content changes
			if (!el || !isBrowser) return;
			if (frame !== undefined) cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				frame = undefined;
				const w = el.offsetWidth;
				const h = el.offsetHeight;
				if (w && w !== this.tipW()) this.tipW.set(w);
				if (h && h !== this.tipH()) this.tipH.set(h);
			});
		});
	}

	// Recharts-style positioning baked into a single transform so movement (including
	// the edge flip) animates smoothly via `transition: transform` instead of jumping.
	// The tooltip's top-left anchors at the cursor + offset, flipping to the other
	// side per-axis when it would overflow the chart.
	readonly tooltipTransform = computed(() => {
		const data = this.tooltipData();
		if (!data || !data.active) {
			return 'translate(0, 0)';
		}

		const offset = this.offset();
		const x = data.position.x;
		const y = data.position.y;
		// recharts constrains the tooltip to the plot area (inside the margins),
		// not the full chart, so it flips before reaching the x-axis label band.
		const m = this.chartContext.margin();
		const sx = this.chartContext.scaleX();
		const sy = this.chartContext.scaleY();
		const plotLeft = m.left * sx;
		const plotTop = m.top * sy;
		const plotRight = (m.left + this.chartContext.innerWidth()) * sx;
		const plotBottom = (m.top + this.chartContext.innerHeight()) * sy;

		const tipW = this.tipW();
		const tipH = this.tipH();

		// Before the box is measured we can't clamp, so fall back to a threshold flip.
		if (tipW === 0 || tipH === 0) {
			const flipX = plotRight > 0 && x > plotRight * 0.65;
			const flipY = plotBottom > 0 && y > plotBottom * 0.75;
			const tx = flipX ? `calc(${x}px - 100% - ${offset}px)` : `${x + offset}px`;
			const ty = flipY ? `calc(${y}px - 100% - ${offset}px)` : `${y + offset}px`;
			return `translate(${tx}, ${ty})`;
		}

		// recharts: anchor at cursor + offset; if the box would overflow the plot,
		// flip to the other side; then clamp it back inside the plot viewBox. The
		// clamp (not just the flip) is what keeps a tall tooltip from poking out on
		// a short chart.
		const place = (pos: number, size: number, start: number, end: number) => {
			let v = pos + offset;
			if (v + size > end) v = pos - offset - size; // flip past the cursor
			return Math.max(start, Math.min(v, end - size)); // clamp into [start, end - size]
		};
		const tx = place(x, tipW, plotLeft, plotRight);
		const ty = place(y, tipH, plotTop, plotBottom);

		return `translate(${tx}px, ${ty}px)`;
	});

	formatValue(item: TooltipPayload): string {
		const formatter = this.formatter();
		if (formatter) {
			const result = formatter(item.value, item.name, item);
			return Array.isArray(result) ? result[0] : result;
		}
		return String(item.value);
	}

	/**
	 * Creates context for spnTooltipContent template
	 */
	protected createTooltipContext(): TooltipContext {
		const data = this.tooltipData();
		return {
			$implicit: data!,
			state: data!,
			label: data?.label ?? '',
			payload: data?.payload ?? [],
			position: data?.position ?? { x: 0, y: 0 },
			active: data?.active ?? false,
		};
	}

	/**
	 * Creates context for spnTooltipLabel template
	 */
	protected createLabelContext(): TooltipLabelContext {
		const data = this.tooltipData();
		return {
			$implicit: data?.label ?? '',
			label: data?.label ?? '',
		};
	}

	/**
	 * Creates context for spnTooltipItem template
	 */
	protected createItemContext(item: TooltipPayload, index: number): TooltipItemContext {
		return {
			$implicit: item,
			item,
			index,
			separator: this.separator(),
			formattedValue: this.formatValue(item),
		};
	}
}
