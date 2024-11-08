import { Component } from '@angular/core';
import { render } from '@testing-library/angular';
import { BrnProgressIndicatorComponent } from './brn-progress-indicator.component';
import { BrnProgressComponent, BrnProgressLabelFn } from './brn-progress.component';

@Component({
	template: `
    <brn-progress [value]="value" [max]="max" [getValueLabel]="getValueLabel">
      <brn-progress-indicator />
    </brn-progress>
  `,
})
class TestHostComponent {
	value: number | null | undefined = 0;
	max = 100;
	getValueLabel: BrnProgressLabelFn = (value, max) => `${Math.round((value / max) * 100)}%`;
}

describe('BrnProgressComponent', () => {
	it('should initialize with default values and set aria attributes', async () => {
		const { container } = await render(TestHostComponent, {
			imports: [BrnProgressComponent, BrnProgressIndicatorComponent],
		});
		const progressBar = container.querySelector('brn-progress');

		expect(progressBar?.getAttribute('aria-valuemax')).toBe('100');
		expect(progressBar?.getAttribute('aria-valuemin')).toBe('0');
		expect(progressBar?.getAttribute('aria-valuenow')).toBe('0');
		expect(progressBar?.getAttribute('aria-valuetext')).toBe('0%');
	});

	it('should display "indeterminate" state when value is null or undefined', async () => {
		const { fixture, container } = await render(TestHostComponent, {
			imports: [BrnProgressComponent, BrnProgressIndicatorComponent],
			componentProperties: { value: null },
		});
		fixture.detectChanges();

		const progressBar = container.querySelector('brn-progress');
		expect(progressBar?.getAttribute('data-state')).toBe('indeterminate');
		expect(progressBar?.getAttribute('aria-valuetext')).toBe(null);
	});

	it('should set aria attributes based on provided value and max', async () => {
		const { fixture, container } = await render(TestHostComponent, {
			imports: [BrnProgressComponent, BrnProgressIndicatorComponent],
			componentProperties: { value: 50, max: 200 },
		});
		fixture.detectChanges();

		const progressBar = container.querySelector('brn-progress');
		expect(progressBar?.getAttribute('aria-valuenow')).toBe('50');
		expect(progressBar?.getAttribute('aria-valuemax')).toBe('200');
		expect(progressBar?.getAttribute('aria-valuetext')).toBe('25%');
	});

	it('should set state to "complete" when value equals max', async () => {
		const { fixture, container } = await render(TestHostComponent, {
			imports: [BrnProgressComponent, BrnProgressIndicatorComponent],
			componentProperties: { value: 100, max: 100 },
		});
		fixture.detectChanges();

		const progressBar = container.querySelector('brn-progress');
		expect(progressBar?.getAttribute('data-state')).toBe('complete');
	});

	it('should set state to "loading" when value is within bounds and not equal to max', async () => {
		const { fixture, container } = await render(TestHostComponent, {
			imports: [BrnProgressComponent, BrnProgressIndicatorComponent],
			componentProperties: { value: 50, max: 100 },
		});
		fixture.detectChanges();

		const progressBar = container.querySelector('brn-progress');
		expect(progressBar?.getAttribute('data-state')).toBe('loading');
	});

	it('should throw an error if value is out of bounds', async () => {
		const { fixture } = await render(TestHostComponent, {
			imports: [BrnProgressComponent, BrnProgressIndicatorComponent],
		});

		expect(() => {
			fixture.componentInstance.value = 150;
			fixture.detectChanges();
		}).toThrow('Value must be 0 or greater and less or equal to max');

		expect(() => {
			fixture.componentInstance.value = -10;
			fixture.detectChanges();
		}).toThrow('Value must be 0 or greater and less or equal to max');
	});

	it('should throw an error if max is set to a negative number', async () => {
		const { fixture } = await render(TestHostComponent, {
			imports: [BrnProgressComponent, BrnProgressIndicatorComponent],
		});

		expect(() => {
			fixture.componentInstance.max = -50;
			fixture.detectChanges();
		}).toThrow('Value must be 0 or greater and less or equal to max');
	});

	it('should reflect state, value, and max in BrnProgressIndicatorComponent', async () => {
		const { fixture, container } = await render(TestHostComponent, {
			imports: [BrnProgressComponent, BrnProgressIndicatorComponent],
			componentProperties: { value: 30, max: 100 },
		});
		fixture.detectChanges();

		const indicator = container.querySelector('brn-progress-indicator');
		expect(indicator?.getAttribute('data-state')).toBe('loading');
		expect(indicator?.getAttribute('data-value')).toBe('30');
		expect(indicator?.getAttribute('data-max')).toBe('100');
	});
});
