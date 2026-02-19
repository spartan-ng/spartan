import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-size-preview',
	imports: [HlmButtonImports, NgIcon],
	providers: [
		provideIcons({
			lucideArrowUpRight,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col items-start gap-8 sm:flex-row',
	},
	template: `
		<div class="flex items-start gap-2">
			<button hlmBtn size="xs" variant="outline">Extra Small</button>
			<button hlmBtn size="icon-xs" aria-label="Submit" variant="outline">
				<ng-icon name="lucideArrowUpRight" />
			</button>
		</div>
		<div class="flex items-start gap-2">
			<button hlmBtn size="sm" variant="outline">Small</button>
			<button hlmBtn size="icon-sm" aria-label="Submit" variant="outline">
				<ng-icon name="lucideArrowUpRight" />
			</button>
		</div>
		<div class="flex items-start gap-2">
			<button hlmBtn variant="outline">Default</button>
			<button hlmBtn size="icon" aria-label="Submit" variant="outline">
				<ng-icon name="lucideArrowUpRight" />
			</button>
		</div>
		<div class="flex items-start gap-2">
			<button hlmBtn variant="outline" size="lg">Large</button>
			<button hlmBtn size="icon-lg" aria-label="Submit" variant="outline">
				<ng-icon name="lucideArrowUpRight" />
			</button>
		</div>
	`,
})
export class buttonSizePreview {}
