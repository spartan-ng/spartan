import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render } from '@testing-library/angular';
import { HlmComboboxImports } from '../../index';

@Component({
	selector: 'hlm-aria-invalid-host',
	imports: [ReactiveFormsModule, HlmComboboxImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox [formControl]="control">
			<hlm-combobox-input placeholder="Select a framework" [aria-invalid]="override()" />
			<hlm-combobox-content *hlmComboboxPortal>
				<div hlmComboboxList>
					<hlm-combobox-item value="angular">Angular</hlm-combobox-item>
				</div>
			</hlm-combobox-content>
		</hlm-combobox>
	`,
})
class AriaInvalidHost {
	public readonly control = new FormControl<string | null>(null, [Validators.required]);
	public readonly override = signal<boolean | undefined>(undefined);
}

describe('HlmCombobox aria-invalid', () => {
	it('is not announced while the error state matcher does not report the error', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		const control = container.querySelector('hlm-combobox-input input')!;

		expect(fixture.componentInstance.control.invalid).toBe(true);
		expect(control).not.toHaveAttribute('aria-invalid');
		expect(control).toHaveAttribute('data-invalid', 'true');
	});

	it('is announced once the error state matcher reports the error', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		fixture.componentInstance.control.markAsTouched();
		fixture.detectChanges();

		expect(container.querySelector('hlm-combobox-input input')).toHaveAttribute('aria-invalid', 'true');
	});

	it('can be set by the consumer', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		fixture.componentInstance.override.set(true);
		fixture.detectChanges();

		expect(container.querySelector('hlm-combobox-input input')).toHaveAttribute('aria-invalid', 'true');
	});

	it('keeps an explicit false from the consumer over the error state matcher', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		const control = container.querySelector('hlm-combobox-input input')!;
		fixture.componentInstance.control.markAsTouched();
		fixture.componentInstance.override.set(false);
		fixture.detectChanges();

		expect(control).not.toHaveAttribute('aria-invalid');
		expect(control).toHaveAttribute('data-invalid', 'true');

		fixture.componentInstance.override.set(undefined);
		fixture.detectChanges();

		expect(control).toHaveAttribute('aria-invalid', 'true');
	});
});
