import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { metaWith } from '../../../../shared/meta/meta.util';
import { ConfirmationRejectReason } from './confirmation--reject-reason.preview';
import { ConfirmationStates } from './confirmation--states.preview';
import { ConfirmationPreview, defaultImports, defaultSkeleton } from './confirmation.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Confirmation', api: 'confirmation' },
	meta: metaWith(
		'spartan/ui - Confirmation',
		'A human-in-the-loop approval card for when an agent pauses on a sensitive action.',
	),
	title: 'spartan/ui - Confirmation',
};

@Component({
	selector: 'spartan-confirmation',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		ConfirmationPreview,
		CodePreview,
		PageNav,
		SectionSubSubHeading,
		ConfirmationStates,
		ConfirmationRejectReason,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Confirmation"
				lead="A human-in-the-loop approval card for when an agent pauses on a sensitive action."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-confirmation-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui confirmation"
				ngCode="ng g @spartan-ng/cli:ui confirmation"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="states" spartanH4>States</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-confirmation-states />
				</div>
				<spartan-code secondTab [code]="_statesCode()" />
			</spartan-tabs>

			<h3 id="reject-reason" spartanH4>Reject Reason</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-confirmation-reject-reason />
				</div>
				<spartan-code secondTab [code]="_rejectReasonCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="context-menu" label="Context Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="command" label="Command" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ConfirmationPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('confirmation');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _statesCode = computed(() => this._snippets()['states']);
	protected readonly _rejectReasonCode = computed(() => this._snippets()['rejectReason']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
