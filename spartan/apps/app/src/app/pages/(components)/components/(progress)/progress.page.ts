import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
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
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { ProgressIndeterminatePreview } from './progress--indeterminate.preview';
import { ProgressPreview, defaultImports, defaultSkeleton } from './progress.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Progress', api: 'progress' },
	meta: metaWith(
		'spartan/ui - Progress',
		'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
	),
	title: 'spartan/ui - Progress',
};
@Component({
	selector: 'spartan-progress',
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
		ProgressPreview,
		ProgressIndeterminatePreview,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Progress"
				lead="Displays an indicator showing the completion progress of a task, typically displayed as a progress bar."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-progress-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui progress" ngCode="ng g @spartan-ng/cli:ui progress" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="animation">Animation</spartan-section-sub-heading>

			<p class="${hlmP}">
				The indeterminate animation
				<code class="${hlmCode}">animate-indeterminate</code>
				is provided by
				<code class="${hlmCode}">&#64;spartan-ng/brain/hlm-tailwind-preset.css</code>
				. Here are two options for adding the animation to your project.
			</p>

			<spartan-code
				class="mt-4"
				code="/* 1. default import */
@import '@spartan-ng/brain/hlm-tailwind-preset.css';

/* 2. add animate-indeterminate animation */
@theme inline {
	--animate-indeterminate: indeterminate 4s ease-in-out infinite;
	@keyframes indeterminate {
		0% {
			transform: translateX(-100%) scaleX(0.5);
		}
		100% {
			transform: translateX(100%) scaleX(0.5);
		}
	}
}"
				fileName="src/styles.css"
			/>

			<p class="${hlmP}">
				Adjust the animation to your needs by changing duration, easing function or keyframes by overriding the CSS
				variable
				<code class="${hlmCode}">--animate-indeterminate</code>
				or the
				<code class="${hlmCode}">&#64;keyframes indeterminate</code>
				in your global styles.
			</p>
			<spartan-code
				class="mt-4"
				code="@import '@spartan-ng/brain/hlm-tailwind-preset.css';

/* adjust animation duration  */
@theme inline {
-	--animate-indeterminate: indeterminate 4s ease-in-out infinite;
+	--animate-indeterminate: indeterminate 3s ease-in-out infinite;
}"
				fileName="src/styles.css"
			/>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__indeterminate" spartanH4>Indeterminate</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-progress-indeterminate />
				</div>
				<spartan-code secondTab [code]="_indeterminateCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="radio-group" label="Radio Group" />
				<spartan-page-bottom-nav-link direction="previous" href="popover" label="Popover" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class LabelPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('progress');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _indeterminateCode = computed(() => this._snippets()['indeterminate']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
