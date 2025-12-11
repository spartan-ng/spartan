import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCopy } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-button-group-with-text',
	imports: [HlmIconImports, HlmButtonImports, HlmInputImports, HlmButtonGroupImports],
	providers: [provideIcons({ lucideCopy })],
	template: `
		<div hlmButtonGroup>
			<span hlmButtonGroupText>https://</span>
			<input hlmInput placeholder="Website url" class="z-10" />
			<button hlmBtn variant="outline" size="icon">
				<ng-icon hlm name="lucideCopy" size="sm" />
			</button>
		</div>
	`,
})
export class ButtonGroupWithText {}
