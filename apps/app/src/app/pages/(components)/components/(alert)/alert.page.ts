import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';

import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { AlertAction } from './alert--action.example';
import { AlertCustomColors } from './alert--custom-colors.example';
import { AlertDestructive } from './alert--destructive.example';
import { AlertPreview, defaultImports, defaultSkeleton } from './alert.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Alert', api: 'alert' },
	meta: metaWith('spartan/ui - Alert', 'Displays a callout for user attention.'),
	title: 'spartan/ui - Alert',
};

@Component({
	selector: 'spartan-alert',
	imports: [
		UIApiDocs,
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		AlertPreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SectionSubSubHeading,
		AlertDestructive,
		AlertAction,
		AlertCustomColors,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Alert" lead="Displays a callout for user attention." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui alert" ngCode="ng g @spartan-ng/cli:ui alert" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__destructive" spartanH4>Destructive</h3>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">variant="destructive"</code>
				to create a destructive alert.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-destructive />
				</div>
				<spartan-code secondTab [code]="_destructiveCode()" />
			</spartan-tabs>

			<h3 id="examples__action" spartanH4>Action</h3>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">hlmAlertAction</code>
				to add a button or other action element to the alert.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-action />
				</div>
				<spartan-code secondTab [code]="_actionCode()" />
			</spartan-tabs>

			<h3 id="examples__custom-colors" spartanH4>Custom Colors</h3>
			<p class="${hlmP}">
				You can customize the alert colors by adding custom classes such as
				<code class="${hlmCode}">bg-amber-50 dark:bg-amber-950</code>
				to the
				<code class="${hlmCode}">hlm-alert</code>
				component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-custom-colors />
				</div>
				<spartan-code secondTab [code]="_customColorsCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="alert-dialog" label="Alert Dialog" />
				<spartan-page-bottom-nav-link direction="previous" href="accordion" label="Accordion" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AlertPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('alert');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _destructiveCode = computed(() => this._snippets()['destructive']);
	protected readonly _actionCode = computed(() => this._snippets()['action']);
	protected readonly _customColorsCode = computed(() => this._snippets()['customColors']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
