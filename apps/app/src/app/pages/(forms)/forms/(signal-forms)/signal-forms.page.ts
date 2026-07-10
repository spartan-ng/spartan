import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { CodePreview } from '@spartan-ng/app/app/shared/code/code-preview';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { Tabs } from '@spartan-ng/app/app/shared/layout/tabs';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import { passwordInputCode } from './custom-control/password-input';
import { SignalFormCheckboxDemo, signalFormsCheckboxDemoCode } from './signal-forms--checkbox.demo';
import { SignalFormComplexDemo, signalFormsComplexDemoCode } from './signal-forms--complex.demo';
import {
	demoPasswordInputGroupCode,
	SignalFormCustomControlDemo,
	signalFormsCustomControlDemoCode,
} from './signal-forms--custom-control.demo';
import { SignalFormInputDemo, signalFormsInputDemoCode } from './signal-forms--input.demo';
import { SignalFormRadioGroupDemo, signalFormsRadioGroupDemoCode } from './signal-forms--radio-group.demo';
import { SignalFormSelectDemo, signalFormsSelectDemoCode } from './signal-forms--select.demo';
import { signalFormsSwitchDemoCode, SignalFormSwitchDemo } from './signal-forms--switch.demo';
import { signalFormsTextareaDemoCode, SignalFormTextareaDemo } from './signal-forms--textarea.demo';
import {
	BugFormsDemo,
	demoAnatomyCode,
	demoCode,
	demoForceShowCode,
	demoFormModelCode,
	demoResetForm,
	demoSetupFormWithFormRoot,
	demoSetupFormWithSubmit,
	demoSubmittingState,
} from './signal-forms.demo';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Signal Forms' },
	meta: metaWith('spartan/ui - Signal Forms', 'Build forms in Angular using Signal Forms.'),
	title: 'spartan/ui - Signal Forms',
};
@Component({
	selector: 'spartan-signal-forms',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		Tabs,
		CodePreview,

		BugFormsDemo,
		SignalFormInputDemo,
		SignalFormTextareaDemo,
		SignalFormSelectDemo,
		SignalFormCheckboxDemo,
		SignalFormRadioGroupDemo,
		SignalFormSwitchDemo,
		SignalFormComplexDemo,
		SignalFormCustomControlDemo,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Signal Forms" lead="Build forms in Angular using Signal Forms." />

			<p class="${hlmP}">
				In this guide, we will take a look at building forms with Signal Forms. We'll cover building forms with the
				<code class="${hlmCode}">HlmField</code>
				component, how to handle validation and how to display errors.
			</p>

			<spartan-section-sub-heading id="custom-control">Custom Control</spartan-section-sub-heading>

			<p class="${hlmP}">
				Signal Forms allows you to build
				<a
					href="https://angular.dev/guide/forms/signals/custom-controls"
					class="underline"
					target="_blank"
					rel="noopener"
				>
					custom form controls
				</a>
				using the
				<code class="${hlmCode}">FormValueControl</code>
				interface.
			</p>

			<p class="${hlmP}">
				In this example, we are going to build a custom password input control that toggles visibility and integrates
				seamlessly with Signal Forms.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-signal-form-custom-control-demo />
				</div>
				<spartan-code secondTab [code]="_signalFormsCustomControlDemoCode" />
			</spartan-tabs>

			<h3 id="inline-input-group" spartanH4>Inline input group</h3>

			<p class="${hlmP}">
				The example below builds an inline input group with a password field and a visibility toggle
				<code class="${hlmCode}">button</code>
				. You can customize your form fields and inputs directly inline. This is useful for one-off inputs where
				creating a dedicated component would be overkill.
			</p>

			<spartan-code class="mt-6" fileName="login-form.ts" [code]="_demoPasswordInputGroupCode" />

			<h3 id="custom-control-component" spartanH4>Custom control component</h3>

			<p class="${hlmP}">
				When you want to reuse a custom input across your app — like a password input used in login, register, and
				password reset forms — extract it into a standalone component that implements the
				<code class="${hlmCode}">FormValueControl</code>
				interface. This lets your component integrate natively with Signal Forms, just like any built-in form control.
			</p>

			<p class="${hlmP}">
				When implementing
				<code class="${hlmCode}">FormValueControl</code>
				there are a few things to wire up:
			</p>
			<ul class="${hlmUl}">
				<li>
					Set up a
					<code class="${hlmCode}">value</code>
					model and bind it to the input with
					<code class="${hlmCode}">[value]="value()"</code>
					and
					<code class="${hlmCode}">(input)="value.set($event.target.value)"</code>
					, as shown in the password input example below.
				</li>
				<li>
					Add
					<a
						class="${link}"
						href="https://angular.dev/guide/forms/signals/custom-controls#adding-state-signals"
						target="_blank"
						rel="noopener noreferrer"
					>
						state signals
					</a>
					(
					<code class="${hlmCode}">disabled</code>
					,
					<code class="${hlmCode}">readonly</code>
					etc.) to make your control react to the form control state changes.
				</li>
				<li>
					Call
					<code class="${hlmCode}">touch()</code>
					on your input's blur event (
					<a
						href="https://agoge.spartan.ng/forms/signal-forms#custom-control"
						target="_blank"
						rel="noopener noreferrer"
					>
						Angular v22+
					</a>
					). In Angular v21, use
					<code class="${hlmCode}">touchedChange</code>
					instead — see
					<a
						class="${link}"
						href="https://angular.dev/guide/forms/signals/custom-controls#working-with-debounceblur"
						target="_blank"
						rel="noopener noreferrer"
					>
						debounce / blur
					</a>
					for details.
				</li>
				<li>
					Form components (like Input, Autocomplete, Select) use
					<code class="${hlmCode}">BrnFieldControl</code>
					and receive automatically invalid states from the form control.
				</li>
			</ul>

			<spartan-code class="mt-6" fileName="password-input.ts" [code]="_demoPasswordInputComponentCode" />

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
				This form leverages Angular Signal Form for flexible form handling. We'll build our form using the
				<code class="${hlmCode}">HlmField</code>
				component, which gives you complete flexibility over the markup and styling.
			</p>
			<ul class="${hlmUl}">
				<li>
					Uses Angular
					<code class="${hlmCode}">signal()</code>
					to represent the form's
					<a
						class="${link}"
						href="https://angular.dev/guide/forms/signals/models#creating-models"
						target="_blank"
						rel="noopener noreferrer"
					>
						data structure
					</a>
					and
					<code class="${hlmCode}">form()</code>
					for the form state management and validation.
				</li>

				<li>
					<code class="${hlmCode}">[formField]="form.email"</code>
					<a
						class="${link}"
						href="https://angular.dev/guide/forms/signals/models#two-way-data-binding"
						target="_blank"
						rel="noopener noreferrer"
					>
						binds
					</a>
					the form field to the input element.
				</li>
				<li>
					<code class="${hlmCode}">HlmField</code>
					components for building accessible forms.
				</li>
				<li>
					Use
					<code class="${hlmCode}">submit()</code>
					or
					<code class="${hlmCode}">FormRoot</code>
					for
					<a
						class="${link}"
						href="https://angular.dev/guide/forms/signals/form-submission"
						target="_blank"
						rel="noopener noreferrer"
					>
						form submission
					</a>
					and revealing validation errors.
				</li>
			</ul>

			<spartan-section-sub-heading id="anatomy">Anatomy</spartan-section-sub-heading>
			<p class="${hlmP}">
				Here's a basic example of a form using the
				<code class="${hlmCode}">HlmField</code>
				component and binding it via
				<code class="${hlmCode}">[formField]="form.title"</code>
				to the input element.
			</p>
			<p class="${hlmP}">
				Notice that
				<code class="${hlmCode}">HlmFieldLabel</code>
				does not need a
				<code class="${hlmCode}">for</code>
				attribute. When a label and a control are placed inside the same
				<code class="${hlmCode}">HlmField</code>
				, the
				<code class="${hlmCode}">for</code>
				attribute is automatically set to the control's
				<code class="${hlmCode}">id</code>
				.
			</p>

			<spartan-code class="mt-6" [code]="_demoAnatomyCode" />

			<spartan-section-sub-heading id="form">Form</spartan-section-sub-heading>

			<h3 id="create-a-form-model" spartanH4>Create a form model</h3>
			<p class="${hlmP}">
				We'll start by creating the form model with
				<code class="${hlmCode}">signal()</code>
				to represent the form's data structure, then wrap it with
				<code class="${hlmCode}">form()</code>
				to enable binding to input elements and configure validations.
			</p>

			<spartan-code class="mt-6" fileName="bug-report-form.ts" [code]="_demoFormModelCode" />

			<h3 id="setup-the-form" spartanH4>Setup the form</h3>

			<p class="${hlmP}">
				Angular recommends using
				<a
					class="${link}"
					href="https://angular.dev/guide/forms/signals/form-submission#setting-up-form-submission-with-formroot"
					target="_blank"
					rel="noopener noreferrer"
				>
					<code class="${hlmCode}">FormRoot</code>
				</a>
				as the most common way to handle form submission. It automatically takes care of three things:
			</p>
			<ul class="${hlmUl}">
				<li>
					Sets
					<code class="${hlmCode}">novalidate</code>
					on the form element to disable native browser validation.
				</li>
				<li>Prevents the default submit event, stopping browser navigation on form submission.</li>
				<li>
					Calls
					<code class="${hlmCode}">submit()</code>
					to mark all interactive fields as touched, run validation, and reveal any errors.
				</li>
			</ul>
			<spartan-code class="mt-6" fileName="bug-report-form.ts" [code]="_demoSetupFormWithFormRoot" />

			<p class="${hlmP}">
				Alternatively, you can call
				<a
					class="${link}"
					href="https://angular.dev/guide/forms/signals/form-submission#manual-submission-with-submit"
					target="_blank"
					rel="noopener noreferrer"
				>
					<code class="${hlmCode}">submit()</code>
				</a>
				directly for more control over when and how submission is triggered. This is useful for multi-step wizards,
				auto-save, or triggering submission from outside the form element. When doing so:
			</p>
			<ul class="${hlmUl}">
				<li>
					You must
					<strong>manually</strong>
					set
					<code class="${hlmCode}">novalidate</code>
					on the form element.
				</li>
				<li>
					You must
					<strong>prevent</strong>
					the default browser navigation event yourself.
				</li>
			</ul>
			<spartan-code class="mt-6" fileName="bug-report-form.ts" [code]="_demoSetupFormWithSubmit" />

			<h3 id="build-the-form" spartanH4>Build the form</h3>

			<p class="${hlmP}">
				We can now build the form using
				<code class="${hlmCode}">HlmField</code>
				component and bind the form controls using
				<code class="${hlmCode}">[formField]</code>
				.
			</p>

			<spartan-code class="mt-6" fileName="bug-report-form.ts" [code]="_demoCode" />

			<h3 id="done" spartanH4>Done</h3>

			<p class="${hlmP}">That's it. You now have a fully accessible form with client-side validation.</p>

			<p class="${hlmP}">
				Calling
				<code class="${hlmCode}">submit()</code>
				checks if the form is valid and performs the action. If the form is invalid, it marks all fields as touched and
				reveals their validation errors.
			</p>

			<spartan-section-sub-heading id="validation">Validation</spartan-section-sub-heading>

			<p class="${hlmP}">
				Signal Forms provides a
				<a
					class="${link}"
					href="https://angular.dev/guide/forms/signals/validation"
					target="_blank"
					rel="noopener noreferrer"
				>
					powerful validation system
				</a>
				. Validator functions support either synchronous or asynchronous validation. You can use built-in validators or
				create custom ones. Built-in validators are available such as
				<code class="${hlmCode}">required()</code>
				or
				<code class="${hlmCode}">email()</code>
				. Each validator carries its error message directly alongside the validation logic, keeping them co-located and
				easy to maintain.
			</p>

			<p class="${hlmP}">
				Add one or more validator functions per field inside
				<code class="${hlmCode}">form()</code>
				. Use
				<code class="${hlmCode}">form().valid()</code>
				or
				<code class="${hlmCode}">form().invalid()</code>
				to reactively check the form's overall validity.
			</p>

			<spartan-code class="mt-6" fileName="bug-report-form.ts" [code]="_demoFormModelCode" />

			<spartan-section-sub-heading id="displaying-errors">Displaying Errors</spartan-section-sub-heading>

			<p class="${hlmP}">
				<code class="${hlmCode}">HlmFieldError</code>
				renders automatically when placed inside an
				<code class="${hlmCode}">HlmField</code>
				whose control is invalid. There is no need to wrap it in
				<code class="${hlmCode}">&#64;if</code>
				blocks or manually check control state — the field handles visibility for you.
			</p>

			<p class="${hlmP}">
				Visibility is driven by the
				<code class="${hlmCode}">data-matches-spartan-invalid</code>
				attribute, which spartan sets on the field element. Its value reflects the return value of
				<code class="${hlmCode}">ErrorStateMatcher.isInvalid()</code>
				— by default
				<code class="${hlmCode}">true</code>
				when the control is invalid and touched. This attribute controls both error styling and the visibility of
				<code class="${hlmCode}">HlmFieldError</code>
				messages.
			</p>

			<p class="${hlmP}">
				You can change when errors appear by providing a custom
				<code class="${hlmCode}">ErrorStateMatcher</code>
				at the component or application level. spartan ships with
				<code class="${hlmCode}">ShowOnDirtyErrorStateMatcher</code>
				as a ready-made alternative that shows errors as soon as the control is dirty rather than waiting for a touch
				event.
			</p>

			<p class="${hlmP}">
				When a
				<code class="${hlmCode}">validator</code>
				input is specified on
				<code class="${hlmCode}">HlmFieldError</code>
				, the message is only shown when the control has an error matching that validator key — letting you place
				multiple targeted error messages inside a single
				<code class="${hlmCode}">HlmField</code>
				, each tied to a specific validation rule.
			</p>

			<spartan-code class="mt-6" [code]="_demoAnatomyCode" />

			<p class="${hlmP}">
				Set
				<code class="${hlmCode}">forceShow</code>
				on
				<code class="${hlmCode}">HlmFieldError</code>
				to always display the message, regardless of the control's error state or the active
				<code class="${hlmCode}">ErrorStateMatcher</code>
				. This is useful for cross-field validation errors that are not tied to a specific control, such as a password
				mismatch message.
			</p>

			<spartan-code class="mt-6" [code]="_demoForceShowCode" />

			<spartan-section-sub-heading id="submission-state">Submission state</spartan-section-sub-heading>
			<p class="${hlmP}">
				Whenever
				<code class="${hlmCode}">submit()</code>
				is called - whether through
				<code class="${hlmCode}">FormRoot</code>
				or directly -
				<a
					class="${link}"
					href="https://angular.dev/guide/forms/signals/form-submission#showing-submission-state-with-submitting"
					target="_blank"
					rel="noopener noreferrer"
				>
					<code class="${hlmCode}">form().submitting()</code>
				</a>
				will be
				<code class="${hlmCode}">true</code>
				for the duration of the submission. Use this to disable the submit button and show a loading indicator.
			</p>

			<spartan-code class="mt-6" [code]="_demoSubmittingState" />

			<spartan-section-sub-heading id="working-with-different-field-types">
				Working with Different Field Types
			</spartan-section-sub-heading>

			<h3 id="input" spartanH4>Input</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-signal-form-input-demo />
				</div>
				<spartan-code secondTab [code]="_signalFormsInputDemoCode" />
			</spartan-tabs>

			<h3 id="textarea" spartanH4>Textarea</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-signal-form-textarea-demo />
				</div>
				<spartan-code secondTab [code]="_signalFormsTextareaDemoCode" />
			</spartan-tabs>

			<h3 id="select" spartanH4>Select</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-signal-form-select-demo />
				</div>
				<spartan-code secondTab [code]="_signalFormsSelectDemoCode" />
			</spartan-tabs>

			<h3 id="checkbox" spartanH4>Checkbox</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-signal-form-checkbox-demo />
				</div>
				<spartan-code secondTab [code]="_signalFormsCheckboxDemoCode" />
			</spartan-tabs>

			<h3 id="radio-group" spartanH4>Radio Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-signal-form-radio-group-demo />
				</div>
				<spartan-code secondTab [code]="_signalFormsRadioGroupDemoCode" />
			</spartan-tabs>

			<h3 id="switch" spartanH4>Switch</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-signal-form-switch-demo />
				</div>
				<spartan-code secondTab [code]="_signalFormsSwitchDemoCode" />
			</spartan-tabs>

			<h3 id="complex-forms" spartanH4>Complex Forms</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-signal-form-complex-demo />
				</div>
				<spartan-code secondTab [code]="_signalFormsComplexDemoCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="resetting-the-form">Resetting the form</spartan-section-sub-heading>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">form.reset(&lbrace;...&rbrace;)</code>
				to reset the form to its default values and mark all controls as pristine and untouched.
			</p>
			<spartan-code class="mt-6" [code]="_demoResetForm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/stack/overview" label="Stack" />
				<spartan-page-bottom-nav-link direction="previous" href="/forms/reactive-forms" label="Reactive Forms" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SignalFormsPage {
	public readonly spartanAgogeUrl = 'https://github.com/spartan-ng/spartan-agoge';
	public readonly signalFormsDemoUrl =
		'https://github.com/spartan-ng/spartan-agoge/blob/main/src/app/pages/forms/signal-forms.page.ts';

	protected readonly _demoCode = demoCode;
	protected readonly _demoAnatomyCode = demoAnatomyCode;
	protected readonly _demoFormModelCode = demoFormModelCode;
	protected readonly _demoSetupFormWithFormRoot = demoSetupFormWithFormRoot;
	protected readonly _demoSetupFormWithSubmit = demoSetupFormWithSubmit;
	protected readonly _demoForceShowCode = demoForceShowCode;
	protected readonly _demoSubmittingState = demoSubmittingState;
	protected readonly _demoResetForm = demoResetForm;

	protected readonly _signalFormsInputDemoCode = signalFormsInputDemoCode;
	protected readonly _signalFormsTextareaDemoCode = signalFormsTextareaDemoCode;
	protected readonly _signalFormsCheckboxDemoCode = signalFormsCheckboxDemoCode;
	protected readonly _signalFormsRadioGroupDemoCode = signalFormsRadioGroupDemoCode;
	protected readonly _signalFormsSelectDemoCode = signalFormsSelectDemoCode;
	protected readonly _signalFormsSwitchDemoCode = signalFormsSwitchDemoCode;
	protected readonly _signalFormsComplexDemoCode = signalFormsComplexDemoCode;

	protected readonly _signalFormsCustomControlDemoCode = signalFormsCustomControlDemoCode;
	protected readonly _demoPasswordInputGroupCode = demoPasswordInputGroupCode;
	protected readonly _demoPasswordInputComponentCode = passwordInputCode;
}
