import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { STYLES } from '@spartan-ng/registry';

@Component({
	selector: 'spartan-styles-showcase',
	imports: [HlmButtonImports, HlmLabelImports, NgIcon],
	providers: [provideIcons({ lucideArrowUp })],
	host: {
		class: 'grid w-full sm:grid-cols-2 lg:grid-cols-3 gap-6',
	},
	template: `
		@for (s of _styles; track s) {
			<div [class]="'style-' + s + ' flex flex-col items-center gap-2 p-4'">
				<label hlmLabel class="capitalize">{{ s }}</label>
				<div class="flex items-center gap-2">
					<button hlmBtn variant="outline">Button</button>
					<button hlmBtn size="icon" variant="outline">
						<ng-icon name="lucideArrowUp" />
					</button>
				</div>
			</div>
		}
	`,
})
export class StylesShowcase {
	protected readonly _styles = STYLES;
}
