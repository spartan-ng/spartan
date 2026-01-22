import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmButton } from '@spartan-ng/helm/button';
import { hlmH3, hlmMuted } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Not Found' },
	meta: metaWith('spartan - Page not found', 'Seems like you got lost browsing spartan.'),
	title: 'spartan - Page not found',
};

@Component({
	selector: 'spartan-not-found',
	imports: [HlmButton, RouterLink],
	host: {
		class: 'min-h-[80vh] flex flex-col gap-4 items-center justify-center',
	},
	template: `
		<div class="flex flex-col items-center gap-4">
			<h1 class="${hlmH3}">404</h1>
			<p class="${hlmMuted}">This page could not be found</p>
		</div>
		<a routerLink="/" size="sm" class="text-xs" hlmBtn variant="link">Back home</a>
	`,
})
export default class NotFound {}
