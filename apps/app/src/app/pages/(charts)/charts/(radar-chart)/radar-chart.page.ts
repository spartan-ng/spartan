import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { ChartsCardImports } from '../_lib/charts-card';
import { RadarChartDefault } from './radar-chart--default.example';
import { RadarChartDots } from './radar-chart--dots.example';
import { RadarChartGridCircleFill } from './radar-chart--grid-circle-fill.example';
import { RadarChartGridCircleNoLines } from './radar-chart--grid-circle-no-lines.example';
import { RadarChartGridCircle } from './radar-chart--grid-circle.example';
import { RadarChartGridCustom } from './radar-chart--grid-custom.example';
import { RadarChartGridFill } from './radar-chart--grid-fill.example';
import { RadarChartGridNone } from './radar-chart--grid-none.example';
import { RadarChartLabelCustom } from './radar-chart--label-custom.example';
import { RadarChartLegend } from './radar-chart--legend.example';
import { RadarChartLinesOnly } from './radar-chart--lines-only.example';
import { RadarChartMultiple } from './radar-chart--multiple.example';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Radar Chart' },
	meta: metaWith(
		'spartan/ui - Radar Chart',
		'Faithful replicas of the shadcn/ui radar charts, built with spartan charts.',
	),
	title: 'spartan/ui - Radar Chart',
};

@Component({
	selector: 'spartan-radar-chart-page',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ChartsCardImports,
		NgIcon,
		RadarChartDefault,
		RadarChartLinesOnly,
		RadarChartDots,
		RadarChartMultiple,
		RadarChartLegend,
		RadarChartGridCircle,
		RadarChartGridCircleFill,
		RadarChartLabelCustom,
		RadarChartGridNone,
		RadarChartGridFill,
		RadarChartGridCustom,
		RadarChartGridCircleNoLines,
	],
	providers: [provideIcons({ lucideTrendingUp })],
	template: `
		<div class="grid grid-cols-1 items-start gap-x-6 gap-y-24 md:grid-cols-2 xl:grid-cols-3">
			<charts-card
				title="Radar Chart"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['default'] ?? ''"
			>
				<spartan-radar-chart-default />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Dots"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['dots'] ?? ''"
			>
				<spartan-radar-chart-dots />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Lines Only"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['linesOnly'] ?? ''"
			>
				<spartan-radar-chart-lines-only />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Custom Label"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['labelCustom'] ?? ''"
			>
				<spartan-radar-chart-label-custom />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Grid Custom"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['gridCustom'] ?? ''"
			>
				<spartan-radar-chart-grid-custom />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Grid None"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['gridNone'] ?? ''"
			>
				<spartan-radar-chart-grid-none />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Grid Circle"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['gridCircle'] ?? ''"
			>
				<spartan-radar-chart-grid-circle />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Grid Circle - No lines"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['gridCircleNoLines'] ?? ''"
			>
				<spartan-radar-chart-grid-circle-no-lines />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Grid Circle Filled"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['gridCircleFill'] ?? ''"
			>
				<spartan-radar-chart-grid-circle-fill />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Grid Filled"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['gridFill'] ?? ''"
			>
				<spartan-radar-chart-grid-fill />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Multiple"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['multiple'] ?? ''"
			>
				<spartan-radar-chart-multiple />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>January - June 2024</div>
				</div>
			</charts-card>

			<charts-card
				title="Radar Chart - Legend"
				description="Showing total visitors for the last 6 months"
				[code]="_snippets()['legend'] ?? ''"
			>
				<spartan-radar-chart-legend />
				<div chartsCardFooter>
					<div class="mb-2 flex items-center justify-center gap-4">
						<span class="flex items-center gap-1.5">
							<span class="size-2 shrink-0 rounded-[2px]" style="background: var(--chart-1)"></span>
							<span class="text-foreground text-xs leading-none">Desktop</span>
						</span>
						<span class="flex items-center gap-1.5">
							<span class="size-2 shrink-0 rounded-[2px]" style="background: var(--chart-2)"></span>
							<span class="text-foreground text-xs leading-none">Mobile</span>
						</span>
					</div>
					<div class="text-foreground flex items-center justify-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div class="text-center">January - June 2024</div>
				</div>
			</charts-card>
		</div>
	`,
})
export default class RadarChartPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippetService = inject(PrimitiveSnippetsService).getSnippets('radar-chart');
	protected readonly _snippets = computed(() => this._snippetService());
}
