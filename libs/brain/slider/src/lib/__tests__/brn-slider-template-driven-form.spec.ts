import { render, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TemplateDrivenFormSlider } from './brn-slider-states';

async function setupSlider(initialValue?: number) {
	const { fixture, getByTestId, container } = await render(TemplateDrivenFormSlider, {
		componentInputs: initialValue !== undefined ? { temperature: [initialValue] } : {},
	});
	fixture.detectChanges();

	const thumb = container.querySelector('[role="slider"]') as HTMLElement;

	return {
		fixture,
		thumb,
		changeValueBtn: getByTestId('change-value-btn'),
		valueIndicatorPre: getByTestId('value-indicator-pre'),
	};
}

describe('Template Driven Form Slider State', () => {
	it('should default to 0 when no initial value is provided', async () => {
		const { thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});

	it('should handle initial value within bounds', async () => {
		const { thumb, valueIndicatorPre } = await setupSlider(12);

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 12');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('12');
		expect(thumb.getAttribute('aria-valuemin')?.trim()).toBe('0');
		expect(thumb.getAttribute('aria-valuemax')?.trim()).toBe('100');
	});

	it('should clamp thumb if initial value is below min', async () => {
		const { thumb, valueIndicatorPre } = await setupSlider(-25);

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: -25'); // Control value
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0'); // Clamped thumb
	});

	it('should clamp thumb if initial value is above max', async () => {
		const { thumb, valueIndicatorPre } = await setupSlider(225);

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 225'); // Control value
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100'); // Clamped thumb
	});

	it('should update correctly when selecting a value within bounds', async () => {
		const { fixture, thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');

		fixture.componentInstance.changeValue(25);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 25');
		await waitFor(() => {
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('25');
		});
	});

	it('should clamp thumb to min when selecting a value below min', async () => {
		const { fixture, thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');

		fixture.componentInstance.changeValue(-25);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: -25'); // Control value
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0'); // Clamped thumb
	});

	it('should clamp thumb to max when selecting a value above max', async () => {
		const { fixture, thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');

		fixture.componentInstance.changeValue(225);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 225'); // Control value
		await waitFor(() => {
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100'); // Clamped thumb
		});
	});

	it('should update via button click and clamp thumb accordingly', async () => {
		const { fixture, thumb, valueIndicatorPre, changeValueBtn } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');

		await userEvent.click(changeValueBtn);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 24');
		expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('24');
	});

	it('should correctly handle value exactly at min (0)', async () => {
		const { fixture, thumb, valueIndicatorPre } = await setupSlider(50);

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 50');

		fixture.componentInstance.changeValue(0);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');
		await waitFor(() => {
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('0');
		});
	});

	it('should correctly handle value exactly at max (100)', async () => {
		const { fixture, thumb, valueIndicatorPre } = await setupSlider();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 0');

		fixture.componentInstance.changeValue(100);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(valueIndicatorPre.textContent?.trim()).toBe('Temperature: 100');
		await waitFor(() => {
			expect(thumb.getAttribute('aria-valuenow')?.trim()).toBe('100');
		});
	});
});
