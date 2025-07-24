import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Breadcrumbs } from '@spartan-ng/app/app/shared/breadcrumbs/breadcrumbs';
import { Container } from '@spartan-ng/app/app/shared/layout/container';

import { PageNavOutlet } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav-outlet';
import { SideNav } from '@spartan-ng/app/app/shared/layout/side-nav/side-nav';

@Component({
	selector: 'spartan-page',
	imports: [RouterOutlet, SideNav, Breadcrumbs, PageNavOutlet],
	hostDirectives: [Container],
	template: `
		<spartan-side-nav />
		<main class="sticky top-0 overflow-hidden py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[minmax(0,1fr)_280px]">
			<div class="px-2">
				<spartan-breadcrumbs />
				<router-outlet />
			</div>
			<spartan-page-nav-outlet />
		</main>
	`,
})
export class Page {}
