import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-variants-preview',
	imports: [HlmItemImports, HlmButtonImports],
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<div hlmItem>
			<div hlmItemContent>
				<div hlmItemTitle>Default Variant</div>
				<p hlmItemDescription>Standard styling with subtle background and borders.</p>
			</div>
			<div hlmItemActions>
				<button hlmBtn variant="outline" size="sm">Open</button>
			</div>
		</div>
		<div hlmItem variant="outline">
			<div hlmItemContent>
				<div hlmItemTitle>Outline Variant</div>
				<p hlmItemDescription>Outlined style with clear borders and transparent background.</p>
			</div>
			<div hlmItemActions>
				<button hlmBtn variant="outline" size="sm">Open</button>
			</div>
		</div>
		<div hlmItem variant="muted">
			<div hlmItemContent>
				<div hlmItemTitle>Muted Variant</div>
				<p hlmItemDescription>Subdued appearance with muted colors for secondary content.</p>
			</div>
			<div hlmItemActions>
				<button hlmBtn variant="outline" size="sm">Open</button>
			</div>
		</div>
	`,
})
export class ItemVariantsPreview {}
