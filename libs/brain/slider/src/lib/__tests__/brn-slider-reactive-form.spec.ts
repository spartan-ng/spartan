import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ReactiveFormSlider } from './brn-slider-states';

async function setupSlider() {
	const { getByRole, getByTestId, fixture } = await render(ReactiveFormSlider);

	return {
		fixture,
		thumb: getByRole('slider'),
		changeValueBtn: getByTestId('change-value-btn'),
		valueIndicatorPre: getByTestId('value-indicator-pre'),
	};
}

describe('Reactive Form Slider State', () => {
	it('should reflect the correct value indicator and the related aria attributes when selecting a value between min and max', async () => {
		const { thumb, valueIndicatorPre, fixture } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('46');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

		fixture.componentInstance.changeValue(25);
		fixture.detectChanges();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 25');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('25');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});

	it('Should reflect the correct value indicator and the related aria attributes when selecting a value below min', async () => {
		const { thumb, valueIndicatorPre, fixture } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('46');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

		fixture.componentInstance.changeValue(-25);
		fixture.detectChanges();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});

	it('Should reflect the correct value indicator and the related aria attributes when selecting a value after max', async () => {
		const { fixture, thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('46');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

		//simulate slider dragging/selecting a value
		fixture.componentInstance.changeValue(225);
		fixture.detectChanges();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 100');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});

	it('Should reflect the correct value indicator and the related aria attributes when changing the slider value', async () => {
		const { thumb, fixture, changeValueBtn, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 46');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('46');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

		//simulate slider dragging/selecting a value
		fixture.componentInstance.changeValue(225);
		fixture.detectChanges();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 100');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

		//change slider value using a button
		await userEvent.click(changeValueBtn);

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 24');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('24');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});
});
