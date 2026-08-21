import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { QuestionnaireAnimatedPreview } from './questionnaire--animated.preview';
import { QuestionnaireCardPreview } from './questionnaire--card.preview';
import { QuestionnaireConditionalPreview } from './questionnaire--conditional.preview';
import { QuestionnaireControlledPreview } from './questionnaire--controlled.preview';
import { QuestionnaireDialogPreview } from './questionnaire--dialog.preview';
import { QuestionnaireFreeformPreview } from './questionnaire--freeform.preview';
import { QuestionnaireMultiplePreview } from './questionnaire--multiple.preview';
import { QuestionnaireNavigationStatePreview } from './questionnaire--navigation-state.preview';
import { QuestionnaireProgressPreview } from './questionnaire--progress.preview';
import { QuestionnaireResumePreview } from './questionnaire--resume.preview';
import { QuestionnaireShortcutsPreview } from './questionnaire--shortcuts.preview';
import { QuestionnaireSkipPreview } from './questionnaire--skip.preview';
import { QuestionnaireValidationPreview } from './questionnaire--validation.preview';
import { defaultImports, defaultSkeleton, QuestionnairePreview } from './questionnaire.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Questionnaire', api: 'questionnaire' },
	meta: metaWith(
		'spartan/ui - Questionnaire',
		'A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.',
	),
	title: 'spartan/ui - Questionnaire',
};

