import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
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
import { InputButtonPreview } from './input--button.preview';
import { InputDisabledPreview } from './input--disabled.preview';
import { InputFilePreview } from './input--file.preview';
import { InputFormPreview } from './input--form.preview';
import { InputLabelPreview } from './input--label.preview';
import { defaultImports, defaultSkeleton, InputPreview } from './input.preview';

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
		InputPreview,
		InputFilePreview,
		InputDisabledPreview,
		InputLabelPreview,
		InputButtonPreview,
		InputFormPreview,
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
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui input"
				ngCode="ng g @spartan-ng/cli:ui input"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__file" class="${hlmH4} mb-2 mt-6">File</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-file />
				</div>
				<spartan-code secondTab [code]="_fileCode()" />
			</spartan-tabs>
			<h3 id="examples__disabled" class="${hlmH4} mb-2 mt-6">Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>
			<h3 id="examples__with_label" class="${hlmH4} mb-2 mt-6">With Label</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-label />
				</div>
				<spartan-code secondTab [code]="_labelCode()" />
			</spartan-tabs>
			<h3 id="examples__with_button" class="${hlmH4} mb-2 mt-6">With Button</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-button />
				</div>
				<spartan-code secondTab [code]="_buttonCode()" />
			</spartan-tabs>
			<h3 id="examples__form" class="${hlmH4} mb-2 mt-6">Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-input-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="input-group" label="Input Group" />
				<spartan-page-bottom-nav-link direction="previous" href="icon" label="Icon" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class InputPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('input');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _fileCode = computed(() => this._snippets()['file']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _labelCode = computed(() => this._snippets()['label']);
	protected readonly _buttonCode = computed(() => this._snippets()['button']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
