import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldAlert } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-icon-preview',
	imports: [HlmItemImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideShieldAlert })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-lg flex-col gap-6',
	},
	template: `
		<hlm-item variant="outline">
			<hlm-item-media variant="icon">
				<ng-icon name="lucideShieldAlert" />
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>Security Alert</hlm-item-title>
				<p hlmItemDescription>New login detected from unknown device.</p>
			</hlm-item-content>
			<hlm-item-actions>
				<button hlmBtn size="sm" variant="outline">Review</button>
			</hlm-item-actions>
		</hlm-item>
	`,
})
export class ItemIconPreview {}
