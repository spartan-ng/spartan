import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ChartConfig } from './chart-config';

@Component({
	selector: 'hlm-chart-tooltip-content, [hlmChartTooltipContent]',
	imports: [NgIcon],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'chart-tooltip-content',
	},
	template: `
		<div [class]="_computedTooltipClass()">
			@if (!_nestLabel() && _tooltipLabelSafe()) {
				@if (_tooltipLabelSafe()!.trusted) {
					<div class="font-medium" [innerHTML]="_tooltipLabelSafe()!.trusted"></div>
				} @else {
					<div class="font-medium">{{ _tooltipLabelSafe()!.plain }}</div>
				}
			}
			<div class="grid gap-1.5">
				@for (item of _enrichedPayload(); track item.key; let i = $index) {
					@if (item.formattedHtml) {
						<div [innerHTML]="item.formattedHtml"></div>
					} @else {
						<div
							[class]="
								hlm(
									'[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
									indicator() === 'dot' && 'items-center'
								)
							"
						>
							@if (!hideIndicator()) {
								@if (item.icon) {
									<ng-icon [name]="item.icon" class="h-2.5 w-2.5 shrink-0" />
								} @else {
									<div
										[class]="_indicatorClass()"
										[style.--color-bg]="item.indicatorColor"
										[style.--color-border]="item.indicatorColor"
									></div>
								}
							}
							<div
								[class]="hlm('flex flex-1 justify-between leading-none', _nestLabel() ? 'items-end' : 'items-center')"
							>
								<div class="grid gap-1.5">
									@if (_nestLabel()) {
										@if (_tooltipLabelSafe()!.trusted) {
											<div class="font-medium" [innerHTML]="_tooltipLabelSafe()!.trusted"></div>
										} @else {
											<div class="font-medium">{{ _tooltipLabelSafe()!.plain }}</div>
										}
									}
									<span class="text-muted-foreground">{{ item.label }}</span>
								</div>
								@if (item.value !== null && item.value !== undefined) {
									<span class="text-foreground font-mono font-medium tabular-nums">
										{{ item.formattedValue }}
									</span>
								}
							</div>
						</div>
					}
				}
			</div>
		</div>
	`,
})
export class HlmChartTooltipContent {
	public readonly hideLabel = input<boolean>(false);
	public readonly hideIndicator = input<boolean>(false);
	public readonly indicator = input<'line' | 'dot' | 'dashed'>('dot');
	public readonly nameKey = input<string>();
	public readonly labelKey = input<string>();
	public readonly payload = input<Array<{ name: string; value: number; color: string; seriesName?: string }>>([]);
	public readonly config = input<ChartConfig>({});
	public readonly userClass = input<string>();
	public readonly label = input<string>();
	public readonly formatter =
		input<
			(
				value: number | string,
				name: string,
				index: number,
				payload: { name: string; value: number; color: string; seriesName?: string },
			) => string
		>();
	public readonly labelFormatter =
		input<
			(value: string, payload: Array<{ name: string; value: number; color: string; seriesName?: string }>) => string
		>();

	private readonly _sanitizer = inject(DomSanitizer);

	public readonly hlm = hlm;

	public readonly payloadItems = computed(() => {
		const payload = this.payload();
		const config = this.config();
		return payload.map((item) => {
			const configKey = this.nameKey() || item.seriesName || item.name;
			const itemConfig = config[configKey];
			const indicatorColor = itemConfig?.color || item.color;
			const label = itemConfig?.label || item.seriesName || item.name;
			const name = item.seriesName || item.name;
			const formattedValue = typeof item.value === 'number' ? item.value.toLocaleString() : String(item.value);
			return {
				key: name,
				name,
				label,
				value: item.value,
				formattedValue,
				indicatorColor,
				icon: itemConfig?.icon || null,
				formattedHtml: null as SafeHtml | null,
			};
		});
	});

	protected readonly _enrichedPayload = computed(() => {
		const items = this.payloadItems();
		const formatterFn = this.formatter();
		if (!formatterFn) return items;
		const rawPayload = this.payload();
		return items.map((item, index) => {
			const raw = rawPayload[index];
			const html = formatterFn(item.value, item.name, index, raw);
			return { ...item, formattedHtml: html ? this._sanitizer.bypassSecurityTrustHtml(html) : null };
		});
	});

	protected readonly _nestLabel = computed(() => this.payload().length === 1 && this.indicator() !== 'dot');

	protected readonly _tooltipLabelSafe = computed(() => {
		if (this.hideLabel() || !this.payload().length) return null;
		const label = this.label();
		const rawPayload = this.payload();
		let resolvedLabel: string | null = null;
		if (label) {
			const config = this.config();
			const labelConfig = config[label];
			resolvedLabel = (labelConfig?.label as string) ?? label;
		}
		if (resolvedLabel === null) return null;
		const labelFormatterFn = this.labelFormatter();
		if (labelFormatterFn) {
			const html = labelFormatterFn(resolvedLabel, rawPayload);
			return html
				? { plain: resolvedLabel, trusted: this._sanitizer.bypassSecurityTrustHtml(html) }
				: { plain: resolvedLabel, trusted: null };
		}
		return { plain: resolvedLabel, trusted: null };
	});

	protected readonly _computedTooltipClass = computed(() =>
		hlm(
			'border-border/50 bg-background grid min-w-32 items-start rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
			this.userClass(),
		),
	);

	protected readonly _indicatorClass = computed(() =>
		hlm(
			'shrink-0 rounded-xs border-(--color-border) bg-(--color-bg)',
			this.indicator() === 'dot' && 'h-2.5 w-2.5',
			this.indicator() === 'line' && 'w-1',
			this.indicator() === 'dashed' && 'w-0 border-[1.5px] border-dashed bg-transparent',
			this._nestLabel() && this.indicator() === 'dashed' && 'my-0.5',
		),
	);
}
