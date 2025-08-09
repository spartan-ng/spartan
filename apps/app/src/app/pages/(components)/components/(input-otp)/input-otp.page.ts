import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/helm/typography';
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
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui input-otp"
				ngCode="ng g @spartan-ng/cli:ui input-otp"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__form" class="${hlmH4} mb-2 mt-6">Form</h3>
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

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="label" label="Label" />
				<spartan-page-bottom-nav-link direction="previous" href="input" label="Input" />
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
