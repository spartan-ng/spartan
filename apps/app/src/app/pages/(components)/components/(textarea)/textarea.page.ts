import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
import { TextareaButtonPreview } from './textarea--button.preview';
import { TextareaDisabledPreview } from './textarea--disabled.preview';
import { TextareaFormPreview } from './textarea--form.preview';
import { TextareaLabelPreview } from './textarea--label.preview';
import { TextareaPreview, defaultImports, defaultSkeleton } from './textarea.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Textarea', api: 'textarea' },
	meta: metaWith('spartan/ui - Textarea', 'Displays a form textarea or a component that looks like a textarea.'),
	title: 'spartan/ui - Textarea',
};
@Component({
	selector: 'spartan-textarea',
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
		TextareaPreview,
		TextareaDisabledPreview,
		TextareaLabelPreview,
		TextareaButtonPreview,
		TextareaFormPreview,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Textarea"
				lead="Displays a form textarea or a component that looks like a textarea."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui textarea"
				ngCode="ng g @spartan-ng/cli:ui textarea"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>
			<h3 id="examples__with_label" spartanH4>With Label</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-label />
				</div>
				<spartan-code secondTab [code]="_labelCode()" />
			</spartan-tabs>
			<h3 id="examples__with_button" spartanH4>With Button</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-button />
				</div>
				<spartan-code secondTab [code]="_buttonCode()" />
			</spartan-tabs>
			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-textarea-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="toggle" label="Toggle" />
				<spartan-page-bottom-nav-link direction="previous" href="tabs" label="Tabs" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class TextAreaPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('textarea');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _labelCode = computed(() => this._snippets()['label']);
	protected readonly _buttonCode = computed(() => this._snippets()['button']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
