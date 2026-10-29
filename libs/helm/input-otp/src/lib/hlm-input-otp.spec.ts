import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
});
