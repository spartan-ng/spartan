import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { components } from '@spartan-ng/app/app/shared/components/navigation-items';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { SpartanNewMarker } from '@spartan-ng/app/app/shared/spartan-new-marker';
import { HlmBadge } from '@spartan-ng/helm/badge';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Components' },
	meta: metaWith(
		'spartan/ui - Components',
		'Here you can find all the components available in the library. We are working on adding more components.',
	),
	title: 'spartan/ui - Components',
};
@Component({
	selector: 'spartan-input',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		RouterLink,
		HlmBadge,
		SpartanNewMarker,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Components"
				lead="Here you can find all the components available in the library. We are working on adding more components."
			/>

			<div
				class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20"
			>
				@for (component of _components; track component.url) {
					<a
						class="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
						[class.opacity-50]="component.wip"
						[class.pointer-events-none]="component.wip"
						[routerLink]="'/components' + component.url"
					>
						{{ component.label }}
						@if (component.new) {
							<span spartanNewMarker></span>
						}
						@if (component.wip) {
							<span hlmBadge>soon</span>
						}
					</a>
				}
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="accordion" label="Accordion" />
				<spartan-page-bottom-nav-link direction="previous" href="/documentation/introduction" label="Docs" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class TogglePage {
	protected readonly _components = components;
}
