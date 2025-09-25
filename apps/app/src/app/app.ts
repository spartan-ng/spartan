import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';
import { Header } from './shared/header/header';

@Component({
	selector: 'spartan-root',
	imports: [RouterOutlet, Header, Footer],
	host: {
		class: 'bg-background relative z-10 flex min-h-svh flex-col',
	},
	template: `
		<spartan-header />
		<main class="flex flex-1 flex-col">
			<router-outlet />
		</main>
		<spartan-footer />
	`,
})
export class App {}
