import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { ChartsCardImports } from '../_lib/charts-card';
import { RadialBarChartGrid } from './radial-bar-chart--grid.example';
import { RadialBarChartLabel } from './radial-bar-chart--label.example';
import { RadialBarChartShape } from './radial-bar-chart--shape.example';
import { RadialBarChartSimple } from './radial-bar-chart--simple.example';
import { RadialBarChartStacked } from './radial-bar-chart--stacked.example';
import { RadialBarChartText } from './radial-bar-chart--text.example';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Radial Chart' },
	meta: metaWith(
		'spartan/ui - Radial Chart',
		'Faithful replicas of the shadcn/ui radial charts, built with spartan charts.',
	),
	title: 'spartan/ui - Radial Chart',
};

@Component({
	selector: 'spartan-radial-bar-chart-page',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ChartsCardImports,
		RadialBarChartSimple,
		RadialBarChartLabel,
		RadialBarChartGrid,
		RadialBarChartText,
		RadialBarChartStacked,
		RadialBarChartShape,
		NgIcon,
	],
	providers: [provideIcons({ lucideTrendingUp })],
	template: `
		<div class="grid grid-cols-1 items-start gap-x-6 gap-y-24 md:grid-cols-2 xl:grid-cols-3">
			<charts-card title="Radial Chart" description="January - June 2024" [code]="_snippets()['simple'] ?? ''">
				<spartan-radial-bar-chart-simple />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Radial Chart - Label" description="January - June 2024" [code]="_snippets()['label'] ?? ''">
				<spartan-radial-bar-chart-label />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Radial Chart - Grid" description="January - June 2024" [code]="_snippets()['grid'] ?? ''">
				<spartan-radial-bar-chart-grid />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Radial Chart - Text" description="January - June 2024" [code]="_snippets()['text'] ?? ''">
				<spartan-radial-bar-chart-text />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Radial Chart - Shape" description="January - June 2024" [code]="_snippets()['shape'] ?? ''">
				<spartan-radial-bar-chart-shape />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Radial Chart - Stacked"
				description="January - June 2024"
				[code]="_snippets()['stacked'] ?? ''"
			>
				<spartan-radial-bar-chart-stacked />
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
export default class RadialBarChartPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippetService = inject(PrimitiveSnippetsService).getSnippets('radial-bar-chart');
	protected readonly _snippets = computed(() => this._snippetService());
}
