import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-group-size',
	imports: [HlmIconImports, HlmButtonImports, HlmButtonGroupImports],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div class="flex flex-col items-start gap-8">
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="sm">Small</button>
				<button hlmBtn variant="outline" size="sm">Button</button>
				<button hlmBtn variant="outline" size="sm">Group</button>
				<button hlmBtn variant="outline" size="icon-sm">
					<ng-icon hlm name="lucidePlus" size="sm" />
				</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline">Default</button>
				<button hlmBtn variant="outline">Button</button>
				<button hlmBtn variant="outline">Group</button>
				<button hlmBtn variant="outline" size="icon">
					<ng-icon hlm name="lucidePlus" size="sm" />
				</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="lg">Large</button>
				<button hlmBtn variant="outline" size="lg">Button</button>
				<button hlmBtn variant="outline" size="lg">Group</button>
				<button hlmBtn variant="outline" size="icon-lg">
					<ng-icon hlm name="lucidePlus" size="sm" />
				</button>
			</div>
		</div>
	`,
})
export class ButtonGroupSize {}
