import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ChartCodeDrawerService } from '../_lib/chart-code-drawer';
import { ChartsCardImports } from '../_lib/charts-card';
import { INTERACTIVE_DATA } from '../_lib/interactive-data';
import { BarChartActive } from './bar-chart--active.example';
import { BarChartDefault } from './bar-chart--default.example';
import { BarChartHorizontal } from './bar-chart--horizontal.example';
import { BarChartInteractive } from './bar-chart--interactive.example';
import { BarChartLabelCustom } from './bar-chart--label-custom.example';
import { BarChartLabel } from './bar-chart--label.example';
import { BarChartMixed } from './bar-chart--mixed.example';
import { BarChartMultiple } from './bar-chart--multiple.example';
import { BarChartNegative } from './bar-chart--negative.example';
import { BarChartStacked } from './bar-chart--stacked.example';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Bar Chart' },
	meta: metaWith('spartan/ui - Bar Chart', 'A bar chart built with d3 and styled to match shadcn/ui.'),
	title: 'spartan/ui - Bar Chart',
};

@Component({
	selector: 'spartan-bar-chart-page',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ChartsCardImports,
		BarChartDefault,
		BarChartHorizontal,
		BarChartMultiple,
		BarChartLabel,
		BarChartStacked,
		BarChartMixed,
		BarChartNegative,
		BarChartActive,
		BarChartLabelCustom,
		BarChartInteractive,
		HlmButtonImports,
		NgIcon,
	],
	providers: [provideIcons({ lucideTrendingUp })],
	template: `
		<div class="bg-card text-card-foreground relative flex flex-col gap-6 rounded-xl border py-4 sm:py-0">
			<div class="absolute -top-10 right-0 z-10 flex items-center gap-1">
				<button
					hlmBtn
					variant="outline"
					size="sm"
					type="button"
					(click)="_drawer.open(_snippets()['interactive'] ?? '')"
				>
					View Code
				</button>
			</div>

			<div class="flex flex-col items-stretch border-b sm:flex-row">
				<div class="flex flex-1 flex-col justify-center gap-1.5 px-6 pb-3 sm:pb-0">
					<h3 class="text-base leading-none font-semibold">Bar Chart - Interactive</h3>
					<p class="text-muted-foreground text-sm">Showing total visitors for the last 3 months</p>
				</div>
				<div class="flex">
					@for (key of seriesKeys; track key) {
						<button
							type="button"
							class="data-[active=true]:bg-muted/50 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
							[attr.data-active]="active() === key"
							(click)="active.set(key)"
						>
							<span class="text-muted-foreground text-xs">{{ key === 'desktop' ? 'Desktop' : 'Mobile' }}</span>
							<span class="text-lg leading-none font-bold sm:text-3xl">{{ totals()[key].toLocaleString() }}</span>
						</button>
					}
				</div>
			</div>

			<div class="px-2 sm:p-6">
				<spartan-bar-chart-interactive [interactiveKey]="active()" />
			</div>
		</div>

		<div class="mt-20 grid grid-cols-1 items-start gap-x-6 gap-y-24 md:grid-cols-2 xl:grid-cols-3">
			<charts-card title="Bar Chart" description="January - June 2024" [code]="_snippets()['default'] ?? ''">
				<spartan-bar-chart-default />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Bar Chart - Horizontal"
				description="January - June 2024"
				[code]="_snippets()['horizontal'] ?? ''"
			>
				<spartan-bar-chart-horizontal />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Bar Chart - Multiple"
				description="January - June 2024"
				[code]="_snippets()['multiple'] ?? ''"
			>
				<spartan-bar-chart-multiple />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Bar Chart - Stacked + Legend"
				description="January - June 2024"
				[code]="_snippets()['stacked'] ?? ''"
			>
				<spartan-bar-chart-stacked />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Bar Chart - Label" description="January - June 2024" [code]="_snippets()['label'] ?? ''">
				<spartan-bar-chart-label />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Bar Chart - Custom Label"
				description="January - June 2024"
				[code]="_snippets()['labelCustom'] ?? ''"
			>
				<spartan-bar-chart-label-custom />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Bar Chart - Mixed" description="January - June 2024" [code]="_snippets()['mixed'] ?? ''">
				<spartan-bar-chart-mixed />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Bar Chart - Active" description="January - June 2024" [code]="_snippets()['active'] ?? ''">
				<spartan-bar-chart-active />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Bar Chart - Negative"
				description="January - June 2024"
				[code]="_snippets()['negative'] ?? ''"
			>
				<spartan-bar-chart-negative />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>
		</div>
	`,
})
export default class BarChartPage {
	constructor() {
		injectComponentDocs();
	}

	protected readonly _drawer = inject(ChartCodeDrawerService);
	private readonly _snippetService = inject(PrimitiveSnippetsService).getSnippets('bar-chart');
	protected readonly _snippets = computed(() => this._snippetService());

	protected readonly seriesKeys = ['desktop', 'mobile'] as const;
	protected readonly active = signal<'desktop' | 'mobile'>('desktop');
	protected readonly totals = computed(() => ({
		desktop: INTERACTIVE_DATA.reduce((sum, d) => sum + d.desktop, 0),
		mobile: INTERACTIVE_DATA.reduce((sum, d) => sum + d.mobile, 0),
	}));
}
