import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';

import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { metaWith } from '../../../../shared/meta/meta.util';
import { ReactiveFormCheckboxDemo, reactiveFormsCheckboxDemoCode } from './reactive-forms--checkbox.demo';
import { ReactiveFormInputDemo, reactiveFormsInputDemoCode } from './reactive-forms--input.demo';
import { ReactiveFormRadioGroupDemo, reactiveFormsRadioGroupDemoCode } from './reactive-forms--radio-group.demo';
import { ReactiveFormSelectDemo, reactiveFormsSelectDemoCode } from './reactive-forms--select.demo';
import { reactiveFormsSwitchDemoCode, ReactiveFormSwitchDemo } from './reactive-forms--switch.demo';
import { reactiveFormsTextareaDemoCode, ReactiveFormTextareaDemo } from './reactive-forms--textarea.demo';
import {
	BugReportForm,
	demoAnatomyCode,
	demoCode,
	demoFormSchemaCode,
	demoResetForm,
	demoSetupForm,
} from './reactive-forms.demo';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Reactive Forms' },
	meta: metaWith('spartan/ui - Reactive Forms', 'Build forms in Angular using Reactive Forms.'),
	title: 'spartan/ui - Reactive Forms',
};
@Component({
	selector: 'spartan-reactive-forms',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SectionSubSubHeading,
		BugReportForm,
		ReactiveFormInputDemo,
		ReactiveFormTextareaDemo,
		ReactiveFormSelectDemo,
		ReactiveFormCheckboxDemo,
		ReactiveFormRadioGroupDemo,
		ReactiveFormSwitchDemo,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Reactive Forms" lead="Build forms in Angular using Reactive Forms." />

			<p class="${hlmP}">
				In this guide, we will take a look at building forms with Reactive Forms. We'll cover building forms with the
				<code class="${hlmCode}">HlmField</code>
				component, how to handle validation and how to display errors.
			</p>

			<spartan-section-sub-heading id="demo">Demo</spartan-section-sub-heading>
			<p class="${hlmP}">
				We are going to build the following form. It has a simple text input and a textarea. On submit, we'll validate
				the form data and display any errors.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-bug-report-form />
				</div>
				<spartan-code secondTab fileName="bug-report-form.ts" [code]="_demoCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="approach">Approach</spartan-section-sub-heading>
			<p class="${hlmP}">
				This form leverages Angular Reactive Form for flexible form handling. We'll build our form using the
				<code class="${hlmCode}">HlmField</code>
				component, which gives you complete flexibility over the markup and styling.
			</p>
			<ul class="${hlmUl}">
				<li>
					Uses Angular
					<code class="${hlmCode}">FormBuilder</code>
					for the form state management and validation.
				</li>
				<li>
					<code class="${hlmCode}">HlmField</code>
					components for building accessible forms.
				</li>
				<li>
					<code class="${hlmCode}">formControlName="control"</code>
					binds the form control to the input element.
				</li>
			</ul>

			<spartan-section-sub-heading id="anatomy">Anatomy</spartan-section-sub-heading>
			<p class="${hlmP}">
				Here's a basic example of a form using the
				<code class="${hlmCode}">HlmField</code>
				component and binding it via
				<code class="${hlmCode}">formControlName</code>
				to the input element. .
			</p>

			<spartan-code class="mt-6" [code]="_demoAnatomyCode" />

			<spartan-section-sub-heading id="form">Form</spartan-section-sub-heading>

			<h3 id="create-a-form-schema" spartanH4>Create a form schema</h3>
			<p class="${hlmP}">We'll start by defining the shape of our form using the form builder.</p>

			<spartan-code class="mt-6" fileName="bug-report-form.ts" [code]="_demoFormSchemaCode" />

			<h3 id="setup-the-form" spartanH4>Setup the form</h3>

			<p class="${hlmP}">
				Next, we'll import
				<code class="${hlmCode}">ReactiveFormsModule</code>
				and bind the form schema to the form element.
			</p>
			<spartan-code class="mt-6" fileName="bug-report-form.ts" [code]="_demoSetupForm" />

			<h3 id="build-the-form" spartanH4>Build the form</h3>

			<p class="${hlmP}">
				We can now build the form using
				<code class="${hlmCode}">HlmField</code>
				component and bind the form controls using
				<code class="${hlmCode}">formControlName</code>
				.
			</p>

			<spartan-code class="mt-6" fileName="bug-report-form.ts" [code]="_demoCode" />

			<h3 id="done" spartanH4>Done</h3>

			<p class="${hlmP}">That's it. You now have a fully accessible form with client-side validation.</p>

			<p class="${hlmP}">
				When you submit the form, the
				<code class="${hlmCode}">ngSubmit</code>
				emits an event. Check if the form data is
				<code class="${hlmCode}">form.invalid</code>
				and use
				<code class="${hlmCode}">form.markAllAsTouched()</code>
				to mark all controls as touched. This will trigger the display of validation errors next to each field.
			</p>

			<spartan-section-sub-heading id="validation">Validation</spartan-section-sub-heading>

			<p class="${hlmP}">
				Reactive Forms provides a powerful validation system. Validator functions support either synchronous or
				asynchronous validation. You can use built-in validators or create custom ones. Built-in validators are
				available in the
				<code class="${hlmCode}">Validators</code>
				class such as
				<code class="${hlmCode}">Validators.required</code>
				or
				<code class="${hlmCode}">Validators.email</code>
				.
			</p>

			<p class="${hlmP}">
				Add one or more validator functions to your form schema using the form builder. If the form data is invalid, you
				can check the form's validity using
				<code class="${hlmCode}">form.valid</code>
				and
				<code class="${hlmCode}">form.invalid</code>
				.
			</p>

			<spartan-code class="mt-6" fileName="bug-report-form.ts" [code]="_demoFormSchemaCode" />

			<spartan-section-sub-heading id="displaying-errors">Displaying Errors</spartan-section-sub-heading>

			<p class="${hlmP}">
				Display errors next to the field using
				<code class="${hlmCode}">HlmFieldError</code>
				. Check the form control's
				<code class="${hlmCode}">touched</code>
				and
				<code class="${hlmCode}">invalid</code>
				state to conditionally show error messages. Use the form control's
				<code class="${hlmCode}">errors</code>
				object to access specific validation errors and display appropriate messages.
			</p>

			<spartan-code class="mt-6" [code]="_demoAnatomyCode" />

			<spartan-section-sub-heading id="working-with-different-field-types">
				Working with Different Field Types
			</spartan-section-sub-heading>

			<h3 id="input" spartanH4>Input</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-reactive-form-input-demo />
				</div>
				<spartan-code secondTab [code]="_reactiveFormsInputDemoCode" />
			</spartan-tabs>

			<h3 id="textarea" spartanH4>Textarea</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-reactive-form-textarea-demo />
				</div>
				<spartan-code secondTab [code]="_reactiveFormsTextareaDemoCode" />
			</spartan-tabs>

			<h3 id="select" spartanH4>Select</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-reactive-form-select-demo />
				</div>
				<spartan-code secondTab [code]="_reactiveFormsSelectDemoCode" />
			</spartan-tabs>

			<h3 id="checkbox" spartanH4>Checkbox</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-reactive-form-checkbox-demo />
				</div>
				<spartan-code secondTab [code]="_reactiveFormsCheckboxDemoCode" />
			</spartan-tabs>

			<h3 id="radio-group" spartanH4>Radio Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-reactive-form-radio-group-demo />
				</div>
				<spartan-code secondTab [code]="_reactiveFormsRadioGroupDemoCode" />
			</spartan-tabs>

			<h3 id="switch" spartanH4>Switch</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-reactive-form-switch-demo />
				</div>
				<spartan-code secondTab [code]="_reactiveFormsSwitchDemoCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="resetting-the-form">Resetting the form</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">form.reset()</code>
				to reset the form to its default values and mark all controls as pristine and untouched.
			</p>
			<spartan-code class="mt-6" [code]="_demoResetForm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/stack/overview" label="Stack" />
				<spartan-page-bottom-nav-link direction="previous" href="/forms" label="Forms" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ReactiveFormsPage {
	protected readonly _demoCode = demoCode;
	protected readonly _demoAnatomyCode = demoAnatomyCode;
	protected readonly _demoFormSchemaCode = demoFormSchemaCode;
	protected readonly _demoSetupForm = demoSetupForm;
	protected readonly _demoResetForm = demoResetForm;

	protected readonly _reactiveFormsInputDemoCode = reactiveFormsInputDemoCode;
	protected readonly _reactiveFormsTextareaDemoCode = reactiveFormsTextareaDemoCode;
	protected readonly _reactiveFormsCheckboxDemoCode = reactiveFormsCheckboxDemoCode;
	protected readonly _reactiveFormsRadioGroupDemoCode = reactiveFormsRadioGroupDemoCode;
	protected readonly _reactiveFormsSelectDemoCode = reactiveFormsSelectDemoCode;
	protected readonly _reactiveFormsSwitchDemoCode = reactiveFormsSwitchDemoCode;
}
