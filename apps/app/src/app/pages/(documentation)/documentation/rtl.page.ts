import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { MainSection } from '../../../shared/layout/main-section';
import { PageBottomNavPlaceholder } from '../../../shared/layout/page-bottom-nav-placeholder';
import { PageBottomNav } from '../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../shared/layout/section-sub-heading';
import { metaWith } from '../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Introduction' },
	meta: metaWith(
		'spartan - Introduction',
		'spartan is a collection of tools to superpower your Angular full-stack development.',
	),
	title: 'spartan - Introduction',
};

@Component({
	selector: 'spartan-docs-intro',
	imports: [
		MainSection,
		SectionIntro,
		SectionSubHeading,
		PageNav,
		HlmAccordionImports,
		RouterLink,
		PageNav,
		PageBottomNavLink,
		PageBottomNav,
		PageBottomNavPlaceholder,
		HlmButtonImports,
		NgIcon,
		HlmIconImports,
	],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<section spartanMainSection>Comming soon...</section>
		<spartan-page-nav />
	`,
})
export default class DocsIntroPage {}
