import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

export const routeMeta: RouteMeta = {
	meta: metaWith('Blocks - spartan', 'Blocks built with the spartan/ui'),
};

@Component({
	selector: 'spartan-blocks',
	imports: [RouterOutlet, HlmButton, RouterLink, HlmTabsImports],
	host: {
		class: 'block',
	},
	template: `
		<div class="container flex flex-col items-center gap-2 py-8 md:py-16 lg:py-20 xl:gap-4">
			<h1
				class="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter"
			>
				Building Blocks with spartan/ui
			</h1>
			<p class="text-foreground max-w-3xl text-base text-balance sm:text-lg">
				Clean, modern building blocks for your Angular applications.
			</p>
			<div class="flex gap-2 pt-2">
				<a hlmBtn size="sm" routerLink="/documentation">Get Started</a>
				<a hlmBtn size="sm" variant="outline" routerLink="/components">Components</a>
			</div>
		</div>

		<section class="container-wrapper px-6">
			<hlm-tabs [tab]="_activeTab()" class="w-full">
				<hlm-tabs-list
					aria-label="Blocks Tabs"
					class="bg-background dark:[&>a]:bg-background [&>a]:text-muted-foreground [&>a]:data-[state=active]:text-primary [&>a]:hover:text-primary dark:[&>a]:data-[state=active]:bg-background [&>a]:cursor-pointer [&>a]:data-[state=active]:shadow-none dark:[&>a]:data-[state=active]:border-none"
				>
					<a hlmTabsTrigger="sidebar" routerLink="/blocks/sidebar">Sidebar</a>
				</hlm-tabs-list>
			</hlm-tabs>

			<router-outlet />
		</section>
	`,
})
export default class BlocksPage {
	private readonly _router = inject(Router);

	private readonly _lastUrlSegment = computed(() => {
		const segments = this._router.url.split('/');
		const last = segments[segments.length - 1];
		return last;
	});

	protected readonly _activeTab = signal<string>(this._lastUrlSegment() || 'sidebar');
}
