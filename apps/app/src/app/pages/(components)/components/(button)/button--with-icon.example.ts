import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-with-icon',
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideGitBranch })],
	template: `
		<button hlmBtn variant="outline" size="sm">
			<ng-icon name="lucideGitBranch" />
			New Branch
		</button>
	`,
})
export class ButtonWithIcon {}
