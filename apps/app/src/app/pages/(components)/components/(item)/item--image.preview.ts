import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-image-preview',
	imports: [HlmItemImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<hlm-item-group>
			@for (song of _songs; track song.title) {
				<a hlmItem variant="outline" role="listitem" href="#">
					<hlm-item-media variant="image">
						<img
							[src]="'https://avatar.vercel.sh/' + song.title"
							[alt]="song.title"
							width="32"
							height="32"
							class="object-cover grayscale"
						/>
					</hlm-item-media>

					<hlm-item-content>
						<hlm-item-title class="line-clamp-1">
							{{ song.title }} -
							<span class="text-muted-foreground">{{ song.album }}</span>
						</hlm-item-title>
						<p hlmItemDescription>{{ song.artist }}</p>
					</hlm-item-content>

					<hlm-item-content class="flex-none text-center">
						<p hlmItemDescription>{{ song.duration }}</p>
					</hlm-item-content>
				</a>
			}
		</hlm-item-group>
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
