import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideExternalLink } from '@ng-icons/lucide';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-link-preview',
	imports: [HlmItemImports, NgIcon, RouterLink],
	providers: [provideIcons({ lucideChevronRight, lucideExternalLink })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<a hlmItem routerLink=".">
			<hlm-item-content>
				<hlm-item-title>Visit our documentation</hlm-item-title>
				<p hlmItemDescription>Learn how to get started with our components.</p>
			</hlm-item-content>
			<hlm-item-actions>
				<ng-icon name="lucideChevronRight" class="text-[calc(var(--spacing)*4)]" />
			</hlm-item-actions>
		</a>
		<a hlmItem variant="outline" href="#" target="_blank" rel="noopener noreferrer">
			<hlm-item-content>
				<hlm-item-title>External resource</hlm-item-title>
				<p hlmItemDescription>Opens in a new tab with security attributes.</p>
			</hlm-item-content>
			<hlm-item-actions>
				<ng-icon name="lucideExternalLink" class="text-[calc(var(--spacing)*4)]" />
			</hlm-item-actions>
		</a>
	`,
})
export class ItemLinkPreview {}
