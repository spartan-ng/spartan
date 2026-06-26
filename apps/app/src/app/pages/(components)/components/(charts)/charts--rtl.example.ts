import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService } from '@spartan-ng/app/app/shared/translate.service';
import { SpnBar, SpnBarChart, SpnCartesianGrid, SpnTooltip, SpnTooltipContentDef, SpnXAxis } from '@spartan-ng/charts';

interface ChartTranslation {
	dir: 'ltr' | 'rtl';
	desktop: string;
	mobile: string;
	months: Record<string, string>;
}

@Component({
	selector: 'spartan-charts-rtl',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full', '[dir]': '_dir()' },
	providers: [Directionality],
	imports: [SpnBarChart, SpnBar, SpnCartesianGrid, SpnXAxis, SpnTooltip, SpnTooltipContentDef],
	template: `
		<spn-bar-chart class="block h-[250px] w-full" [data]="_data()" [margin]="margin">
			<spn-cartesian-grid vertical="false" stroke="color-mix(in oklch, var(--border) 50%, transparent)" />
			<spn-x-axis
				dataKey="month"
				axisLine="false"
				tickLine="false"
				tickSize="0"
				tickPadding="10"
				[tickFormatter]="formatMonth"
				stroke="var(--muted-foreground)"
			/>
			<spn-bar dataKey="desktop" [name]="_t().desktop" fill="var(--chart-1)" radius="4" />
			<spn-bar dataKey="mobile" [name]="_t().mobile" fill="var(--chart-2)" radius="4" />
			<spn-tooltip>
				<ng-template spnTooltipContent let-state>
					<div
						class="bg-background border-border/50 grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl"
					>
						@if (state.label !== undefined && state.label !== null && state.label !== '') {
							<div class="font-medium">{{ formatMonth(state.label) }}</div>
						}
						@for (item of state.payload; track item.dataKey) {
							<div class="flex w-full items-center gap-2">
								<span class="size-2.5 shrink-0 rounded-[2px]" [style.background]="item.color"></span>
								<span class="text-muted-foreground">{{ item.name }}</span>
								<span class="text-foreground ms-auto font-mono font-medium tabular-nums">{{ item.value }}</span>
							</div>
						}
					</div>
				</ng-template>
			</spn-tooltip>
		</spn-bar-chart>
		<div class="flex items-center justify-center gap-4 pt-3">
			<div class="flex items-center gap-1.5">
				<span class="size-2 shrink-0 rounded-[2px] bg-[var(--chart-1)]"></span>
				<span class="text-foreground text-xs leading-none">{{ _t().desktop }}</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="size-2 shrink-0 rounded-[2px] bg-[var(--chart-2)]"></span>
				<span class="text-foreground text-xs leading-none">{{ _t().mobile }}</span>
			</div>
		</div>
	`,
})
export class ChartsRtl {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;

	protected readonly margin = { top: 12, right: 12, bottom: 24, left: 12 };

	private readonly _baseData = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 },
	];

	private readonly _translations: Record<string, ChartTranslation> = {
		en: {
			dir: 'ltr',
			desktop: 'Desktop',
			mobile: 'Mobile',
			months: { January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr', May: 'May', June: 'Jun' },
		},
		ar: {
			dir: 'rtl',
			desktop: 'سطح المكتب',
			mobile: 'الجوال',
			months: { January: 'يناير', February: 'فبراير', March: 'مارس', April: 'أبريل', May: 'مايو', June: 'يونيو' },
		},
		he: {
			dir: 'rtl',
			desktop: 'שולחני',
			mobile: 'נייד',
			months: { January: 'ינואר', February: 'פברואר', March: 'מרץ', April: 'אפריל', May: 'מאי', June: 'יוני' },
		},
	};

	protected readonly _t = computed(() => this._translations[this._language()] ?? this._translations['en']);
	protected readonly _dir = computed(() => this._t().dir);
	// SVG isn't mirrored by `dir`, so reverse the categories when RTL to read right-to-left.
	protected readonly _data = computed(() => (this._dir() === 'rtl' ? [...this._baseData].reverse() : this._baseData));
	protected readonly formatMonth = (value: unknown): string => this._t().months[String(value)] ?? String(value);

	constructor() {
		effect(() => {
			const dir = this._dir();
			untracked(() => this._directionality.valueSignal.set(dir));
		});
	}
}
