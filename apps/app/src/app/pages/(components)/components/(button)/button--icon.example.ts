import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-icon',
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideCircleFadingArrowUp })],
	template: `
		<button hlmBtn variant="outline" size="icon">
			<ng-icon name="lucideCircleFadingArrowUp" />
		</button>
	`,
})
export class ButtonIcon {}
