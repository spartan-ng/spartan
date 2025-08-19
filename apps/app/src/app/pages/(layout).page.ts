import { injectLoad } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { GithubRepoService } from '../core/services/github-repo-service';
import { Footer } from '../shared/footer/footer';
import { Header } from '../shared/header/header';
import { load } from './(layout).server';

@Component({
	selector: 'spartan-root-layout',
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
export default class RootLayoutComponent {
	private readonly _githubRepoService = inject(GithubRepoService);
	protected readonly _githubRepoData = toSignal(injectLoad<typeof load>(), { requireSync: true });

	constructor() {
		this._githubRepoService.setGithubData(this._githubRepoData());
	}
}
