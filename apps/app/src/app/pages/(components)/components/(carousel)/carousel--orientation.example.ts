import { Component } from '@angular/core';
import { HlmCardContentDirective, HlmCardDirective } from '@spartan-ng/ui-card-helm';
import {
	HlmCarouselComponent,
	HlmCarouselContentComponent,
	HlmCarouselItemComponent,
	HlmCarouselNextComponent,
	HlmCarouselPreviousComponent,
} from '@spartan-ng/ui-carousel-helm';

@Component({
	selector: 'spartan-carousel-orientation',
	standalone: true,
	imports: [
		HlmCarouselComponent,
		HlmCarouselContentComponent,
		HlmCarouselItemComponent,
		HlmCarouselNextComponent,
		HlmCarouselPreviousComponent,
		HlmCardDirective,
		HlmCardContentDirective,
	],
	host: {
		class: 'w-full',
	},
	template: `
		<div class="flex w-full items-center justify-center p-4">
			<hlm-carousel class="w-full max-w-xs" orientation="vertical">
				<hlm-carousel-content class="-mt-1 h-[200px]">
					@for (item of items; track item) {
						<hlm-carousel-item class="pt-1 md:basis-1/2">
							<div class="p-1">
								<section hlmCard>
									<p hlmCardContent class="flex items-center justify-center p-6">
										<span class="text-4xl font-semibold">{{ item }}</span>
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
export class CarouselOrientationComponent {
	public items = Array.from({ length: 5 }, (_, i) => i + 1);
}

export const orientationCode = `
import { Component } from '@angular/core';
import { HlmCarouselComponent, HlmCarouselFallbackDirective, HlmCarouselImageDirective } from '@spartan-ng/ui-carousel-helm';

@Component({
  selector: 'spartan-carousel-preview',
  standalone: true,
  imports: [HlmCarouselComponent, HlmCarouselContentComponent,HlmCarouselItemComponent,HlmCarouselNextComponent,HlmCarouselPreviousComponent],
	host: {
		class: 'w-full',
	},
  template: \`
  <div class="flex items-center justify-center w-full p-4">
    <hlm-carousel class="w-full max-w-xs" orientation="vertical">
      <hlm-carousel-content class="-mt-1 h-[200px]">
      @for (item of items; track item) {
        <hlm-carousel-item class="pt-1 md:basis-1/2">
          <div class="p-1">
            <section hlmCard>
              <p hlmCardContent class="flex items-center justify-center p-6">
                <span class="text-4xl font-semibold">{{ item }}</span>
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
  \`,
})
export class CarouselOrientationComponent {
  items = Array.from({ length: 5}, (_, i) => i + 1);
}
`;
