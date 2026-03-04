import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-size',
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideArrowUpRight })],
	template: `
		<div class="flex flex-col items-start gap-8 sm:flex-row">
			<div class="flex items-start gap-2">
				<button hlmBtn size="xs" variant="outline">Extra Small</button>
				<button hlmBtn size="icon-xs" variant="outline" aria-label="Submit">
					<ng-icon name="lucideArrowUpRight" />
				</button>
			</div>
			<div class="flex items-start gap-2">
				<button hlmBtn size="sm" variant="outline">Small</button>
				<button hlmBtn size="icon-sm" variant="outline" aria-label="Submit">
					<ng-icon name="lucideArrowUpRight" />
				</button>
			</div>
			<div class="flex items-start gap-2">
				<button hlmBtn variant="outline">Default</button>
				<button hlmBtn size="icon" variant="outline" aria-label="Submit">
					<ng-icon name="lucideArrowUpRight" />
				</button>
			</div>
			<div class="flex items-start gap-2">
				<button hlmBtn size="lg" variant="outline">Large</button>
				<button hlmBtn size="icon-lg" variant="outline" aria-label="Submit">
					<ng-icon name="lucideArrowUpRight" />
				</button>
			</div>
		</div>
	`,
})
export class ButtonSize {}
