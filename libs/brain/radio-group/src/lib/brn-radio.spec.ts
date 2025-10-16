import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';
import { BrnRadioGroupImports } from '../index';

describe('BrnRadioComponent', () => {
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