@Component({
	selector: 'spartan-questionnaire',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		QuestionnairePreview,
		QuestionnaireMultiplePreview,
		QuestionnaireFreeformPreview,
		QuestionnaireSkipPreview,
		QuestionnaireShortcutsPreview,
		QuestionnaireValidationPreview,
		QuestionnaireControlledPreview,
		QuestionnaireResumePreview,
		QuestionnaireConditionalPreview,
		QuestionnaireNavigationStatePreview,
		QuestionnaireProgressPreview,
		QuestionnaireAnimatedPreview,
		QuestionnaireCardPreview,
		QuestionnaireDialogPreview,
		HlmToasterImports,
	],
	template: `
		<hlm-toaster />
		<section spartanMainSection>
			<spartan-section-intro
				name="Questionnaire"
				lead="A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="questionnaire" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<p class="${hlmP}">
				Pass
				<code class="${hlmCode}">items</code>
				for ordered progress, shortcuts, and navigation. Bind each item with
				<code class="${hlmCode}">[formField]</code>
				and read answers from the signal model on submit. Native
				<code class="${hlmCode}">FormData</code>
				still works because the inputs stay in the form.
			</p>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__multiple" spartanH4>Multiple Selection</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">multiple</code>
				for an item that accepts more than one fixed answer.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-multiple-preview />
				</div>
				<spartan-code secondTab [code]="_multipleCode()" />
			</spartan-tabs>

			<h3 id="examples__freeform" spartanH4>Freeform Answer</h3>
			<p class="${hlmP} mb-2">
				Compose
				<code class="${hlmCode}">hlmQuestionnaireInput</code>
				with fixed choices when the user can provide another answer.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-freeform-preview />
				</div>
				<spartan-code secondTab [code]="_freeformCode()" />
			</spartan-tabs>

			<h3 id="examples__skip" spartanH4>Explicit Skip</h3>
			<p class="${hlmP} mb-2">
				Add
				<code class="${hlmCode}">hlmQuestionnaireSkip</code>
				when an optional item may be intentionally left unanswered.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-skip-preview />
				</div>
				<spartan-code secondTab [code]="_skipCode()" />
			</spartan-tabs>

			<h3 id="examples__shortcuts" spartanH4>Shortcuts</h3>
			<p class="${hlmP} mb-2">
				Assign a letter or number key to each answer with
				<code class="${hlmCode}">shortcuts</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-shortcuts-preview />
				</div>
				<spartan-code secondTab [code]="_shortcutsCode()" />
			</spartan-tabs>

			<h3 id="examples__validation" spartanH4>Custom Validation</h3>
			<p class="${hlmP} mb-2">
				Use Signal Forms
				<code class="${hlmCode}">required()</code>
				and
				<code class="${hlmCode}">validate()</code>
				to return to an invalid item and present its error.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-validation-preview />
				</div>
				<spartan-code secondTab [code]="_validationCode()" />
			</spartan-tabs>

			<h3 id="examples__controlled" spartanH4>Controlled</h3>
			<p class="${hlmP} mb-2">
				Control the active item from host state with
				<code class="${hlmCode}">[(item)]</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-controlled-preview />
				</div>
				<spartan-code secondTab [code]="_controlledCode()" />
			</spartan-tabs>

			<h3 id="examples__resume" spartanH4>Resume</h3>
			<p class="${hlmP} mb-2">
				Restore a saved active item and default answers, then reset changes back to that saved state.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-resume-preview />
				</div>
				<spartan-code secondTab [code]="_resumeCode()" />
			</spartan-tabs>

			<h3 id="examples__conditional" spartanH4>Conditional Items</h3>
			<p class="${hlmP} mb-2">Disable items that do not apply to the user's earlier answers.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-conditional-preview />
				</div>
				<spartan-code secondTab [code]="_conditionalCode()" />
			</spartan-tabs>

			<h3 id="examples__navigation_state" spartanH4>Navigation State</h3>
			<p class="${hlmP} mb-2">
				Read item status from
				<code class="${hlmCode}">statusChange</code>
				to opt into disabled navigation and custom action styling.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-navigation-state-preview />
				</div>
				<spartan-code secondTab [code]="_navigationStateCode()" />
			</spartan-tabs>

			<h3 id="examples__progress" spartanH4>Custom Progress</h3>
			<p class="${hlmP} mb-2">Use progress state to build a custom progress indicator.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-progress-preview />
				</div>
				<spartan-code secondTab [code]="_progressCode()" />
			</spartan-tabs>

			<h3 id="examples__animated" spartanH4>Animated Items</h3>
			<p class="${hlmP} mb-2">Animate the active item while keeping progress and navigation stationary.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-animated-preview />
				</div>
				<spartan-code secondTab [code]="_animatedCode()" />
			</spartan-tabs>

			<h3 id="examples__card" spartanH4>Card</h3>
			<p class="${hlmP} mb-2">
				Compose Questionnaire with Card slots while keeping the question title and description semantic.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-card-preview />
				</div>
				<spartan-code secondTab [code]="_cardCode()" />
			</spartan-tabs>

			<h3 id="examples__dialog" spartanH4>Dialog</h3>
			<p class="${hlmP} mb-2">
				Compose Questionnaire inside a Dialog while keeping cancellation and dismissal host-owned.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!h-auto !min-h-0">
					<spartan-questionnaire-dialog-preview />
				</div>
				<spartan-code secondTab [code]="_dialogCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="radio-group" label="Radio Group" />
				<spartan-page-bottom-nav-link direction="previous" href="progress" label="Progress" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class QuestionnairePage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('questionnaire');
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _multipleCode = computed(() => this._snippets()['multiple']);
	protected readonly _freeformCode = computed(() => this._snippets()['freeform']);
	protected readonly _skipCode = computed(() => this._snippets()['skip']);
	protected readonly _shortcutsCode = computed(() => this._snippets()['shortcuts']);
	protected readonly _validationCode = computed(() => this._snippets()['validation']);
	protected readonly _controlledCode = computed(() => this._snippets()['controlled']);
	protected readonly _resumeCode = computed(() => this._snippets()['resume']);
	protected readonly _conditionalCode = computed(() => this._snippets()['conditional']);
	protected readonly _navigationStateCode = computed(() => this._snippets()['navigationState']);
	protected readonly _progressCode = computed(() => this._snippets()['progress']);
	protected readonly _animatedCode = computed(() => this._snippets()['animated']);
	protected readonly _cardCode = computed(() => this._snippets()['card']);
	protected readonly _dialogCode = computed(() => this._snippets()['dialog']);
}
