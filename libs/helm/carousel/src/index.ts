import { NgModule } from '@angular/core';
import { HlmCarouselContentComponent } from './lib/hlm-carousel-content.component';
import { HlmCarouselItemComponent } from './lib/hlm-carousel-item.component';
import { HlmCarouselNextComponent } from './lib/hlm-carousel-next.component';
import { HlmCarouselPreviousComponent } from './lib/hlm-carousel-previous.component';
import { HlmCarouselSlideDisplayComponent } from './lib/hlm-carousel-slide-display.component';
import { HlmCarouselComponent } from './lib/hlm-carousel.component';

export * from './lib/hlm-carousel-content.component';
export * from './lib/hlm-carousel-item.component';
export * from './lib/hlm-carousel-next.component';
export * from './lib/hlm-carousel-previous.component';
export * from './lib/hlm-carousel-slide-display.component';
export * from './lib/hlm-carousel.component';

export const HlmCarouselImports = [
	HlmCarouselComponent,
	HlmCarouselContentComponent,
	HlmCarouselItemComponent,
	HlmCarouselPreviousComponent,
	HlmCarouselNextComponent,
	HlmCarouselSlideDisplayComponent,
] as const;

@NgModule({
	imports: [...HlmCarouselImports],
	exports: [...HlmCarouselImports],
})
export class HlmCarouselModule {}
