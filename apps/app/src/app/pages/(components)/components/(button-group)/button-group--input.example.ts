import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroup } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-button-group-input',
	imports: [HlmIcon, NgIcon, HlmButton, HlmButtonGroup, HlmInput],
	providers: [
		provideIcons({
			lucideSearch,
		}),
	],
	template: `
		<div hlmButtonGroup>
			<input hlmInput placeholder="Search..." class="z-10" />
			<button hlmBtn variant="outline">
				<ng-icon hlm name="lucideSearch" size="sm" />
			</button>
		</div>
	`,
})
export class ButtonGroupInput {}
