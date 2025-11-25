import { Component } from '@angular/core';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
	selector: 'spartan-scroll-area-horizontal-preview',
	imports: [HlmScrollAreaImports, NgScrollbarModule],
	template: `
		<ng-scrollbar hlm class="w-96 rounded-md border whitespace-nowrap">
			<div class="flex w-max space-x-4 p-4">
				@for (artwork of _works; track artwork.artist) {
					<figure class="shrink-0">
						<div class="overflow-hidden rounded-md">
							<img
								[src]="artwork.art"
								[alt]="'Photo by ' + artwork.artist"
								class="aspect-[3/4] h-fit w-fit object-cover"
								width="{300}"
								height="{400}"
							/>
						</div>
						<figcaption class="text-muted-foreground pt-2 text-xs">
							Photo by
							<span class="text-foreground font-semibold">
								{{ artwork.artist }}
							</span>
						</figcaption>
					</figure>
				}
			</div>
		</ng-scrollbar>
	`,
})
export class ScrollAreaHorizontalPreview {
	protected readonly _works = [
		{
			artist: 'Ornella Binni',
			art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
		},
		{
			artist: 'Tom Byrom',
			art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
		},
		{
			artist: 'Vladimir Malyavko',
			art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
		},
	];
}
