import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render } from '@testing-library/angular';
import { HlmDatePickerImports } from '../../index';

@Component({
	selector: 'hlm-date-picker-input-a11y-host',
	imports: [ReactiveFormsModule, HlmDatePickerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-date-picker [formControl]="control">
			<hlm-date-picker-input
				aria-label="Departure date"
				aria-labelledby="departure-label"
				aria-describedby="departure-hint"
				[aria-invalid]="serverError"
			/>
		</hlm-date-picker>
	`,
})
class DatePickerInputHost {
	public readonly control = new FormControl<Date | null>(null, [Validators.required]);
	public serverError: boolean | undefined = undefined;
}

describe('HlmDatePickerInput accessibility', () => {
	it('forwards ARIA attributes to the inner input instead of the host', async () => {
		const { container } = await render(DatePickerInputHost);
		const host = container.querySelector('hlm-date-picker-input')!;
		const input = host.querySelector('input')!;

		expect(input).toHaveAttribute('aria-label', 'Departure date');
		expect(input).toHaveAttribute('aria-labelledby', 'departure-label');
		expect(input).toHaveAttribute('aria-describedby', 'departure-hint');

		for (const attr of ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid']) {
			expect(host).not.toHaveAttribute(attr);
		}
	});

	it('announces invalid only once the error state matcher reports it', async () => {
		const { container, fixture } = await render(DatePickerInputHost);
		const input = container.querySelector('hlm-date-picker-input input')!;

		expect(input).not.toHaveAttribute('aria-invalid');

		fixture.componentInstance.control.markAsTouched();
		fixture.detectChanges();
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('lets the consumer override aria-invalid', async () => {
		const { container, fixture } = await render(DatePickerInputHost);
		fixture.componentInstance.control.setValue(new Date(2026, 0, 1));
		fixture.componentInstance.serverError = true;
		fixture.changeDetectorRef.markForCheck();
		fixture.detectChanges();

		expect(container.querySelector('hlm-date-picker-input input')).toHaveAttribute('aria-invalid', 'true');
	});
});
