import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { PopoverRtlPreview } from '@spartan-ng/app/app/pages/(components)/components/(popover)/popover--rtl.example';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
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
import { PopoverAlign } from './popover--align.preview';
import { PopoverBasic } from './popover--basic.preview';
import { PopoverPreview, defaultImports, defaultSkeleton } from './popover.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Popover', api: 'popover' },
	meta: metaWith('spartan/ui - Popover', 'Displays rich content in a portal, triggered by a button.'),
	title: 'spartan/ui - Popover',
};
@Component({
	selector: 'spartan-popover',
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
		RtlHeader,
		CodeRtlPreview,
		PopoverPreview,
		PopoverBasic,
		PopoverAlign,
		PopoverRtlPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Popover"
				lead="Displays rich content in a portal, triggered by a button."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-popover-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="popover" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="basic" spartanH4>Basic</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-popover-basic />
				</div>
				<spartan-code secondTab [code]="_basicCode()" />
			</spartan-tabs>

			<h3 id="align" spartanH4>Align</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-popover-align />
				</div>
				<spartan-code secondTab [code]="_alignCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-popover-rtl-preview />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="progress" label="Progress" />
				<spartan-page-bottom-nav-link direction="previous" href="pagination" label="Pagination" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class PopoverPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('popover');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _basicCode = computed(() => this._snippets()['basic']);
	protected readonly _alignCode = computed(() => this._snippets()['align']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
