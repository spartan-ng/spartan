import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideExternalLink } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-link-preview',
	imports: [HlmItemImports, HlmIconImports],
	providers: [
		provideIcons({
			lucideChevronRight,
			lucideExternalLink,
		}),
	],
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<a hlmItem href="#">
			<div hlmItemContent>
				<div hlmItemTitle>Visit our documentation</div>
				<p hlmItemDescription>Learn how to get started with our components.</p>
			</div>
			<div hlmItemActions>
				<ng-icon hlm name="lucideChevronRight" size="sm" />
			</div>
		</a>
		<a hlmItem variant="outline" href="#" target="_blank" rel="noopener noreferrer">
			<div hlmItemContent>
				<div hlmItemTitle>External resource</div>
				<p hlmItemDescription>Opens in a new tab with security attributes.</p>
			</div>
			<div hlmItemActions>
				<ng-icon hlm name="lucideExternalLink" size="sm" />
			</div>
		</a>
	`,
})
export class ItemLinkPreview {}
