import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
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
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { defaultCode } from './spinner.generated';
import { SpinnerPreview, defaultImports, defaultSkeleton } from './spinner.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Spinner', api: 'spinner' },
	meta: metaWith(
		'spartan/ui - Spinner',
		'Shows a Loading spinner to indicate that the app is busy or the page is still loading.',
	),
	title: 'spartan/ui - Spinner',
};
@Component({
	selector: 'spartan-spinner',
	imports: [
		UIApiDocs,
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SpinnerPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Spinner"
				lead="Shows a Loading spinner to indicate that the app is busy or the page is still loading."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-spinner-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui spinner"
				ngCode="ng g @spartan-ng/cli:ui spinner"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="variants">Variants</spartan-section-sub-heading>
			The spinner component has the following variants:

			<h3 id="variants__size" class="${hlmH4} mb-2 mt-6">size</h3>
			The size of the spinner. (default: w-8)
			<!-- <code [innerHTML]="'<hlm-spinner size="xl" />'"></code> -->

			<ul class="list-disc pl-8">
				<li>
					<code>xs: w-4</code>
				</li>
				<li>
					<code>sm: w-6</code>
				</li>
				<li>
					<code>lg: w-12</code>
				</li>
				<li>
					<code>xl: w-16</code>
				</li>
			</ul>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="switch" label="Switch" />
				<spartan-page-bottom-nav-link direction="previous" href="skeleton" label="Skeleton" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SpinnerPage {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
}
