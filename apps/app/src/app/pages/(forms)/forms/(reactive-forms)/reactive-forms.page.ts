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
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { metaWith } from '../../../../shared/meta/meta.util';
import { demoAnatomyCode, demoCode, ReactiveFormsDemo } from './reactive-forms.demo';

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
		TabsCli,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SectionSubSubHeading,
		ReactiveFormsDemo,
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
					<spartan-reactive-forms-demo />
				</div>
				<spartan-code secondTab [code]="_demoCode" />
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
}
