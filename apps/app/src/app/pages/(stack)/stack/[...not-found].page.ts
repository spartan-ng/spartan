import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmMuted } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Not Found' },
	meta: metaWith('spartan/stack - Page not found', 'Seems like you got lost browsing the spartan/stack.'),
	title: 'spartan/stack - Page not found',
};

@Component({
	selector: 'spartan-stack-not-found',
	imports: [MainSection],
	template: `
		<section spartanMainSection class="flex flex-col items-center justify-center">
			<div class="-mt-[25%] mb-8 flex items-center">
				<p class="${hlmMuted}">Coming soon...</p>
			</div>
		</section>
	`,
})
export default class sNotFoundPage {}
