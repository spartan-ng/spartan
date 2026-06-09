import { Directionality } from '@angular/cdk/bidi';
import { TestBed } from '@angular/core/testing';
import { render } from '@testing-library/angular';
import { HlmProgress } from './hlm-progress';
import { HlmProgressIndicator } from './hlm-progress-indicator';

describe('HlmProgressIndicator', () => {
	const setup = async (value: number) => {
		const result = await render(`<hlm-progress [value]="${value}"><hlm-progress-indicator /></hlm-progress>`, {
			imports: [HlmProgress, HlmProgressIndicator],
		});
		result.detectChanges();
		const indicator = result.container.querySelector('hlm-progress-indicator') as HTMLElement;
		return { ...result, indicator };
	};

	it('translates the indicator left by the unfilled remainder in LTR', async () => {
		const { indicator, detectChanges } = await setup(60);

		TestBed.inject(Directionality).valueSignal.set('ltr');
		detectChanges();

		expect(indicator.style.transform).toBe('translateX(-40%)');
	});

	it('flips the indicator translation in RTL so the bar fills from the inline-start', async () => {
		const { indicator, detectChanges } = await setup(60);

		TestBed.inject(Directionality).valueSignal.set('rtl');
		detectChanges();

		expect(indicator.style.transform).toBe('translateX(40%)');
	});
});
