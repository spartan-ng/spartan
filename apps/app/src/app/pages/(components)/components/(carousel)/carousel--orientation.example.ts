import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';

@Component({
	selector: 'spartan-carousel-orientation',
	imports: [HlmCarouselImports, HlmCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'flex w-full items-center justify-center p-4' },
	template: `
		<hlm-carousel class="w-full max-w-xs" orientation="vertical">
			<hlm-carousel-content class="-mt-1 h-[270px]">
				@for (item of items; track item) {
					<hlm-carousel-item class="basis-1/2 pt-1">
						<div class="p-1">
							<section hlmCard>
								<p hlmCardContent class="flex items-center justify-center p-6">
									<span class="text-3xl font-semibold">{{ item }}</span>
								</p>
							</section>
						</div>
					</hlm-carousel-item>
				}
			</hlm-carousel-content>
			<button hlm-carousel-previous></button>
			<button hlm-carousel-next></button>
		</hlm-carousel>
	`,
})
export class CarouselOrientation {
	public items = Array.from({ length: 5 }, (_, i) => i + 1);
}
