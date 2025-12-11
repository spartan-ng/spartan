import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideShieldAlert } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-icon-preview',
	imports: [HlmItemImports, HlmButtonImports, HlmIconImports],
	providers: [
		provideIcons({
			lucideShieldAlert,
		}),
	],
	host: {
		class: 'flex w-full max-w-lg flex-col gap-6',
	},
	template: `
		<div hlmItem variant="outline">
			<div hlmItemMedia variant="icon">
				<ng-icon hlm name="lucideShieldAlert" size="sm" />
			</div>
			<div hlmItemContent>
				<div hlmItemTitle>Security Alert</div>
				<p hlmItemDescription>New login detected from unknown device.</p>
			</div>
			<div hlmItemActions>
				<button hlmBtn size="sm" variant="outline">Review</button>
			</div>
		</div>
	`,
})
export class ItemIconPreview {}
