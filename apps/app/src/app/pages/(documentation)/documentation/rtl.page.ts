import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { MainSection } from '../../../shared/layout/main-section';
import { PageNav } from '../../../shared/layout/page-nav/page-nav';
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
	imports: [MainSection, PageNav, PageNav],

	template: `
		<section spartanMainSection>Comming soon...</section>
		<spartan-page-nav />
	`,
})
export default class DocsIntroPage {}
