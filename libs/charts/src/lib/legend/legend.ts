import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	Directive,
	inject,
	input,
	numberAttribute,
	TemplateRef,
} from '@angular/core';
import { ChartContextService } from '../chart-context.service';
import { HorizontalAlign, LegendContext, LegendIconContext, LegendItem, LegendItemContext } from '../types';

/**
 * Directive to define a custom template for individual legend items.
 * Use this to fully customize how each legend item is rendered.
 *
 * @example
 * ```html
 * <spn-legend>
 *   <ng-template spnLegendItem let-item let-onClick="onClick">
 *     <button (click)="onClick()">{{ item.value }}</button>
 *   </ng-template>
 * </spn-legend>
 * ```
 */
@Directive({ selector: 'ng-template[spnLegendItem]', standalone: true })
export class SpnLegendItemDef {
	readonly template = inject<TemplateRef<LegendItemContext>>(TemplateRef);
}

/**
 * Directive to define a custom template for legend icons only.
 * The container and label rendering is preserved.
 *
 * @example
 * ```html
 * <spn-legend>
 *   <ng-template spnLegendIcon let-item let-iconSize="iconSize">
 *     <span class="dot" [style.background]="item.color"></span>
 *   </ng-template>
 * </spn-legend>
 * ```
 */
@Directive({ selector: 'ng-template[spnLegendIcon]', standalone: true })
export class SpnLegendIconDef {
	readonly template = inject<TemplateRef<LegendIconContext>>(TemplateRef);
}

/**
 * Directive to define a custom template for the entire legend content.
 * Full replacement - you handle all rendering.
 *
 * @example
 * ```html
 * <spn-legend>
 *   <ng-template spnLegendContent let-items let-onItemClick="onItemClick">
 *     <div class="my-legend">
 *       @for (item of items; track item.id) {
 *         <span (click)="onItemClick(item)">{{ item.value }}</span>
 *       }
 *     </div>
 *   </ng-template>
 * </spn-legend>
 * ```
 */
@Directive({ selector: 'ng-template[spnLegendContent]', standalone: true })
export class SpnLegendContentDef {
	readonly template = inject<TemplateRef<LegendContext>>(TemplateRef);
}

/**
 * Legend component that displays chart series.
 * Self-renders as HTML overlay positioned relative to chart.
 *
 * Supports custom templates via:
 * - `spnLegendContent` - Full replacement of entire legend
 * - `spnLegendItem` - Custom template for each legend item
 * - `spnLegendIcon` - Custom template for just the icon SVG
 */
