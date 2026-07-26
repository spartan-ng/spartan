import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { ChartsCardImports } from '../_lib/charts-card';
import { PieChartDonutActive } from './pie-chart--donut-active.example';
import { PieChartDonutText } from './pie-chart--donut-text.example';
import { PieChartDonut } from './pie-chart--donut.example';
import { PieChartInteractive } from './pie-chart--interactive.example';
import { PieChartLabelCustom } from './pie-chart--label-custom.example';
import { PieChartLabelList } from './pie-chart--label-list.example';
import { PieChartLabel } from './pie-chart--label.example';
import { PieChartLegend } from './pie-chart--legend.example';
import { PieChartSeparatorNone } from './pie-chart--separator-none.example';
import { PieChartSimple } from './pie-chart--simple.example';
import { PieChartStacked } from './pie-chart--stacked.example';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Pie Chart' },
	meta: metaWith('spartan/ui - Pie Chart', 'A pie chart built with d3 and styled to match shadcn/ui.'),
	title: 'spartan/ui - Pie Chart',
};

@Component({
	selector: 'spartan-pie-chart-page',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ChartsCardImports,
		NgIcon,
		PieChartSimple,
		PieChartDonut,
		PieChartDonutText,
		PieChartLabel,
		PieChartStacked,
		PieChartLegend,
		PieChartDonutActive,
		PieChartLabelList,
		PieChartLabelCustom,
		PieChartSeparatorNone,
		PieChartInteractive,
	],
	providers: [provideIcons({ lucideTrendingUp })],
	template: `
		<div class="grid grid-cols-1 items-start gap-x-6 gap-y-24 md:grid-cols-2 xl:grid-cols-3">
			<charts-card title="Pie Chart" description="January - June 2024" [code]="_snippets()['simple']">
				<spartan-pie-chart-simple />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">
						Trending up by 5.2% this month
						<ng-icon name="lucideTrendingUp" size="1rem" />
					</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Pie Chart - Separator None"
				description="January - June 2024"
				[code]="_snippets()['separatorNone']"
			>
				<spartan-pie-chart-separator-none />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">Trending up by 5.2% this month</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Pie Chart - Label" description="January - June 2024" [code]="_snippets()['label']">
				<spartan-pie-chart-label />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">Trending up by 5.2% this month</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Pie Chart - Custom Label"
				description="January - June 2024"
				[code]="_snippets()['labelCustom']"
			>
				<spartan-pie-chart-label-custom />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">Trending up by 5.2% this month</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Pie Chart - Label List" description="January - June 2024" [code]="_snippets()['labelList']">
				<spartan-pie-chart-label-list />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">Trending up by 5.2% this month</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Pie Chart - Legend" description="January - June 2024" [code]="_snippets()['legend']">
				<spartan-pie-chart-legend />
			</charts-card>

			<charts-card title="Pie Chart - Donut" description="January - June 2024" [code]="_snippets()['donut']">
				<spartan-pie-chart-donut />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">Trending up by 5.2% this month</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Pie Chart - Donut Active"
				description="January - June 2024"
				[code]="_snippets()['donutActive']"
			>
				<spartan-pie-chart-donut-active />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">Trending up by 5.2% this month</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Pie Chart - Donut with Text"
				description="January - June 2024"
				[code]="_snippets()['donutText']"
			>
				<spartan-pie-chart-donut-text />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">Trending up by 5.2% this month</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card title="Pie Chart - Stacked" description="January - June 2024" [code]="_snippets()['stacked']">
				<spartan-pie-chart-stacked />
				<div chartsCardFooter>
					<div class="text-foreground flex items-center gap-2 font-medium">Trending up by 5.2% this month</div>
					<div>Showing total visitors for the last 6 months</div>
				</div>
			</charts-card>

			<charts-card
				title="Pie Chart - Interactive"
				description="January - June 2024"
				[code]="_snippets()['interactive']"
			>
				<spartan-pie-chart-interactive />
			</charts-card>
		</div>
	`,
})
export default class PieChartPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippetService = inject(PrimitiveSnippetsService).getSnippets('pie-chart');
	protected readonly _snippets = computed(() => this._snippetService());
}
