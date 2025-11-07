import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { NavLink } from '@spartan-ng/app/app/shared/spartan-nav-link';
import { HlmButton } from '@spartan-ng/helm/button';
import { hlmLead } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	meta: metaWith('Blocks - spartan', 'Blocks built with the spartan/ui'),
};

@Component({
	selector: 'spartan-blocks',
	imports: [RouterOutlet, HlmButton, RouterLink, NavLink],
	host: {
		class: 'block p-4 pt-6 sm:pb-16 sm:pt-12 container',
	},
	styles: `
		.scrollbar-w-0 {
			scrollbar-width: none;
		}

		.scrollbar-w-0::-webkit-scrollbar {
			width: 0;
		}
	`,
	template: `
		<h1
			class="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter"
		>
			Building Blocks with spartan/ui
		</h1>
		<p class="${hlmLead} mt-4 max-w-xl">Clean, modern building blocks.</p>
		<div class="mt-6 space-x-2">
			<a hlmBtn size="sm" routerLink="/documentation">Get Started</a>
			<a hlmBtn size="sm" variant="outline" routerLink="/components">Components</a>
		</div>

		<nav class="scrollbar-w-0 mt-12 mb-2 h-11 overflow-x-auto sm:h-auto">
			<ul class="flex space-x-2">
				<li><a class="text-muted-foreground !font-medium" spartanNavLink="/blocks/sidebar">Sidebar</a></li>
			</ul>
		</nav>
		<div class="">
			<router-outlet />
		</div>
	`,
})
export default class BlocksPage {}
