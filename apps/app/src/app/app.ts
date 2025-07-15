import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';
import { Header } from './shared/header/header';

@Component({
	selector: 'spartan-root',
	imports: [RouterOutlet, Header, Footer],
	host: {
		class: 'text-foreground block antialiased',
	},
	template: `
		<spartan-header />
		<div class="mx-auto max-w-screen-2xl">
			<router-outlet />
		</div>
		<spartan-footer />
	`,
})
export class App {}
