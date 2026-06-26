import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { ChartsCardImports } from '../_lib/charts-card';
import { TooltipAdvanced } from './chart-tooltip--advanced.example';
import { TooltipDefault } from './chart-tooltip--default.example';
import { TooltipFormatter } from './chart-tooltip--formatter.example';
import { TooltipIcons } from './chart-tooltip--icons.example';
import { TooltipIndicatorLine } from './chart-tooltip--indicator-line.example';
import { TooltipIndicatorNone } from './chart-tooltip--indicator-none.example';
import { TooltipLabelCustom } from './chart-tooltip--label-custom.example';
import { TooltipLabelFormatter } from './chart-tooltip--label-formatter.example';
import { TooltipLabelNone } from './chart-tooltip--label-none.example';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Tooltip' },
	meta: metaWith(
		'spartan/ui - Tooltip',
		'Faithful replicas of the shadcn/ui chart tooltips, built with spartan charts.',
	),
	title: 'spartan/ui - Tooltip',
};

@Component({
	selector: 'spartan-tooltip-page',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ChartsCardImports,
		TooltipDefault,
		TooltipIndicatorLine,
		TooltipIndicatorNone,
		TooltipLabelCustom,
		TooltipLabelFormatter,
		TooltipLabelNone,
		TooltipFormatter,
		TooltipIcons,
		TooltipAdvanced,
	],
	template: `
		<div class="grid grid-cols-1 items-start gap-x-6 gap-y-24 md:grid-cols-2 xl:grid-cols-3">
			<charts-card title="Tooltip - Default" description="Default tooltip." [code]="_snippets()['default'] ?? ''">
				<spartan-tooltip-default />
			</charts-card>

			<charts-card
				title="Tooltip - Line Indicator"
				description="Tooltip with line indicator."
				[code]="_snippets()['indicatorLine'] ?? ''"
			>
				<spartan-tooltip-indicator-line />
			</charts-card>

			<charts-card
				title="Tooltip - No Indicator"
				description="Tooltip with no indicator."
				[code]="_snippets()['indicatorNone'] ?? ''"
			>
				<spartan-tooltip-indicator-none />
			</charts-card>

			<charts-card
				title="Tooltip - Custom label"
				description="Tooltip with a custom label."
				[code]="_snippets()['labelCustom'] ?? ''"
			>
				<spartan-tooltip-label-custom />
			</charts-card>

			<charts-card
				title="Tooltip - Label Formatter"
				description="Tooltip with label formatter."
				[code]="_snippets()['labelFormatter'] ?? ''"
			>
				<spartan-tooltip-label-formatter />
			</charts-card>

			<charts-card
				title="Tooltip - No Label"
				description="Tooltip with no label."
				[code]="_snippets()['labelNone'] ?? ''"
			>
				<spartan-tooltip-label-none />
			</charts-card>

			<charts-card
				title="Tooltip - Formatter"
				description="Tooltip with custom formatter."
				[code]="_snippets()['formatter'] ?? ''"
			>
				<spartan-tooltip-formatter />
			</charts-card>

			<charts-card title="Tooltip - Icons" description="Tooltip with icons." [code]="_snippets()['icons'] ?? ''">
				<spartan-tooltip-icons />
			</charts-card>

			<charts-card
				title="Tooltip - Advanced"
				description="Tooltip with advanced customizations."
				[code]="_snippets()['advanced'] ?? ''"
			>
				<spartan-tooltip-advanced />
			</charts-card>
		</div>
	`,
})
export default class TooltipPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippetService = inject(PrimitiveSnippetsService).getSnippets('chart-tooltip');
	protected readonly _snippets = computed(() => this._snippetService());
}
