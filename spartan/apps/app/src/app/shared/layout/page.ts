import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PageNavOutlet } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav-outlet';
import { SideNav } from '@spartan-ng/app/app/shared/layout/side-nav/side-nav';

@Component({
	selector: 'spartan-page',
	imports: [RouterOutlet, SideNav, PageNavOutlet],
	host: {
		class: 'container-wrapper flex flex-1 flex-col px-2',
	},
	template: `
		<spartan-side-nav>
			<div class="h-full w-full">
				<div class="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
					<div class="flex min-w-0 flex-1 flex-col">
						<div class="h-(--top-spacing) shrink-0"></div>
						<div
							class="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300 [&>*:nth-child(2)]:block [&>*:nth-child(2)]:w-full"
						>
							<router-outlet />
						</div>
					</div>
					<spartan-page-nav-outlet />
				</div>
			</div>
		</spartan-side-nav>
	`,
})
export class Page {}
