import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-size-preview',
	imports: [HlmItemImports, HlmButtonImports, HlmIconImports],
	providers: [
		provideIcons({
			lucideBadgeCheck,
			lucideChevronRight,
		}),
	],
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<div hlmItem variant="outline">
			<div hlmItemContent>
				<div hlmItemTitle>Basic Item</div>
				<p hlmItemDescription>A simple item with title and description.</p>
			</div>
			<div hlmItemActions>
				<button hlmBtn variant="outline" size="sm">Action</button>
			</div>
		</div>
		<a hlmItem variant="outline" size="sm" href="#">
			<div hlmItemMedia>
				<ng-icon hlm name="lucideBadgeCheck" size="20px" />
			</div>
			<div hlmItemContent>
				<div hlmItemTitle>Your profile has been verified.</div>
			</div>
			<div hlmItemActions>
				<ng-icon hlm name="lucideChevronRight" size="sm" />
			</div>
		</a>
	`,
})
export class ItemSizePreview {}
