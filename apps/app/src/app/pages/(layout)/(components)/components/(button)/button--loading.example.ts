import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-loading',
	imports: [HlmButtonDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideLoaderCircle })],
	template: `
		<button disabled hlmBtn size="sm">
			<ng-icon hlm name="lucideLoaderCircle" size="sm" class="animate-spin" />
			Please wait
		</button>
	`,
})
export class ButtonLoadingComponent {}
