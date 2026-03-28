import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { HlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNavPlaceholder } from '../../../../shared/layout/page-bottom-nav-placeholder';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { metaWith } from '../../../../shared/meta/meta.util';
import {
	animationControlsCode,
	StepperAnimationsPreview,
	stepperConfigCode,
} from './stepper--animations.preview';
import { StepperBasicPreview } from './stepper--basic.preview';
import { StepperErrorPreview } from './stepper--error.preview';
import { StepperStatesPreview } from './stepper--indicators.preview';
import { StepperLayoutPreview } from './stepper--layout.preview';
import { StepperLazyContentPreview } from './stepper--lazy-content.preview';
import { StepperLinearPreview } from './stepper--linear.preview';
import { StepperResponsivePreview } from './stepper--responsive.preview';
import { StepperRtlPreview } from './stepper--rtl.preview';
import { StepperVerticalPreview } from './stepper--vertical.preview';
import { StepperPreview, defaultImports, defaultSkeleton } from './stepper.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'stepper', api: 'stepper' },
	meta: metaWith(
		'spartan/ui - stepper',
		'A set of steps that are used to indicate progress through a multi-step process.',
	),
	title: 'spartan/ui - stepper',
};

@Component({
	selector: 'spartan-stepper',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,
		TabsCli,
		StepperPreview,
		CodePreview,
		CodeRtlPreview,
		PageNav,
		HlmP,
		RtlHeader,
		PageBottomNav,
		PageBottomNavLink,
		PageBottomNavPlaceholder,
		UIApiDocs,
		StepperAnimationsPreview,
		StepperBasicPreview,
		StepperVerticalPreview,
		StepperResponsivePreview,
		StepperLinearPreview,
		StepperLazyContentPreview,
		StepperLayoutPreview,
		StepperStatesPreview,
		StepperErrorPreview,
		StepperRtlPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Stepper"
				lead="A set of steps that are used to indicate progress through a multi-step process."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui stepper"
				ngCode="ng g @spartan-ng/cli:ui stepper"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__basic" spartanH4>Basic</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-basic-preview />
				</div>
				<spartan-code secondTab [code]="_basicCode()" />
			</spartan-tabs>

			<h3 id="examples__vertical" spartanH4>Vertical</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-vertical-preview />
				</div>
				<spartan-code secondTab [code]="_verticalCode()" />
			</spartan-tabs>

			<h3 id="examples__responsive" spartanH4>Responsive</h3>
			<p hlmP>
				If your app supports a wide variety of screens and a stepper's layout doesn't fit a particular screen size, you
				can control its orientation dynamically to change the layout based on the viewport.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-responsive-preview />
				</div>
				<spartan-code secondTab [code]="_responsiveCode()" />
			</spartan-tabs>

			<h3 id="examples__linear" spartanH4>Linear</h3>
			<p hlmP>
				When
				<span hlmCode>linear</span>
				property is set to true, current step must be completed in order to move to the next step.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-linear-preview />
				</div>
				<spartan-code secondTab [code]="_linearCode()" />
			</spartan-tabs>

			<h3 id="examples__lazy_content" spartanH4>Lazy Content</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-lazy-content-preview />
				</div>
				<spartan-code secondTab [code]="_lazyContentCode()" />
			</spartan-tabs>

			<h3 id="examples__layout" spartanH4>Layout</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-layout-preview />
				</div>
				<spartan-code secondTab [code]="_layoutCode()" />
			</spartan-tabs>

			<h3 id="examples__animations" spartanH4>Animations</h3>
			<p hlmP>
				You can disable animations and control transition duration either globally with
				<code>provideHlmStepperConfig</code>
				or per stepper instance with
				<code>[animationsEnabled]</code>
				and
				<code>[animationDuration]</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-animations-preview />
				</div>
				<spartan-code secondTab [code]="_animationControlsCode" />
			</spartan-tabs>

			<h3 id="examples__indicators" spartanH4>Indicators</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-indicators-preview />
				</div>
				<spartan-code secondTab [code]="_indicatorsCode()" />
			</spartan-tabs>

			<h3 id="examples__error" spartanH4>Error</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-stepper-error-preview />
				</div>
				<spartan-code secondTab [code]="_errorCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-stepper-rtl-preview />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="config">Config</spartan-section-sub-heading>
			<p hlmP>
				To override defaults globally, provide
				<code>provideHlmStepperConfig</code>
				in your application config. You can still override behavior directly on a stepper instance with
				<code>[animationsEnabled]</code>
				and
				<code>[animationDuration]</code>
				inputs.
			</p>
			<spartan-code fileName="src/app/app.config.ts" [code]="_configCode" />

			<spartan-section-sub-heading id="accessibility">Accessibility</spartan-section-sub-heading>
			<p hlmP>
				<code>hlm-stepper</code>
				implements stepper accessibility semantics on top of the CDK stepper foundation. In horizontal mode it renders a
				tabbed pattern:
				<code>tablist</code>
				,
				<code>tab</code>
				, and
				<code>tabpanel</code>
				with connected
				<code>aria-controls</code>
				/
				<code>aria-labelledby</code>
				attributes.
			</p>

			<p hlmP>
				In vertical mode, headers switch to
				<code>role="button"</code>
				with
				<code>aria-expanded</code>
				and
				<code>aria-current="step"</code>
				, and the active content is exposed as a labeled
				<code>region</code>
				. For linear forms,
				<code>HlmStepper.next()</code>
				marks the current form as touched before blocking invalid progression, so surface validation messages in the
				step content (for example with field errors or an aria-live region).
			</p>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="alert" label="Alert" />
				<spartan-page-bottom-nav-placeholder />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class StepperPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('stepper');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _basicCode = computed(() => this._snippets()['basic']);
	protected readonly _verticalCode = computed(() => this._snippets()['vertical']);
	protected readonly _responsiveCode = computed(() => this._snippets()['responsive']);
	protected readonly _linearCode = computed(() => this._snippets()['linear']);
	protected readonly _lazyContentCode = computed(() => this._snippets()['lazyContent']);
	protected readonly _layoutCode = computed(() => this._snippets()['layout']);
	protected readonly _animationControlsCode = animationControlsCode;
	protected readonly _indicatorsCode = computed(() => this._snippets()['indicators']);
	protected readonly _errorCode = computed(() => this._snippets()['error']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _configCode = stepperConfigCode;
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
