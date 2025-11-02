import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { NavLink } from '@spartan-ng/app/app/shared/spartan-nav-link';
import { HlmButton } from '@spartan-ng/helm/button';
import { hlmLead } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	meta: metaWith('Examples - SPARTAN', 'Examples built with the SPARTAN stack and its UI primitives'),
};

@Component({
	selector: 'spartan-examples',
	imports: [RouterOutlet, HlmButton, RouterLink, NavLink],
	host: {
		class: 'block p-4 pt-6 sm:pb-16 sm:pt-12',
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
			Check out some examples.
		</h1>
		<p class="${hlmLead} mt-4 max-w-xl">
			Dashboard, cards, authentication. Some examples built using the components. Use this as a guide to build your own.
		</p>
		<div class="mt-6 space-x-2">
			<a hlmBtn size="sm" routerLink="/documentation">Get Started</a>
			<a hlmBtn size="sm" variant="outline" routerLink="/components">Components</a>
		</div>

		<nav class="scrollbar-w-0 mt-12 mb-2 h-11 overflow-x-auto sm:h-auto">
			<ul class="flex space-x-2">
				<li><a class="!font-medium" spartanNavLink="/examples/overview">Overview</a></li>
				<li><a class="!font-medium" spartanNavLink="/examples/dashboard">Dashboard</a></li>
				<li><a class="!font-medium" spartanNavLink="/examples/tasks">Tasks</a></li>
				<li><a class="!font-medium" spartanNavLink="/examples/playground">Playground</a></li>
				<li><a class="!font-medium" spartanNavLink="/examples/authentication">Authentication</a></li>
				<li><a class="!font-medium" spartanNavLink="/examples/music">Music</a></li>
			</ul>
		</nav>
		<div class="overflow-hidden rounded-lg">
			<router-outlet />
		</div>
	`,
})
export default class ExamplesPage {}
