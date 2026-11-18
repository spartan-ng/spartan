import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render } from '@testing-library/angular';
import { HlmSelectImports } from '../../index';

@Component({
	selector: 'hlm-aria-invalid-host',
	imports: [ReactiveFormsModule, HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-select [formControl]="control">
			<hlm-select-trigger [aria-invalid]="override()">
				<hlm-select-value placeholder="Select a fruit" />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-item value="apple">Apple</hlm-select-item>
			</hlm-select-content>
		</hlm-select>
	`,
})
class AriaInvalidHost {
	public readonly control = new FormControl<string | null>(null, [Validators.required]);
	public readonly override = signal<boolean | undefined>(undefined);
}

describe('HlmSelect aria-invalid', () => {
	it('is not announced while the error state matcher does not report the error', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		const control = container.querySelector('hlm-select-trigger > button')!;

		expect(fixture.componentInstance.control.invalid).toBe(true);
		expect(control).not.toHaveAttribute('aria-invalid');
	});

	it('is announced once the error state matcher reports the error', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		fixture.componentInstance.control.markAsTouched();
		fixture.detectChanges();

		expect(container.querySelector('hlm-select-trigger > button')).toHaveAttribute('aria-invalid', 'true');
	});

	it('can be set by the consumer', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		fixture.componentInstance.override.set(true);
		fixture.detectChanges();

		expect(container.querySelector('hlm-select-trigger > button')).toHaveAttribute('aria-invalid', 'true');
	});

	it('keeps an explicit false from the consumer over the error state matcher', async () => {
		const { container, fixture } = await render(AriaInvalidHost);
		const control = container.querySelector('hlm-select-trigger > button')!;
		fixture.componentInstance.control.markAsTouched();
		fixture.componentInstance.override.set(false);
		fixture.detectChanges();

		expect(control).not.toHaveAttribute('aria-invalid');

		fixture.componentInstance.override.set(undefined);
		fixture.detectChanges();

		expect(control).toHaveAttribute('aria-invalid', 'true');
	});
});
