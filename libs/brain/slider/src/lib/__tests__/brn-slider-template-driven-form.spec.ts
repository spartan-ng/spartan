import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TemplateDrivenFormSlider } from './brn-slider-states';

async function setupSlider() {
	const { fixture, getByRole, getByTestId } = await render(TemplateDrivenFormSlider);

	return {
		fixture,
		thumb: getByRole('slider'),
		changeValueBtn: getByTestId('change-value-btn'),
		valueIndicatorPre: getByTestId('value-indicator-pre'),
	};
}

async function setupSliderWithInitialValue(initialValue: number) {
	const { getByRole, getByTestId, fixture } = await render(TemplateDrivenFormSlider, {
		componentInputs: { temperature: initialValue },
	});

	return {
		fixture,
		thumb: getByRole('slider'),
		changeValueBtn: getByTestId('change-value-btn'),
		valueIndicatorPre: getByTestId('value-indicator-pre'),
	};
}

describe('Template Driven Form Slider State', () => {
	describe('Default Initial Value', () => {
		it('Should reflect the correct value indicator and the related aria attributes when selecting a value between min and max', async () => {
			const { thumb, fixture, valueIndicatorPre } = await setupSlider();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//simulate slider dragging/selecting a value
			fixture.componentInstance.changeValue(25);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 25');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('25');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});

		it('Should reflect the correct value indicator and the related aria attributes when selecting a value below min', async () => {
			const { thumb, valueIndicatorPre, fixture } = await setupSlider();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//simulate slider dragging/selecting a value
			fixture.componentInstance.changeValue(-25);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});

		it('Should reflect the correct value indicator and the related aria attributes when selecting a value after max', async () => {
			const { thumb, valueIndicatorPre, fixture } = await setupSlider();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//simulate slider dragging/selecting a value
			fixture.componentInstance.changeValue(225);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 100');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});

		it('Should reflect the correct value indicator and the related aria attributes when changing the slider value', async () => {
			const { fixture, thumb, changeValueBtn, valueIndicatorPre } = await setupSlider();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//simulate slider dragging/selecting a value
			fixture.componentInstance.changeValue(225);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 100');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//change slider value using a button
			await userEvent.click(changeValueBtn);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 24');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('24');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});
	});

	describe('With Initial Value', () => {
		it('Should reflect the correct value indicator and the related aria attributes when selecting a value between min and max', async () => {
			const { fixture, thumb, valueIndicatorPre } = await setupSliderWithInitialValue(12);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 12');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('12');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//simulate slider dragging/selecting a value
			fixture.componentInstance.changeValue(25);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 25');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('25');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});

		it('Should reflect the correct value indicator and the related aria attributes when selecting a value below min', async () => {
			const { fixture, thumb, valueIndicatorPre } = await setupSliderWithInitialValue(67);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 67');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('67');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//simulate slider dragging/selecting a value
			fixture.componentInstance.changeValue(-25);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});

		it('Should reflect the correct value indicator and the related aria attributes when selecting a value after max', async () => {
			const { fixture, thumb, valueIndicatorPre } = await setupSliderWithInitialValue(34);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 34');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('34');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//simulate slider dragging/selecting a value
			fixture.componentInstance.changeValue(225);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 100');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});

		it('Should reflect the correct value indicator and the related aria attributes when changing the slider value', async () => {
			const { fixture, thumb, changeValueBtn, valueIndicatorPre } = await setupSliderWithInitialValue(88);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 88');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('88');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//simulate slider dragging/selecting a value
			fixture.componentInstance.changeValue(225);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 100');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');

			//change slider value using a button
			await userEvent.click(changeValueBtn);

			fixture.detectChanges();

			expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 24');
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('24');
			expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
			expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
		});
	});
});
