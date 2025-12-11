import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-group-orientation',
	imports: [HlmIconImports, HlmButtonImports, HlmButtonGroupImports],
	providers: [provideIcons({ lucidePlus, lucideMinus })],
	template: `
		<div hlmButtonGroup orientation="vertical" aria-label="Media controls" class="h-fit">
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
