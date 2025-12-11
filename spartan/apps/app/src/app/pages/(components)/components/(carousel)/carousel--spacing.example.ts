import { Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';

@Component({
	selector: 'spartan-carousel-spacing',
	imports: [HlmCarouselImports, HlmCardImports],
	template: `
		<div class="flex w-full items-center justify-center p-4">
			<hlm-carousel class="w-full max-w-sm">
				<hlm-carousel-content class="-ml-1">
					@for (item of items; track item) {
						<hlm-carousel-item class="pl-1 md:basis-1/2 lg:basis-1/3">
							<div class="p-1">
								<section hlmCard>
									<p hlmCardContent class="flex aspect-square items-center justify-center p-6">
										<span class="text-2xl font-semibold">{{ item }}</span>
									</p>
								</section>
							</div>
						</hlm-carousel-item>
					}
				</hlm-carousel-content>
				<button hlm-carousel-previous></button>
				<button hlm-carousel-next></button>
			</hlm-carousel>
		</div>
	`,
})
export class CarouselSpacing {
	public items = Array.from({ length: 5 }, (_, i) => i + 1);
}
