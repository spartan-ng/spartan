import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';

@Component({
	selector: 'spartan-button-group-split',
	imports: [HlmButtonImports, HlmButtonGroupImports, NgIcon],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div hlmButtonGroup>
			<button hlmBtn variant="secondary">Button</button>
			<hlm-button-group-separator />
			<button hlmBtn variant="secondary" size="icon">
				<ng-icon name="lucidePlus" />
			</button>
		</div>
	`,
})
export class ButtonGroupSplit {}
