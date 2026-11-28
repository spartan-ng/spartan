import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { HlmInputOtpImports } from '../index';

@Component({
	selector: 'hlm-input-otp-form-host',
	imports: [ReactiveFormsModule, HlmInputOtpImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<hlm-input-otp formControlName="otp" length="6">
				<hlm-input-otp-group>
					<hlm-input-otp-slot index="0" />
					<hlm-input-otp-slot index="1" />
					<hlm-input-otp-slot index="2" />
				</hlm-input-otp-group>
				<hlm-input-otp-separator />
				<hlm-input-otp-group>
					<hlm-input-otp-slot index="3" />
					<hlm-input-otp-slot index="4" />
					<hlm-input-otp-slot index="5" />
				</hlm-input-otp-group>
			</hlm-input-otp>
		</form>
	`,
})
class HlmInputOtpFormHost {
	public readonly form = new FormGroup({
		otp: new FormControl(''),
	});
}

@Component({
	selector: 'hlm-input-otp-field-host',
	imports: [ReactiveFormsModule, HlmInputOtpImports, HlmFieldImports],
	providers: [provideErrorStateMatcher(ShowOnDirtyErrorStateMatcher)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmField>
			<hlm-input-otp [formControl]="control" length="6" aria-describedby="otp-hint" />
			<p id="otp-hint">Check your messages.</p>
			<p hlmFieldDescription>Enter the six-digit code.</p>
			@if (control.dirty && control.invalid) {
				<hlm-field-error>The code is required.</hlm-field-error>
			}
		</div>
	`,
})
class HlmInputOtpFieldHost {
	public readonly control = new FormControl('', Validators.required);
}

describe('HlmInputOtp', () => {
	const setup = async () => {
		const result = await render(
			`<hlm-input-otp length="6">
				<hlm-input-otp-group>
					<hlm-input-otp-slot index="0" />
					<hlm-input-otp-slot index="1" />
					<hlm-input-otp-slot index="2" />
				</hlm-input-otp-group>
				<hlm-input-otp-separator />
				<hlm-input-otp-group>
					<hlm-input-otp-slot index="3" />
					<hlm-input-otp-slot index="4" />
					<hlm-input-otp-slot index="5" />
				</hlm-input-otp-group>
			</hlm-input-otp>`,
			{ imports: [HlmInputOtpImports] },
		);

		const input = result.container.querySelector('input[data-slot="input-otp"]') as HTMLInputElement;

		return { ...result, input, user: userEvent.setup() };
	};

	it('renders a hidden input and six slots', async () => {
		const { container, input } = await setup();

		expect(input).toBeInTheDocument();
		expect(container.querySelectorAll('brn-input-otp-slot')).toHaveLength(6);
	});

	it('renders typed characters in the slots', async () => {
		const { container, input, user } = await setup();

		await user.click(input);
		await user.keyboard('123456');

		expect(input.value).toBe('123456');
		expect(container.querySelectorAll('brn-input-otp-slot')[0]).toHaveTextContent('1');
		expect(container.querySelectorAll('brn-input-otp-slot')[5]).toHaveTextContent('6');
	});

	it('applies the default input classes and merges custom classes', async () => {
		const { container } = await render(
			`<hlm-input-otp length="6" inputClass="custom-class">
				<hlm-input-otp-slot index="0" />
			</hlm-input-otp>`,
			{ imports: [HlmInputOtpImports] },
		);

		const input = container.querySelector('input[data-slot="input-otp"]') as HTMLInputElement;

		expect(input).toHaveClass('disabled:cursor-not-allowed');
		expect(input).toHaveClass('custom-class');
	});

	it('masks filled slots and supports a custom mask character', async () => {
		const { container } = await render(
			`<hlm-input-otp mask maskChar="*" value="123456" length="6">
				<hlm-input-otp-group>
					<hlm-input-otp-slot index="0" />
					<hlm-input-otp-slot index="1" />
					<hlm-input-otp-slot index="2" />
				</hlm-input-otp-group>
				<hlm-input-otp-separator />
				<hlm-input-otp-group>
					<hlm-input-otp-slot index="3" />
					<hlm-input-otp-slot index="4" />
					<hlm-input-otp-slot index="5" />
				</hlm-input-otp-group>
			</hlm-input-otp>`,
			{ imports: [HlmInputOtpImports] },
		);

		const input = container.querySelector('input[data-slot="input-otp"]') as HTMLInputElement;
		const slots = container.querySelectorAll('brn-input-otp-slot');

		expect(input.value).toBe('123456');
		expect(slots[0]).toHaveTextContent('*');
		expect(slots[5]).toHaveTextContent('*');
	});

	it('filters characters using the slotPattern input', async () => {
		const { container } = await render(
			`<hlm-input-otp slotPattern="[0-9]" length="6">
				<hlm-input-otp-group>
					<hlm-input-otp-slot index="0" />
					<hlm-input-otp-slot index="1" />
					<hlm-input-otp-slot index="2" />
				</hlm-input-otp-group>
			</hlm-input-otp>`,
			{ imports: [HlmInputOtpImports] },
		);

		const input = container.querySelector('input[data-slot="input-otp"]') as HTMLInputElement;
		const user = userEvent.setup();

		await user.click(input);
		await user.keyboard('1a2b3');

		expect(input.value).toBe('123');
	});

	it('supports reactive forms on the hlm root', async () => {
		const { container, fixture } = await render(HlmInputOtpFormHost);
		const host = fixture.componentInstance;
		const input = container.querySelector('input[data-slot="input-otp"]') as HTMLInputElement;
		const user = userEvent.setup();

		await user.click(input);
		await user.keyboard('123456');
		fixture.detectChanges();

		expect(host.form.value.otp).toBe('123456');
	});

	it('announces invalidity on the input only when the error state matcher reports it', async () => {
		const { container, fixture } = await render(HlmInputOtpFieldHost);
		const input = container.querySelector('input')!;
		const { control } = fixture.componentInstance;

		control.markAsTouched();
		fixture.detectChanges();
		expect(control.invalid).toBe(true);
		expect(input).not.toHaveAttribute('aria-invalid');

		control.markAsDirty();
		fixture.detectChanges();
		expect(input).toHaveAttribute('aria-invalid', 'true');

		control.setValue('123456');
		fixture.detectChanges();
		expect(input).not.toHaveAttribute('aria-invalid');
	});

	it('applies forceInvalid to the input and slots', async () => {
		const { container } = await render(
			`<hlm-input-otp length="6" forceInvalid><hlm-input-otp-slot index="0" /></hlm-input-otp>`,
			{ imports: [HlmInputOtpImports] },
		);
		expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
		expect(container.querySelector('brn-input-otp-slot')).toHaveAttribute('data-matches-spartan-invalid', 'true');
	});

	it('lets consumers override aria-invalid on the input', async () => {
		const { container } = await render(
			`<hlm-input-otp length="6" aria-invalid="true" />
			<hlm-input-otp length="6" forceInvalid aria-invalid="false" />`,
			{ imports: [HlmInputOtpImports] },
		);
		const [invalid, valid] = container.querySelectorAll('input');
		expect(invalid).toHaveAttribute('aria-invalid', 'true');
		expect(valid).not.toHaveAttribute('aria-invalid');
		for (const host of container.querySelectorAll('hlm-input-otp')) {
			expect(host).not.toHaveAttribute('aria-invalid');
		}
	});

	it('merges consumer and Field descriptions on the input', async () => {
		const { container, fixture } = await render(HlmInputOtpFieldHost);
		const input = container.querySelector('input')!;
		const description = container.querySelector('[data-slot="field-description"]')!;
		const { control } = fixture.componentInstance;

		expect(input).toHaveAttribute('aria-describedby', `otp-hint ${description.id}`);
		expect(input.closest('hlm-input-otp')).not.toHaveAttribute('aria-describedby');

		control.markAsDirty();
		fixture.detectChanges();
		const error = container.querySelector('[data-slot="field-error"]')!;
		expect(input).toHaveAttribute('aria-describedby', `otp-hint ${description.id} ${error.id}`);

		control.setValue('123456');
		fixture.detectChanges();
		expect(input).toHaveAttribute('aria-describedby', `otp-hint ${description.id}`);
	});
});
