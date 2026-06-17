import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnRadioGroupImports } from '../index';

describe('BrnRadioComponent', () => {
	it('should focus the first radio when tabbing into a group reset to no selected value', async () => {
		const user = userEvent.setup();
		const { getAllByRole, getByText, rerender } = await render(
			`
			<button type="button">before</button>
			<div brnRadioGroup [value]="value">
				<brn-radio value="16.1.4">16.1.4</brn-radio>
				<brn-radio value="16.0.0">16.0.0</brn-radio>
				<brn-radio value="15.3.0">15.3.0</brn-radio>
			</div>
			<button type="button">after</button>
			`,
			{
				imports: [BrnRadioGroupImports],
				componentProperties: {
					value: '16.0.0',
				},
			},
		);

		const radioButtons = getAllByRole('radio') as HTMLInputElement[];
		getByText('before').focus();
		await user.tab();
		expect(radioButtons[1]).toHaveFocus();

		await rerender({
			componentProperties: {
				value: null,
			},
		});

		getByText('before').focus();
		await user.tab();
		expect(radioButtons[0]).toHaveFocus();

		await user.tab();
		expect(getByText('after')).toHaveFocus();
	});

	it('should focus the first enabled radio when tabbing into a group with no selected enabled radio', async () => {
		const user = userEvent.setup();
		const { getAllByRole, getByText } = await render(
			`
			<button type="button">before</button>
			<div brnRadioGroup [value]="value">
				<brn-radio disabled value="16.1.4">16.1.4</brn-radio>
				<brn-radio value="16.0.0">16.0.0</brn-radio>
				<brn-radio value="15.3.0">15.3.0</brn-radio>
			</div>
			<button type="button">after</button>
			`,
			{
				imports: [BrnRadioGroupImports],
				componentProperties: {
					value: '',
				},
			},
		);

		const radioButtons = getAllByRole('radio') as HTMLInputElement[];
		getByText('before').focus();
		await user.tab();
		expect(radioButtons[1]).toHaveFocus();

		await user.tab();
		expect(getByText('after')).toHaveFocus();
	});

	it('should disable the radio button when disabled is true (reactive forms)', async () => {
		const form = new FormGroup({
			radioGroup: new FormControl('16.1.4'),
		});

		form.disable();

		const { getAllByRole } = await render(
			`
			<form [formGroup]="form">

      <div brnRadioGroup formControlName="radioGroup">
        <brn-radio value="16.1.4">16.1.4</brn-radio>
        <brn-radio value="16.0.0">16.0.0</brn-radio>
        <brn-radio value="15.3.0">15.3.0</brn-radio>
      </div>
    </form>
			`,
			{
				imports: [ReactiveFormsModule, BrnRadioGroupImports],
				componentProperties: {
					form,
				},
			},
		);

		const radioButtons = getAllByRole('radio');
		radioButtons.forEach((button) => expect(button).toBeDisabled());
	});
});
