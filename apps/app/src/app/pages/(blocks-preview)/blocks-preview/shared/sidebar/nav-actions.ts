import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucidePanelLeft, lucideStar } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-nav-actions',
	imports: [NgIcon, HlmButton],
	providers: [provideIcons({ lucidePanelLeft, lucideStar, lucideEllipsis })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex items-center gap-2',
	},
	template: `
		<button hlmBtn variant="ghost" size="icon-sm">
			<ng-icon name="lucideStar" class="size-4" />
			<span class="sr-only">Star</span>
		</button>
		<button hlmBtn variant="ghost" size="icon-sm">
			<ng-icon name="lucideEllipsis" class="size-4" />
			<span class="sr-only">More</span>
		</button>
	`,
})
export class NavActions {}
