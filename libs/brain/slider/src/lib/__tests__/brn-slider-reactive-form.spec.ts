import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ReactiveFormSlider } from './brn-slider-states';

async function setupSlider() {
	const { fixture, getByTestId, container } = await render(ReactiveFormSlider);
	fixture.detectChanges();

	const thumb = container.querySelector('[role="slider"]') as HTMLElement;

	return {
		fixture,
		thumb,
		changeValueBtn: getByTestId('change-value-btn'),
		valueIndicatorPre: getByTestId('value-indicator-pre'),
	};
}

describe('Reactive Form Slider State', () => {
	it('should reflect correct initial values', async () => {
		const { thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('46');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});

	it('should update correctly when selecting a value within bounds', async () => {
		const { fixture, thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');

		fixture.componentInstance.changeValue(25);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 25');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('25');
	});

	it('should clamp thumb to min when selecting a value below min', async () => {
		const { fixture, thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');

		fixture.componentInstance.changeValue(-25);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: -25'); // Control value
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0'); // Clamped thumb
	});

	it('should clamp thumb to max when selecting a value above max', async () => {
		const { fixture, thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');

		fixture.componentInstance.changeValue(225);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 225'); // Control value
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100'); // Clamped thumb
	});

	it('should update via button click and clamp thumb accordingly', async () => {
		const { fixture, thumb, valueIndicatorPre, changeValueBtn } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');

		await userEvent.click(changeValueBtn);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 24');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('24');
	});
});
