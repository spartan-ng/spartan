import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInbox } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-variants-preview',
	imports: [HlmItemImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideInbox })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<hlm-item>
			<hlm-item-media variant="icon">
				<ng-icon name="lucideInbox" />
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>Default Variant</hlm-item-title>
				<p hlmItemDescription>Transparent background with no border.</p>
			</hlm-item-content>
		</hlm-item>
		<hlm-item variant="outline">
			<hlm-item-media variant="icon">
				<ng-icon name="lucideInbox" />
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>Outline Variant</hlm-item-title>
				<p hlmItemDescription>Outlined style with a visible border.</p>
			</hlm-item-content>
		</hlm-item>
		<hlm-item variant="muted">
			<hlm-item-media variant="icon">
				<ng-icon name="lucideInbox" />
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>Muted Variant</hlm-item-title>
				<p hlmItemDescription>Muted background for secondary content.</p>
			</hlm-item-content>
		</hlm-item>
	`,
})
export class ItemVariantsPreview {}