@Component({
	selector: 'spn-legend',
	imports: [NgTemplateOutlet],
	template: `
		@if (items().length > 0) {
			<!-- Full content template override -->
			@if (contentTemplate()?.template; as template) {
				<ng-container *ngTemplateOutlet="template; context: createLegendContext()" />
			} @else {
				<div class="spn-legend" [class]="layoutClass()" [class]="alignClass()">
					@for (item of items(); track item.id; let i = $index; let first = $first; let last = $last) {
						<!-- Item template override -->
						@if (itemTemplate()?.template; as template) {
							<ng-container *ngTemplateOutlet="template; context: createItemContext(item, i, first, last)" />
						} @else {
							<div
								class="legend-item"
								[class.inactive]="item.inactive"
								role="button"
								tabindex="0"
								(click)="onItemClick(item)"
								(keydown.enter)="onItemClick(item)"
								(keydown.space)="onItemClick(item)"
							>
								<!-- Icon template override -->
								@if (iconTemplate()?.template; as template) {
									<ng-container *ngTemplateOutlet="template; context: createIconContext(item)" />
								} @else {
									<svg [attr.width]="iconSize()" [attr.height]="iconSize()" class="legend-icon">
										@if (item.type === 'line') {
											<line
												[attr.x1]="0"
												[attr.y1]="iconSize() / 2"
												[attr.x2]="iconSize()"
												[attr.y2]="iconSize() / 2"
												[attr.stroke]="item.color"
												stroke-width="2"
											/>
										} @else if (item.type === 'scatter') {
											<circle
												[attr.cx]="iconSize() / 2"
												[attr.cy]="iconSize() / 2"
												[attr.r]="iconSize() / 3"
												[attr.fill]="item.color"
											/>
										} @else if (item.type === 'pie') {
											<!-- Pie wedge icon -->
											<path
												[attr.d]="
													'M ' +
													iconSize() / 2 +
													' ' +
													iconSize() / 2 +
													' L ' +
													iconSize() +
													' ' +
													iconSize() / 2 +
													' A ' +
													iconSize() / 2 +
													' ' +
													iconSize() / 2 +
													' 0 0 1 ' +
													iconSize() / 2 +
													' ' +
													iconSize() +
													' Z'
												"
												[attr.fill]="item.color"
											/>
										} @else if (item.type === 'heatmap') {
											<!-- Gradient rect for heatmap -->
											<defs>
												<linearGradient [attr.id]="'heatmap-gradient-' + item.id">
													<stop offset="0%" stop-color="#f7fbff" />
													<stop offset="100%" [attr.stop-color]="item.color === 'blues' ? '#08519c' : '#8884d8'" />
												</linearGradient>
											</defs>
											<rect
												[attr.width]="iconSize()"
												[attr.height]="iconSize()"
												[attr.fill]="'url(#heatmap-gradient-' + item.id + ')'"
											/>
										} @else {
											<!-- Default rect for bar, area, histogram -->
											<rect [attr.width]="iconSize()" [attr.height]="iconSize()" [attr.fill]="item.color" />
										}
									</svg>
								}
								<span class="legend-label">{{ item.value }}</span>
							</div>
						}
					}
				</div>
			}
		}
	`,
	styles: [
		`
			:host {
				display: block;
				position: absolute;
				inset-inline: 0;
				z-index: 10;
			}

			.spn-legend {
				display: flex;
				gap: 16px;
				padding: 8px;
				font-size: 14px;
				font-family: sans-serif;
			}

			.spn-legend.horizontal {
				flex-direction: row;
				flex-wrap: wrap;
			}

			.spn-legend.vertical {
				flex-direction: column;
			}

			.spn-legend.align-left {
				justify-content: flex-start;
			}

			.spn-legend.align-center {
				justify-content: center;
			}

			.spn-legend.align-right {
				justify-content: flex-end;
			}

			.legend-item {
				display: flex;
				align-items: center;
				gap: 6px;
				cursor: pointer;
				user-select: none;
				transition: opacity 0.2s;
			}

			.legend-item:hover {
				opacity: 0.8;
			}

			.legend-item.inactive {
				opacity: 0.4;
			}

			.legend-icon {
				flex-shrink: 0;
			}

			.legend-label {
				color: #666;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpnLegend {
	private readonly chartContext = inject(ChartContextService);

	// Configuration inputs
	readonly layout = input<'horizontal' | 'vertical'>('horizontal');
	readonly align = input<HorizontalAlign>('center');
	readonly iconSize = input(14, { transform: numberAttribute });

	// Template queries
	readonly itemTemplate = contentChild(SpnLegendItemDef);
	readonly iconTemplate = contentChild(SpnLegendIconDef);
	readonly contentTemplate = contentChild(SpnLegendContentDef);

	// Computed classes for styling
	readonly layoutClass = computed(() => this.layout());
	readonly alignClass = computed(() => `align-${this.align()}`);

	// Get items from chart context
	readonly items = computed((): LegendItem[] => {
		return this.chartContext.graphicalElements().map((el) => ({
			id: el.id,
			value: el.name || String(el.dataKey),
			type: el.type,
			color: el.color || '#8884d8',
			inactive: el.hide,
		}));
	});

	onItemClick(_item: LegendItem): void {
		// Placeholder for series toggle-on-click; intentionally a no-op until that's implemented.
	}

	/**
	 * Creates context for spnLegendItem template
	 */
	protected createItemContext(item: LegendItem, index: number, first: boolean, last: boolean): LegendItemContext {
		return {
			$implicit: item,
			item,
			index,
			first,
			last,
			onClick: () => this.onItemClick(item),
		};
	}

	/**
	 * Creates context for spnLegendIcon template
	 */
	protected createIconContext(item: LegendItem): LegendIconContext {
		return {
			$implicit: item,
			iconSize: this.iconSize(),
			color: item.color,
			type: item.type,
		};
	}

	/**
	 * Creates context for spnLegendContent template
	 */
	protected createLegendContext(): LegendContext {
		return {
			$implicit: this.items(),
			items: this.items(),
			layout: this.layout(),
			align: this.align(),
			iconSize: this.iconSize(),
			onItemClick: (item: LegendItem) => this.onItemClick(item),
		};
	}
}
