import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmCode, hlmH4 } from '@spartan-ng/helm/typography';
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
import {
	defaultCode,
	formFieldErrorCode,
	formFieldWithFormCode,
	formFieldWithFormDirtyCode,
} from './form-field.generated';
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
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Form Field" lead="Display a form field to handle errors and hints." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-form-field-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui formfield"
				ngCode="ng g @spartan-ng/cli:ui formfield"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__error" class="${hlmH4} mb-2 mt-6">Error</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-form-field-error />
				</div>
				<spartan-code secondTab [code]="_errorCode" />
			</spartan-tabs>
			<h3 id="examples__with_form" class="${hlmH4} mb-2 mt-6">With Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-form-field-form />
				</div>
				<spartan-code secondTab [code]="_formFieldForm" />
			</spartan-tabs>

			<h3 id="examples__with_form_dirty_state" class="${hlmH4} mb-4 mt-6">Changing when error messages are shown</h3>

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
				<spartan-code secondTab [code]="_formFieldFormWithDirtyCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="label" label="Label" />
				<spartan-page-bottom-nav-link direction="previous" href="icon" label="Icon" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class FormFieldPage {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _errorCode = formFieldErrorCode;
	protected readonly _formFieldFormWithDirtyCode = formFieldWithFormDirtyCode;
	protected readonly _formFieldForm = formFieldWithFormCode;
	protected readonly _providerShowOnDirtyErrorStateMatcher = providerShowOnDirtyErrorStateMatcher;
}
