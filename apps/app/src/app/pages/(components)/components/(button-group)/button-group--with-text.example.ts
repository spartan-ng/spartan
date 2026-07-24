import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';

import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-button-group-with-text',
	imports: [HlmButtonImports, HlmInputImports, HlmButtonGroupImports, NgIcon],
	providers: [provideIcons({ lucideCopy })],
	template: `
		<div hlmButtonGroup>
			<span hlmButtonGroupText>https://</span>
			<input hlmInput placeholder="Website url" class="z-10" />
			<button hlmBtn variant="outline" size="icon">
				<ng-icon name="lucideCopy" />
			</button>
		</div>
	`,
})
export class ButtonGroupWithText {}
