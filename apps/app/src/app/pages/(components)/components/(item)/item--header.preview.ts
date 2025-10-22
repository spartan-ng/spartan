import { Component } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-header-preview',
	imports: [HlmItemImports],
	host: {
		class: 'flex w-full max-w-xl flex-col gap-6',
	},
	template: `
		<div hlmItemGroup class="grid grid-cols-3 gap-4">
			@for (model of _models; track model.name) {
				<div hlmItem variant="outline">
					<div hlmItemHeader>
						<img
							[src]="model.image"
							[alt]="model.name"
							width="128"
							height="128"
							class="aspect-square w-full rounded-sm object-cover"
						/>
					</div>
					<div hlmItemContent>
						<div hlmItemTitle>{{ model.name }}</div>
						<p hlmItemDescription>{{ model.description }}</p>
					</div>
				</div>
			}
		</div>
	`,
})
export class ItemHeaderPreview {
	protected readonly _models = [
		{
			name: 'v0-1.5-sm',
			description: 'Everyday tasks and UI generation.',
			image: 'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
		},
		{
			name: 'v0-1.5-lg',
			description: 'Advanced thinking or reasoning.',
			image: 'https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop',
		},
		{
			name: 'v0-2.0-mini',
			description: 'Open Source model for everyone.',
			image: 'https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop',
		},
	];
}
