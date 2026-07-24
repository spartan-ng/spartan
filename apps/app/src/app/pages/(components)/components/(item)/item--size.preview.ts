import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInbox } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-size-preview',
	imports: [HlmItemImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideInbox })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<hlm-item variant="outline">
			<hlm-item-media variant="icon">
				<ng-icon name="lucideInbox" />
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>Default Size</hlm-item-title>
				<p hlmItemDescription>The standard size for most use cases.</p>
			</hlm-item-content>
		</hlm-item>
		<hlm-item variant="outline" size="sm">
			<hlm-item-media variant="icon">
				<ng-icon name="lucideInbox" />
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>Small Size</hlm-item-title>
				<p hlmItemDescription>A compact size for dense layouts.</p>
			</hlm-item-content>
		</hlm-item>
		<hlm-item variant="outline" size="xs">
			<hlm-item-media variant="icon">
				<ng-icon name="lucideInbox" />
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>Extra Small Size</hlm-item-title>
				<p hlmItemDescription>The most compact size available.</p>
			</hlm-item-content>
		</hlm-item>
	`,
})
export class ItemSizePreview {}
