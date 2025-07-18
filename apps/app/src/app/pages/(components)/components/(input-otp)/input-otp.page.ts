import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { UIApiDocsComponent } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section.component';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/helm/typography';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { InputOtpFormExampleComponent } from './input-otp--form.example';
import { defaultCode, inputOtpFormCode } from './input-otp.generated';
import { defaultImports, defaultSkeleton, InputOtpPreviewComponent } from './input-otp.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Input OTP', api: 'input-otp' },
	meta: metaWith('spartan/ui - Input OTP', 'Accessible one-time password component.'),
	title: 'spartan/ui - Input OTP',
};
@Component({
	selector: 'spartan-input-otp',
	imports: [
		UIApiDocsComponent,
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		TabsCliComponent,
		CodePreviewDirective,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		InputOtpPreviewComponent,
		InputOtpFormExampleComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Input OTP" lead="Accessible one-time password component." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-otp-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
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
				<spartan-code secondTab [code]="_inputOtpFormCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="label" label="Label" />
				<spartan-page-bottom-nav-link direction="previous" href="input" label="Input" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class InputOtpPageComponent {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _inputOtpFormCode = inputOtpFormCode;
}
