import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-rounded-preview',
	imports: [HlmButtonImports, NgIcon],
	providers: [
		provideIcons({
			lucideArrowUp,
		}),
	],
	template: `
		<button hlmBtn variant="outline" size="icon" class="rounded-full"><ng-icon name="lucideArrowUp" /></button>
	`,
})
export class ButtonRoundedPreview {}
