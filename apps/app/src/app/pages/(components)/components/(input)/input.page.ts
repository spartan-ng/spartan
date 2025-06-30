import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
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
import { UIApiDocsComponent } from '../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { InputButtonPreviewComponent } from './input--button.preview';
import { InputDisabledPreviewComponent } from './input--disabled.preview';
import { InputFilePreviewComponent } from './input--file.preview';
import { InputLabelPreviewComponent } from './input--label.preview';
import { defaultCode, inputButtonCode, inputDisabledCode, inputFileCode, inputLabelCode } from './input.generated';
import { InputPreviewComponent, defaultImports, defaultSkeleton } from './input.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Input', api: 'input' },
	meta: metaWith(
		'spartan/ui - Input',
		'Gives an input field or a component a distinct look that indicates its input capabilities.',
	),
	title: 'spartan/ui - Input',
};
@Component({
	selector: 'spartan-input',
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
		InputPreviewComponent,
		InputFilePreviewComponent,
		InputDisabledPreviewComponent,
		InputLabelPreviewComponent,
		InputButtonPreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Input"
				lead="Gives an input field or a component a distinct look that indicates its input capabilities"
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui input"
				ngCode="ng g @spartan-ng/cli:ui input"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__file" class="${hlmH4} mb-2 mt-6">File</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-file />
				</div>
				<spartan-code secondTab [code]="fileCode" />
			</spartan-tabs>
			<h3 id="examples__disabled" class="${hlmH4} mb-2 mt-6">Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-disabled />
				</div>
				<spartan-code secondTab [code]="disabledCode" />
			</spartan-tabs>
			<h3 id="examples__with_label" class="${hlmH4} mb-2 mt-6">With Label</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-label />
				</div>
				<spartan-code secondTab [code]="labelCode" />
			</spartan-tabs>
			<h3 id="examples__with_button" class="${hlmH4} mb-2 mt-6">With Button</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-button />
				</div>
				<spartan-code secondTab [code]="buttonCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="input-otp" label="Input OTP" />
				<spartan-page-bottom-nav-link direction="previous" href="icon" label="Icon" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class InputPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
	protected readonly fileCode = inputFileCode;
	protected readonly disabledCode = inputDisabledCode;
	protected readonly labelCode = inputLabelCode;
	protected readonly buttonCode = inputButtonCode;
}
