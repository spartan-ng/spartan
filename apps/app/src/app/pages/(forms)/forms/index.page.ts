import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forms } from '@spartan-ng/app/app/shared/components/navigation-items';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Forms' },
	meta: metaWith('spartan/ui - Forms', 'Build forms with Angular and spartan/ui.'),
	title: 'spartan/ui - Forms',
};
@Component({
	selector: 'spartan-forms-page',
	imports: [MainSection, SectionIntro, PageBottomNav, PageBottomNavLink, PageNav, RouterLink, SectionSubHeading],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Forms" lead="Build forms with Angular and spartan/ui." />

			<spartan-section-sub-heading id="pick-your-form-system">Pick Your Form System</spartan-section-sub-heading>

			<div class="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
				@for (form of _forms; track form.url) {
					<a
						class="bg-surface text-surface-foreground hover:bg-surface/80 flex w-full flex-col items-center justify-center rounded-xl p-6 transition-colors data-wip:pointer-events-none data-wip:border data-wip:border-dashed data-wip:bg-transparent sm:p-10"
						[attr.data-wip]="form.wip ? 'true' : null"
						[routerLink]="'/forms' + form.url"
					>
						{{ form.label }}
						@if (form.wip) {
							<span class="text-muted-foreground mt-1 text-xs">(Coming Soon)</span>
						}
					</a>
				}
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/forms/reactive-forms" label="Reactive Forms" />
				<spartan-page-bottom-nav-link direction="previous" href="/components/tooltip" label="Tooltip" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class FormsPage {
	protected readonly _forms = forms.filter((form) => form.url !== '/');
}
