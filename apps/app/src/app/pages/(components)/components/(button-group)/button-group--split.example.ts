import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-group-split',
	imports: [HlmIconImports, HlmButtonImports, HlmButtonGroupImports],
	providers: [provideIcons({ lucidePlus })],
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
