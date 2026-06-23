import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
import { AlertDialogDestructive } from './alert-dialog--destructive.preview';
import { AlertDialogMedia } from './alert-dialog--media.preview';
import { AlertDialogRtl } from './alert-dialog--rtl.preview';
import { AlertDialogSmallMedia } from './alert-dialog--small-media.preview';
import { AlertDialogSmall } from './alert-dialog--small.preview';
import { AlertDialogPreview, defaultImports, defaultSkeleton } from './alert-dialog.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Alert Dialog', api: 'alert-dialog' },
	meta: metaWith(
		'spartan/ui - Alert Dialog',
		'A modal dialog that interrupts the user with important content and expects a response.',
	),
	title: 'spartan/ui - Alert Dialog',
};

@Component({
	selector: 'spartan-alert-dialog',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,

		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		AlertDialogPreview,
		InstallTabs,
		SectionSubSubHeading,
		RtlHeader,
		CodeRtlPreview,
		AlertDialogSmall,
		AlertDialogMedia,
		AlertDialogSmallMedia,
		AlertDialogDestructive,
		AlertDialogRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Alert Dialog"
				lead="A modal dialog that interrupts the user with important content and expects a response."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-dialog-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="alert-dialog" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="small" spartanH4>Small</h3>
			<p class="${hlmP}">
				Use the
				<code class="${hlmCode}">size="sm"</code>
				prop to make the alert dialog smaller.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-dialog-small />
				</div>
				<spartan-code secondTab [code]="_smallCode()" />
			</spartan-tabs>

			<h3 id="media" spartanH4>Media</h3>
			<p class="${hlmP}">
				Use the
				<code class="${hlmCode}">hlm-alert-dialog-media</code>
				component to add a media element such as an icon or image to the alert dialog.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-dialog-media />
				</div>
				<spartan-code secondTab [code]="_mediaCode()" />
			</spartan-tabs>

			<h3 id="small-with-media" spartanH4>Small with Media</h3>
			<p class="${hlmP}">
				Use the
				<code class="${hlmCode}">size="sm"</code>
				prop to make the alert dialog smaller and the
				<code class="${hlmCode}">hlm-alert-dialog-media</code>
				component to add a media element such as an icon or image to the alert dialog.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-dialog-small-media />
				</div>
				<spartan-code secondTab [code]="_smallMediaCode()" />
			</spartan-tabs>

			<h3 id="destructive" spartanH4>Destructive</h3>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">hlmAlertDialogAction</code>
				with the
				<code class="${hlmCode}">variant="destructive"</code>
				prop to indicate a destructive action.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-alert-dialog-destructive />
				</div>
				<spartan-code secondTab [code]="_destructiveCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-alert-dialog-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="aspect-ratio" label="Aspect Ratio" />
				<spartan-page-bottom-nav-link direction="previous" href="alert" label="Alert" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AlertPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('alert-dialog');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _smallCode = computed(() => this._snippets()['small']);
	protected readonly _mediaCode = computed(() => this._snippets()['media']);
	protected readonly _smallMediaCode = computed(() => this._snippets()['smallMedia']);
	protected readonly _destructiveCode = computed(() => this._snippets()['destructive']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
