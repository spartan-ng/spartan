import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-rounded-preview',
	imports: [HlmButtonImports, NgIcon, HlmIcon],
	providers: [
		provideIcons({
			lucideArrowUp,
		}),
	],
	template: `
		<button hlmBtn variant="outline" size="icon" class="rounded-full"><ng-icon hlmIcon name="lucideArrowUp" /></button>
	`,
})
export class ButtonRoundedPreview {}
