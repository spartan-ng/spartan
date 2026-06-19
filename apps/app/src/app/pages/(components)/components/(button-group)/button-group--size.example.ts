import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';

@Component({
	selector: 'spartan-button-group-size',
	imports: [HlmButtonImports, HlmButtonGroupImports, NgIcon],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div class="flex flex-col items-start gap-8">
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="sm">Small</button>
				<button hlmBtn variant="outline" size="sm">Button</button>
				<button hlmBtn variant="outline" size="sm">Group</button>
				<button hlmBtn variant="outline" size="icon-sm">
					<ng-icon name="lucidePlus" />
				</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline">Default</button>
				<button hlmBtn variant="outline">Button</button>
				<button hlmBtn variant="outline">Group</button>
				<button hlmBtn variant="outline" size="icon">
					<ng-icon name="lucidePlus" />
				</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="lg">Large</button>
				<button hlmBtn variant="outline" size="lg">Button</button>
				<button hlmBtn variant="outline" size="lg">Group</button>
				<button hlmBtn variant="outline" size="icon-lg">
					<ng-icon name="lucidePlus" />
				</button>
			</div>
		</div>
	`,
})
export class ButtonGroupSize {}
