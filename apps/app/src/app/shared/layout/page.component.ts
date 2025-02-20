import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '@spartan-ng/app/app/shared/breadcrumbs/breadcrumbs.component';
import { ContainerDirective } from '@spartan-ng/app/app/shared/layout/container.directive';
import { MainSectionDirective } from '@spartan-ng/app/app/shared/layout/main-section.directive';
import { PageNavOutletComponent } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav-outlet.component';
import { SideNavComponent } from '@spartan-ng/app/app/shared/layout/side-nav/side-nav.component';

@Component({
	selector: 'spartan-page',
	imports: [RouterOutlet, SideNavComponent, BreadcrumbsComponent, MainSectionDirective, PageNavOutletComponent],
	hostDirectives: [ContainerDirective],
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
export class PageComponent {}
