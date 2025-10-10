import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
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
import { ItemPreview, defaultImports, defaultSkeleton } from './item.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'item', api: 'item' },
	meta: metaWith('spartan/ui - item', 'A versatile component that you can use to display any content.'),
	title: 'spartan/ui - item',
};

@Component({
	selector: 'spartan-item',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		ItemPreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Item" lead="A versatile component that you can use to display any content." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui item" ngCode="ng g @spartan-ng/cli:ui item" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="kbd" label="Kbd" />
				<spartan-page-bottom-nav-link direction="previous" href="input-otp" label="Input OTP" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ItemPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('item');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
