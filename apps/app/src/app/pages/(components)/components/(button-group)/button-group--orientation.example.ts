import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroup } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-group-orientation',
	imports: [NgIcon, HlmIcon, HlmButton, HlmButtonGroup],
	providers: [
		provideIcons({
			lucidePlus,
			lucideMinus,
		}),
	],
	template: `
		<div hlmButtonGroup orientation="vertical" class="mb-4">
			<button hlmBtn variant="outline" size="icon">
				<ng-icon hlm name="lucidePlus" size="sm" />
			</button>
			<button hlmBtn variant="outline" size="icon">
				<ng-icon hlm name="lucideMinus" size="sm" />
			</button>
		</div>
	`,
})
export class ButtonGroupOrientation {}
