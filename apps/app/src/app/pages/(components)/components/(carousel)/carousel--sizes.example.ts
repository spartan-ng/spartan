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
	selector: 'spartan-carousel-sizes',
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
	template: `
		<div class="flex w-full items-center justify-center p-4">
			<hlm-carousel class="w-full max-w-xs">
				<hlm-carousel-content>
					@for (item of items; track item) {
						<hlm-carousel-item class="md:basis-1/2 lg:basis-1/3">
							<div class="p-1">
								<section hlmCard>
									<p hlmCardContent class="flex aspect-square items-center justify-center p-6">
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
export class CarouselSizesComponent {
	public items = Array.from({ length: 5 }, (_, i) => i + 1);
}

export const sizesCode = `
import { Component } from '@angular/core';
import { HlmCarouselComponent, HlmCarouselFallbackDirective, HlmCarouselImageDirective } from '@spartan-ng/ui-carousel-helm';

@Component({
  selector: 'spartan-carousel-preview',
  standalone: true,
  imports: [HlmCarouselComponent, HlmCarouselContentComponent,HlmCarouselItemComponent,HlmCarouselNextComponent,HlmCarouselPreviousComponent],
  template: \`
  <div class="flex items-center justify-center w-full p-4">
    <hlm-carousel class="w-full max-w-xs">
      <hlm-carousel-content>
      @for (item of items; track item) {
        <hlm-carousel-item class="md:basis-1/2 lg:basis-1/3">
          <div class="p-1">
            <section hlmCard>
              <p hlmCardContent class="flex items-center justify-center p-6 aspect-square">
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
export class CarouselSizesComponent {
  items = Array.from({ length: 5}, (_, i) => i + 1);
}
`;
