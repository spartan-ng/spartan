import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { ChartsCardImports } from '../_lib/charts-card';
import { AreaChartAxes } from './area-chart--axes.example';
import { AreaChartDefault } from './area-chart--default.example';
import { AreaChartGradient } from './area-chart--gradient.example';
import { AreaChartIcons } from './area-chart--icons.example';
import { AreaChartInteractive } from './area-chart--interactive.example';
import { AreaChartLegend } from './area-chart--legend.example';
import { AreaChartLinear } from './area-chart--linear.example';
import { AreaChartStackedExpand } from './area-chart--stacked-expand.example';
import { AreaChartStacked } from './area-chart--stacked.example';
import { AreaChartStep } from './area-chart--step.example';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Area Chart' },
	meta: metaWith(
		'spartan/ui - Area Chart',
		'Faithful replicas of the shadcn/ui area charts, built with spartan charts.',
	),
	title: 'spartan/ui - Area Chart',
};

@Component({
	selector: 'spartan-area-chart-page',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ChartsCardImports,
		AreaChartInteractive,
		AreaChartDefault,
		AreaChartLinear,
		AreaChartStep,
		AreaChartStacked,
		AreaChartStackedExpand,
		AreaChartLegend,
		AreaChartIcons,
		AreaChartGradient,
		AreaChartAxes,
		NgIcon,
	],
	providers: [provideIcons({ lucideTrendingUp })],
	template: `
		<div class="mb-20">
			<charts-card
				title="Area Chart - Interactive"
				description="Showing total visitors for the last 3 months"
				[code]="_snippets()['interactive']"
			>
				<spartan-area-chart-interactive />
			</charts-card>
		</div>

		<div class="grid grid-cols-1 items-start gap-x-6 gap-y-24 md:grid-cols-2 xl:grid-cols-3">
			<charts-card
				title="Area Chart"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['default']"
			>
				<spartan-area-chart-default />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Area Chart - Linear"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['linear']"
			>
				<spartan-area-chart-linear />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Area Chart - Step"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['step']"
			>
				<spartan-area-chart-step />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Area Chart - Legend"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['legend']"
			>
				<spartan-area-chart-legend />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Area Chart - Stacked"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['stacked']"
			>
				<spartan-area-chart-stacked />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Area Chart - Stacked Expanded"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['stackedExpand']"
			>
				<spartan-area-chart-stacked-expand />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Area Chart - Icons"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['icons']"
			>
				<spartan-area-chart-icons />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Area Chart - Gradient"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['gradient']"
			>
				<spartan-area-chart-gradient />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Area Chart - Axes"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['axes']"
			>
				<spartan-area-chart-axes />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>
		</div>
	`,
})
export default class AreaChartPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippetService = inject(PrimitiveSnippetsService).getSnippets('area-chart');
	protected readonly _snippets = computed(() => this._snippetService());
}
