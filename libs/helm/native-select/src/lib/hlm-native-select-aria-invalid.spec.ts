import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render } from '@testing-library/angular';
import { HlmNativeSelectImports } from '../index';

@Component({
	selector: 'hlm-aria-invalid-host',
	imports: [ReactiveFormsModule, HlmNativeSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-native-select [formControl]="control" [aria-invalid]="override()">
			<option hlmNativeSelectOption value="">Pick a fruit</option>
			<option hlmNativeSelectOption value="apple">Apple</option>
		</hlm-native-select>
	`,
})
class AriaInvalidHost {
	public readonly control = new FormControl<string | null>(null, [Validators.required]);
	public readonly override = signal<boolean | undefined>(undefined);
}

describe('HlmNativeSelect aria-invalid', () => {
	it('is not announced while the error state matcher does not report the error', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		const control = container.querySelector('select')!;

		expect(fixture.componentInstance.control.invalid).toBe(true);
		expect(control).not.toHaveAttribute('aria-invalid');
		expect(control).toHaveAttribute('data-invalid', 'true');
	});

	it('is announced once the error state matcher reports the error', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		fixture.componentInstance.control.markAsTouched();
		fixture.detectChanges();

		expect(container.querySelector('select')).toHaveAttribute('aria-invalid', 'true');
	});

	it('can be set by the consumer', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		fixture.componentInstance.override.set(true);
		fixture.detectChanges();

		expect(container.querySelector('select')).toHaveAttribute('aria-invalid', 'true');
	});

	it('keeps an explicit false from the consumer over the error state matcher', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		const control = container.querySelector('select')!;
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
