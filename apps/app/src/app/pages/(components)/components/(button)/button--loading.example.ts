import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-loading',
	imports: [HlmButtonImports, NgIcon, HlmIconImports],
	providers: [provideIcons({ lucideLoaderCircle })],
	template: `
		<button disabled hlmBtn size="sm">
			<ng-icon hlm name="lucideLoaderCircle" size="sm" class="animate-spin" />
			Please wait
		</button>
	`,
})
export class ButtonLoading {}
