import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroup, HlmButtonGroupText } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-button-group-with-text',
	imports: [HlmIcon, NgIcon, HlmButton, HlmButtonGroup, HlmButtonGroupText, HlmInput],
	providers: [
		provideIcons({
			lucideCopy,
		}),
	],
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
