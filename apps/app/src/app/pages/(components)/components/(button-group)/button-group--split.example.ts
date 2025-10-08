import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroup, HlmButtonGroupSeparator } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-group-split',
	imports: [HlmIcon, NgIcon, HlmButton, HlmButtonGroup, HlmButtonGroupSeparator],
	providers: [
		provideIcons({
			lucidePlus,
		}),
	],
	template: `
		<div hlmButtonGroup>
			<button hlmBtn variant="secondary">Button</button>
			<hlm-button-group-separator />
			<button hlmBtn variant="secondary" size="icon">
				<ng-icon hlm name="lucidePlus" size="sm" />
			</button>
		</div>
	`,
})
export class ButtonGroupSplit {}
