import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-button-group-input',
	imports: [HlmIconImports, HlmButtonImports, HlmButtonGroupImports, HlmInputImports],
	providers: [provideIcons({ lucideSearch })],
	template: `
		<div hlmButtonGroup>
			<input hlmInput placeholder="Search..." />
			<button hlmBtn variant="outline">
				<ng-icon hlm name="lucideSearch" size="sm" />
			</button>
		</div>
	`,
})
export class ButtonGroupInput {}
