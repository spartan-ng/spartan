import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { link } from '@spartan-ng/app/app/shared/typography/link';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { InputOtpFormExample } from './input-otp--form.example';
import { defaultImports, defaultSkeleton, InputOtpPreview } from './input-otp.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Input OTP', api: 'input-otp' },
	meta: metaWith('spartan/ui - Input OTP', 'Accessible one-time password component.'),
	title: 'spartan/ui - Input OTP',
};
@Component({
	selector: 'spartan-input-otp',

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
		InputOtpPreview,
		InputOtpFormExample,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Input OTP" lead="Accessible one-time password component." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-otp-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui input-otp" ngCode="ng g @spartan-ng/cli:ui input-otp" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="animation">Animation</spartan-section-sub-heading>

			<p class="${hlmP}">
				The fake caret animation
				<code class="${hlmCode}">animate-caret-blink</code>
				is provided by
				<a href="https://github.com/Wombosvideo/tw-animate-css" target="_blank" rel="noreferrer" class="${link}">
					tw-animate-css
				</a>
				, which is included in
				<code class="${hlmCode}">&#64;spartan-ng/brain/hlm-tailwind-preset.css</code>
				. Here are three options for adding the animation to your project.
			</p>

			<spartan-code
				class="mt-4"
				code="/* 1. default import includes 'tw-animate-css' */
@import '@spartan-ng/brain/hlm-tailwind-preset.css';

/* 2. import 'tw-animate-css' direclty */
@import 'tw-animate-css';

/* 3. add animate-caret-blink animation from 'tw-animate-css'  */
@theme inline {
	--animate-caret-blink: caret-blink 1.25s ease-out infinite;
	@keyframes caret-blink {
		0%,
		70%,
		100% {
			opacity: 1;
		}
		20%,
		50% {
			opacity: 0;
		}
	}
}"
				fileName="src/styles.css"
			/>

			<p class="${hlmP}">
				Adjust the animation to your needs by changing duration, easing function or keyframes by overriding the CSS
				variable
				<code class="${hlmCode}">--animate-caret-blink</code>
				or the
				<code class="${hlmCode}">&#64;keyframes caret-blink</code>
				in your global styles.
			</p>
			<spartan-code
				class="mt-4"
				code="@import '@spartan-ng/brain/hlm-tailwind-preset.css';

/* adjust animation duration  */
@theme inline {
-	--animate-caret-blink: caret-blink 1.25s ease-out infinite;
+	--animate-caret-blink: caret-blink 2s ease-out infinite;
}"
				fileName="src/styles.css"
			/>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__form" spartanH4>Form</h3>
			<p class="${hlmP} mb-6">
				Sync the otp to a form by adding
				<code class="${hlmCode}">formControlName</code>
				to
				<code class="${hlmCode}">brn-input-otp</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-otp-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="item" label="Item" />
				<spartan-page-bottom-nav-link direction="previous" href="input-group" label="Input Group" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class InputOtpPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('input-otp');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
