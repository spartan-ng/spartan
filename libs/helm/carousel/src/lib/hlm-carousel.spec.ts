import { Directionality } from '@angular/cdk/bidi';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { HlmCarousel } from './hlm-carousel';
import { HlmCarouselContent } from './hlm-carousel-content';

describe('HlmCarousel RTL direction', () => {
	const setup = async () => {
		const view = await render(`<hlm-carousel><hlm-carousel-content /></hlm-carousel>`, {
			imports: [HlmCarousel, HlmCarouselContent],
		});
		view.detectChanges();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const carousel = view.fixture.debugElement.query(By.directive(HlmCarousel)).componentInstance as any;
		return { ...view, carousel };
	};

	it('defaults embla direction to ltr', async () => {
		const { carousel } = await setup();
		expect(carousel._emblaOptions().direction).toBe('ltr');
	});

	it('follows the ambient layout direction (rtl) so the carousel scrolls right-to-left', async () => {
		const { carousel, detectChanges } = await setup();

		TestBed.inject(Directionality).valueSignal.set('rtl');
		detectChanges();

		expect(carousel._emblaOptions().direction).toBe('rtl');
	});
});
