import { Component } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-image-preview',
	imports: [HlmItemImports],
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<div hlmItemGroup class="gap-4">
			@for (song of _songs; track song.title) {
				<a hlmItem variant="outline" role="listitem" href="#">
					<div hlmItemMedia variant="image">
						<img
							[src]="'https://avatar.vercel.sh/' + song.title"
							[alt]="song.title"
							width="32"
							height="32"
							class="object-cover grayscale"
						/>
					</div>

					<div hlmItemContent>
						<div hlmItemTitle class="line-clamp-1">
							{{ song.title }} -
							<span class="text-muted-foreground">{{ song.album }}</span>
						</div>
						<p hlmItemDescription>{{ song.artist }}</p>
					</div>

					<div hlmItemContent class="flex-none text-center">
						<p hlmItemDescription>{{ song.duration }}</p>
					</div>
				</a>
			}
		</div>
	`,
})
export class ItemImagePreview {
	protected readonly _songs = [
		{
			title: 'Midnight City Lights',
			artist: 'Neon Dreams',
			album: 'Electric Nights',
			duration: '3:45',
		},
		{
			title: 'Coffee Shop Conversations',
			artist: 'The Morning Brew',
			album: 'Urban Stories',
			duration: '4:05',
		},
		{
			title: 'Digital Rain',
			artist: 'Cyber Symphony',
			album: 'Binary Beats',
			duration: '3:30',
		},
	];
}
