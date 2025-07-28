import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GithubRepoService } from './core/services/github-repo.service';

@Component({
	selector: 'spartan-root',
	imports: [RouterOutlet],
	template: `
		<router-outlet />
	`,
	providers: [GithubRepoService],
})
export class AppComponent {}
