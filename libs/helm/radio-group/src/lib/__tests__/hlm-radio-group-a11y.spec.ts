import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render } from '@testing-library/angular';
import { HlmRadioGroupImports } from '../../index';

@Component({
	selector: 'hlm-radio-group-a11y-host',
	imports: [ReactiveFormsModule, HlmRadioGroupImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-radio-group [formControl]="control" aria-describedby="plan-hint" [aria-invalid]="serverError">
			<hlm-radio value="free">Free</hlm-radio>
			<hlm-radio value="pro">Pro</hlm-radio>
		</hlm-radio-group>
		<p id="plan-hint">Pick a plan.</p>
	`,
})
class RadioGroupHost {
	public readonly control = new FormControl<string | null>(null, [Validators.required]);
	public serverError: boolean | undefined = undefined;
}

describe('HlmRadioGroup accessibility', () => {
	it('announces invalid only once the error state matcher reports it', async () => {
		const { container, fixture } = await render(RadioGroupHost);
		const group = container.querySelector('hlm-radio-group')!;

		expect(group).not.toHaveAttribute('aria-invalid');
		expect(group).toHaveAttribute('data-invalid', 'true');

		fixture.componentInstance.control.markAsTouched();
		fixture.detectChanges();
		expect(group).toHaveAttribute('aria-invalid', 'true');
	});

	it('lets the consumer override aria-invalid', async () => {
		const { container, fixture } = await render(RadioGroupHost);
		fixture.componentInstance.control.setValue('pro');
		fixture.componentInstance.serverError = true;
		fixture.changeDetectorRef.markForCheck();
		fixture.detectChanges();

		expect(container.querySelector('hlm-radio-group')).toHaveAttribute('aria-invalid', 'true');
	});

	it('keeps the consumer provided aria-describedby', async () => {
		const { container } = await render(RadioGroupHost);
		expect(container.querySelector('hlm-radio-group')).toHaveAttribute('aria-describedby', 'plan-hint');
	});
});
