import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockViewer } from '@spartan-ng/app/app/shared/blocks/block-viewer';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Charts', 'Chart blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Charts',
};

@Component({
	selector: 'spartan-charts',
	imports: [BlockViewer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col',
	},
	template: `
		<!-- Area Charts -->
		<spartan-block-viewer block="chart-area-default" title="A simple area chart" id="chart-area-1">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An area chart with gradient fill showing total visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-area-gradient" title="An area chart with gradient fill" id="chart-area-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An area chart with gradient fill showing total visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-area-stacked" title="A stacked area chart" id="chart-area-3">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A stacked area chart showing desktop, mobile, and other visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-area-stacked-expand" title="A stacked area chart with expand" id="chart-area-4">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A stacked area chart with an expand animation showing desktop, mobile, and other visitors.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-area-axes" title="An area chart with axes" id="chart-area-5">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An area chart with axes labels showing total visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-area-icons" title="An area chart with icons" id="chart-area-6">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An area chart with icons in the legend showing total visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-area-legend" title="An area chart with a legend" id="chart-area-7">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An area chart with a custom legend showing desktop and mobile visitors.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-area-linear" title="An area chart with linear scale" id="chart-area-8">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An area chart using a linear scale for the x-axis.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-area-step" title="An area chart with step" id="chart-area-9">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An area chart with step interpolation showing total visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-area-interactive" title="An interactive area chart" id="chart-area-10">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An interactive area chart with a tooltip showing visitors over the last 90 days.
			</p>
		</spartan-block-viewer>

		<!-- Bar Charts -->
		<spartan-block-viewer block="chart-bar-default" title="A simple bar chart" id="chart-bar-1">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A bar chart showing total visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-bar-horizontal" title="A horizontal bar chart" id="chart-bar-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A horizontal bar chart showing total visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-bar-multiple" title="A bar chart with multiple series" id="chart-bar-3">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A bar chart showing desktop and mobile visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-bar-stacked" title="A stacked bar chart" id="chart-bar-4">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A stacked bar chart showing desktop, mobile, and other visitors.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-bar-label" title="A bar chart with labels" id="chart-bar-5">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A bar chart with data labels on each bar.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-bar-label-custom" title="A bar chart with custom labels" id="chart-bar-6">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A bar chart with custom formatted labels on each bar.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-bar-mixed" title="A mixed bar chart" id="chart-bar-7">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A horizontal bar chart with individual bar colors for each browser.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-bar-negative" title="A bar chart with negative values" id="chart-bar-8">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A bar chart showing both positive and negative values.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-bar-active" title="A bar chart with active bar" id="chart-bar-9">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A bar chart with an active/highlighted bar.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-bar-interactive" title="An interactive bar chart" id="chart-bar-10">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An interactive bar chart with a tooltip showing visitors over the last 90 days.
			</p>
		</spartan-block-viewer>

		<!-- Line Charts -->
		<spartan-block-viewer block="chart-line-default" title="A simple line chart" id="chart-line-1">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A line chart showing total visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-line-dots" title="A line chart with dots" id="chart-line-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A line chart with circular data points showing total visitors.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-line-dots-colors" title="A line chart with colored dots" id="chart-line-3">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A line chart with different colored dots for each data point.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-line-dots-custom" title="A line chart with custom dots" id="chart-line-4">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A line chart with custom-sized dots for each data point.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-line-linear" title="A line chart with linear scale" id="chart-line-5">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A line chart using a linear scale for the x-axis.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-line-multiple" title="A line chart with multiple series" id="chart-line-6">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A line chart showing desktop and mobile visitors for the last 6 months.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-line-step" title="A line chart with step" id="chart-line-7">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A line chart with step interpolation showing total visitors.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-line-label" title="A line chart with labels" id="chart-line-8">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A line chart with data labels on each point.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-line-label-custom" title="A line chart with custom labels" id="chart-line-9">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A line chart with custom formatted labels on each point.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-line-interactive" title="An interactive line chart" id="chart-line-10">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An interactive line chart with a tooltip showing visitors over the last 90 days.
			</p>
		</spartan-block-viewer>

		<!-- Pie Charts -->
		<spartan-block-viewer block="chart-pie-simple" title="A simple pie chart" id="chart-pie-1">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A pie chart showing browser usage distribution.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-donut" title="A donut chart" id="chart-pie-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A donut chart showing browser usage distribution.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-donut-text" title="A donut chart with text" id="chart-pie-3">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A donut chart with centered text showing the total count.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-donut-active" title="A donut chart with active segment" id="chart-pie-4">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A donut chart with an active/highlighted segment.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-label" title="A pie chart with labels" id="chart-pie-5">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A pie chart with external labels for each segment.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-label-custom" title="A pie chart with custom labels" id="chart-pie-6">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A pie chart with custom formatted labels for each segment.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-label-list" title="A pie chart with label list" id="chart-pie-7">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A pie chart with a list-style label layout.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-legend" title="A pie chart with a legend" id="chart-pie-8">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A pie chart with a custom legend component.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-separator-none" title="A pie chart without separator" id="chart-pie-9">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A pie chart with no separator lines between segments.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-stacked" title="A stacked pie chart" id="chart-pie-10">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A stacked/nested pie chart showing multiple data layers.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-pie-interactive" title="An interactive pie chart" id="chart-pie-11">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				An interactive pie chart with hover effects and tooltips.
			</p>
		</spartan-block-viewer>

		<!-- Radar Charts -->
		<spartan-block-viewer block="chart-radar-default" title="A simple radar chart" id="chart-radar-1">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radar chart showing desktop and mobile visitors by month.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-dots" title="A radar chart with dots" id="chart-radar-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A radar chart with circular data points.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-grid-circle" title="A radar chart with circular grid" id="chart-radar-3">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A radar chart with circular grid lines.</p>
		</spartan-block-viewer>

		<spartan-block-viewer
			block="chart-radar-grid-circle-fill"
			title="A radar chart with filled circular grid"
			id="chart-radar-4"
		>
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radar chart with filled circular grid background.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer
			block="chart-radar-grid-circle-no-lines"
			title="A radar chart without grid lines"
			id="chart-radar-5"
		>
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radar chart with circular grid but no radial lines.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-grid-custom" title="A radar chart with custom grid" id="chart-radar-6">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A radar chart with a custom grid configuration.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-grid-fill" title="A radar chart with filled grid" id="chart-radar-7">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A radar chart with a filled grid background.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-grid-none" title="A radar chart without grid" id="chart-radar-8">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A radar chart with no grid lines.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-icons" title="A radar chart with icons" id="chart-radar-9">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A radar chart with icons in the legend.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-label-custom" title="A radar chart with custom labels" id="chart-radar-10">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radar chart with custom formatted axis labels.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-legend" title="A radar chart with a legend" id="chart-radar-11">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A radar chart with a custom legend component.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-lines-only" title="A radar chart with lines only" id="chart-radar-12">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radar chart showing only the lines without fill.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-multiple" title="A radar chart with multiple series" id="chart-radar-13">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A radar chart showing multiple data series.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radar-radius" title="A radar chart with radius axis" id="chart-radar-14">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radar chart with a radius axis for scale reference.
			</p>
		</spartan-block-viewer>

		<!-- Radial Charts -->
		<spartan-block-viewer block="chart-radial-simple" title="A simple radial chart" id="chart-radial-1">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radial bar chart showing browser usage distribution.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radial-grid" title="A radial chart with grid" id="chart-radial-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radial bar chart with grid lines for scale reference.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radial-label" title="A radial chart with labels" id="chart-radial-3">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radial bar chart with labels showing the value.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radial-shape" title="A radial chart with custom shape" id="chart-radial-4">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radial bar chart with a custom shape configuration.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radial-stacked" title="A stacked radial chart" id="chart-radial-5">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A stacked radial bar chart showing multiple data layers.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-radial-text" title="A radial chart with text" id="chart-radial-6">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A radial bar chart with centered text showing the total count.
			</p>
		</spartan-block-viewer>

		<!-- Tooltip Charts -->
		<spartan-block-viewer block="chart-tooltip-default" title="A chart with default tooltip" id="chart-tooltip-1">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A chart with the default tooltip configuration.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-tooltip-advanced" title="A chart with advanced tooltip" id="chart-tooltip-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A chart with an advanced tooltip showing additional information.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-tooltip-formatter" title="A chart with formatted tooltip" id="chart-tooltip-3">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A chart with a tooltip using a custom formatter function.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-tooltip-icons" title="A chart with icons in tooltip" id="chart-tooltip-4">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A chart with icons displayed in the tooltip.</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-tooltip-indicator-line" title="A chart with indicator line" id="chart-tooltip-5">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A chart with a vertical indicator line following the cursor.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="chart-tooltip-indicator-none" title="A chart without indicator" id="chart-tooltip-6">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A chart with no indicator line in the tooltip.</p>
		</spartan-block-viewer>

		<spartan-block-viewer
			block="chart-tooltip-label-custom"
			title="A chart with custom label tooltip"
			id="chart-tooltip-7"
		>
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A chart with a tooltip using custom labels.</p>
		</spartan-block-viewer>

		<spartan-block-viewer
			block="chart-tooltip-label-formatter"
			title="A chart with formatted label tooltip"
			id="chart-tooltip-8"
		>
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A chart with a tooltip using a custom label formatter.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer
			block="chart-tooltip-label-none"
			title="A chart without label in tooltip"
			id="chart-tooltip-9"
		>
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">A chart with a tooltip that hides the label.</p>
		</spartan-block-viewer>
	`,
})
export default class ChartsPage {}
