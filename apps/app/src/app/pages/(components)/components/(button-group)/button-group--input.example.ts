import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';

import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-button-group-input',
	imports: [HlmButtonImports, HlmButtonGroupImports, HlmInputImports, NgIcon],
	providers: [provideIcons({ lucideSearch })],
	template: `
		<div hlmButtonGroup>
			<input hlmInput placeholder="Search..." />
			<button hlmBtn variant="outline">
				<ng-icon name="lucideSearch" />
			</button>
		</div>
	`,
})
export class ButtonGroupInput {}
