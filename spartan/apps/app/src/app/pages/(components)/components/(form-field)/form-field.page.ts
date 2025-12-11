import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode } from '@spartan-ng/helm/typography';
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
import { FormFieldErrorPreview } from './form-field--error.preview';
import {
	FormFieldFormWithDirtyPreview,
	providerShowOnDirtyErrorStateMatcher,
} from './form-field--with-form-dirty.preview';
import { FormFieldFormPreview } from './form-field--with-form.preview';
import { FormFieldPreview, defaultImports, defaultSkeleton } from './form-field.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Form Field', api: 'form-field' },
	meta: metaWith(
		'spartan/ui - Form Field',
		'Gives an input field or a component a distinct look that indicates its input capabilities.',
	),
	title: 'spartan/ui - Form Field',
};
@Component({
	selector: 'spartan-form-field',

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
		FormFieldPreview,
		FormFieldErrorPreview,
		FormFieldFormWithDirtyPreview,
		FormFieldFormPreview,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Form Field" lead="Display a form field to handle errors and hints." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-form-field-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui formfield" ngCode="ng g @spartan-ng/cli:ui formfield" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__error" spartanH4>Error</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-form-field-error />
				</div>
				<spartan-code secondTab [code]="_errorCode()" />
			</spartan-tabs>
			<h3 id="examples__with_form" spartanH4>With Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-form-field-form />
				</div>
				<spartan-code secondTab [code]="_withFormCode()" />
			</spartan-tabs>

			<h3 id="examples__with_form_dirty_state" spartanH4>Changing when error messages are shown</h3>

			<p class="mb-2">
				By default, these error messages are shown when the control is invalid and the user has interacted with
				(touched) the element or the parent form has been submitted. If you wish to override this behavior (e.g. to show
				the error as soon as the invalid control is dirty or when a parent form group is invalid), you can use the
				<code class="${hlmCode}">ErrorStateMatcher</code>
				provider.
			</p>

			<p class="mb-4">
				For convenience,
				<code class="${hlmCode}">ShowOnDirtyErrorStateMatcher</code>
				is available in order to globally cause input errors to show when the input is dirty and invalid
			</p>

			<div class="mb-4">
				<spartan-code [code]="_providerShowOnDirtyErrorStateMatcher" />
			</div>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-form-field-form-dirty />
				</div>
				<spartan-code secondTab [code]="_withFormDirtyCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="hover-card" label="Hover Card" />
				<spartan-page-bottom-nav-link direction="previous" href="field" label="Field" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class FormFieldPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('form-field');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _errorCode = computed(() => this._snippets()['error']);
	protected readonly _withFormDirtyCode = computed(() => this._snippets()['withFormDirty']);
	protected readonly _withFormCode = computed(() => this._snippets()['withForm']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _providerShowOnDirtyErrorStateMatcher = providerShowOnDirtyErrorStateMatcher;
}
