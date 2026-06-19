import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';

@Component({
	selector: 'spartan-button-group-orientation',
	imports: [HlmButtonImports, HlmButtonGroupImports, NgIcon],
	providers: [provideIcons({ lucidePlus, lucideMinus })],
	template: `
		<div hlmButtonGroup orientation="vertical" aria-label="Media controls" class="h-fit">
			<button hlmBtn variant="outline" size="icon">
				<ng-icon name="lucidePlus" />
			</button>
			<button hlmBtn variant="outline" size="icon">
				<ng-icon name="lucideMinus" />
			</button>
		</div>
	`,
})
export class ButtonGroupOrientation {}
