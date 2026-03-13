import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-icon',
	imports: [HlmButtonImports, NgIcon, HlmIconImports],
	providers: [provideIcons({ lucideCircleFadingArrowUp })],
	template: `
		<button hlmBtn size="icon" variant="outline">
			<ng-icon name="lucideCircleFadingArrowUp" />
		</button>
	`,
})
export class ButtonIcon {}
