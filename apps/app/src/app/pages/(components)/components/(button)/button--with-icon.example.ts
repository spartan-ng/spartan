import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-with-icon',
	imports: [HlmButtonImports, NgIcon, HlmIconImports],
	providers: [provideIcons({ lucideGitBranch })],
	template: `
		<button hlmBtn variant="outline" size="sm">
			<ng-icon hlm size="sm" name="lucideGitBranch" />
			New Branch
		</button>
	`,
})
export class ButtonWithIcon {}
