import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockViewer } from '@spartan-ng/app/app/shared/blocks/block-viewer';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Stepper', 'Stepper blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Stepper',
};

@Component({
	selector: 'spartan-stepper',
	imports: [BlockViewer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col gap-12 md:gap-24',
	},
	template: `
		<spartan-block-viewer block="stepper-basic" title="A basic horizontal stepper" id="stepper-1" />

		<spartan-block-viewer block="stepper-vertical" title="A vertical stepper" id="stepper-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Set
				<code class="${hlmCode}">orientation="vertical"</code>
				when content is dense or horizontal space is limited.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="stepper-responsive" title="A responsive stepper" id="stepper-3">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Drive
				<code class="${hlmCode}">orientation</code>
				from a
				<code class="${hlmCode}">BreakpointObserver</code>
				to switch layout based on the viewport. Resize the preview to see it change.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="stepper-linear" title="A linear stepper with validation" id="stepper-4">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				With
				<code class="${hlmCode}">linear</code>
				enabled, the current step must be valid before advancing.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="stepper-lazy-content" title="A stepper with lazy content" id="stepper-5">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Use
				<code class="${hlmCode}">hlmStepContent</code>
				to attach a step's body lazily, keeping the initial render lighter.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="stepper-layout" title="A stepper with layout controls" id="stepper-6">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Control horizontal layout with
				<code class="${hlmCode}">labelPosition</code>
				and
				<code class="${hlmCode}">headerPosition</code>
				.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="stepper-animations" title="A stepper with animation controls" id="stepper-7">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Toggle animations and transition duration per instance with
				<code class="${hlmCode}">animationsEnabled</code>
				and
				<code class="${hlmCode}">animationDuration</code>
				, or set defaults globally with
				<code class="${hlmCode}">provideHlmStepperConfig</code>
				.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="stepper-indicators" title="A stepper with indicator modes" id="stepper-8">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Switch the indicator with
				<code class="${hlmCode}">indicatorMode</code>
				between
				<code class="${hlmCode}">number</code>
				,
				<code class="${hlmCode}">state</code>
				, and
				<code class="${hlmCode}">icon</code>
				.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="stepper-error" title="A stepper with error states" id="stepper-9">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Enable
				<code class="${hlmCode}">showError</code>
				through
				<code class="${hlmCode}">STEPPER_GLOBAL_OPTIONS</code>
				to surface a step's error message in its header.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="stepper-rtl" title="A stepper with RTL support" id="stepper-10">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				The stepper mirrors automatically under a right-to-left
				<code class="${hlmCode}">dir</code>
				. Switch the docs language to a RTL locale to preview it.
			</p>
		</spartan-block-viewer>
	`,
})
export default class StepperPage {}
