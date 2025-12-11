import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrnCheckbox } from './brn-checkbox';

describe('BrnCheckboxComponent', () => {
	const setup = async () => {
		const container = await render(
			`
     <brn-checkbox id='checkboxId' name='checkboxName' data-testid='brnCheckBox' aria-label='checkbox'/>
    `,
			{
				imports: [BrnCheckbox],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			checkboxElement: screen.getByLabelText('checkbox'),
		};
	};

	const setupInsideLabel = async () => {
		const container = await render(
			`
     <label data-testid='label'>
     Checkbox Inside Label
     <brn-checkbox id='checkboxId' data-testid='brnCheckBox' name='checkboxName'/>
      </label>
    `,
			{
				imports: [BrnCheckbox],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			checkboxElement: screen.getByLabelText(/checkbox inside label/i),
			labelElement: screen.getByText(/checkbox inside label/i),
		};
	};
	const setupInsideLabelDisabled = async () => {
		const container = await render(
			`
     <label data-testid='label'>
     Checkbox Inside Label
     <brn-checkbox disabled id='checkboxId' data-testid='brnCheckBox' name='checkboxName'/>
      </label>
    `,
			{
				imports: [BrnCheckbox],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			checkboxElement: screen.getByLabelText(/checkbox inside label/i),
			labelElement: screen.getByText(/checkbox inside label/i),
		};
	};

	const setupOutsideLabelWithAriaLabelledBy = async () => {
		const container = await render(
			`
     <!-- need for because arialabelledby only provides accessible name -->
     <label id='labelId' for='checkboxId' data-testid='label'>
     Checkbox Outside Label with ariaLabelledBy
     </label>
     <brn-checkbox id='checkboxId' name='checkboxName' data-testid='brnCheckBox' aria-labelledby='labelId'/>
    `,
			{
				imports: [BrnCheckbox],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			checkboxElement: screen.getByLabelText(/checkbox outside label with arialabelledby/i),
			labelElement: screen.getByText(/checkbox outside label with arialabelledby/i),
		};
	};

	const setupOutsideLabelWithForAndId = async () => {
		const container = await render(
			`
     <label for='checkboxId' data-testid='label'>
     Checkbox Outside Label with id
     </label>
     <brn-checkbox id='checkboxId' name='checkboxName' data-testid='brnCheckBox'/>
    `,
			{
				imports: [BrnCheckbox],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			checkboxElement: screen.getByLabelText(/checkbox outside label with id/i),
			labelElement: screen.getByText(/checkbox outside label with id/i),
		};
	};
	const setupOutsideLabelWithForAndIdDisabled = async () => {
		const container = await render(
			`
     <label for='checkboxId' data-testid='label'>
     Checkbox Outside Label with id
     </label>
     <brn-checkbox disabled id='checkboxId' name='checkboxName' data-testid='brnCheckBox'/>
    `,
			{
				imports: [BrnCheckbox],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			checkboxElement: screen.getByLabelText(/checkbox outside label with id/i),
			labelElement: screen.getByText(/checkbox outside label with id/i),
		};
	};

	type Options = Partial<{ focus: boolean; focusVisible: boolean; disabled: boolean }>;

	const validateAttributes = async (
		buttonElement: HTMLElement,
		wrapperElement: HTMLElement,
		shouldBeChecked: boolean,
		opts?: Options,
	) => {
		screen.debug();
		expect(buttonElement).toBeInTheDocument();
		expect(buttonElement).toHaveAttribute('role', 'checkbox');
		expect(buttonElement).toHaveAttribute('id', 'checkboxId');
		expect(buttonElement).toHaveAttribute('name', 'checkboxName');
		expect(buttonElement).toHaveAttribute('aria-checked', shouldBeChecked + '');
		expect(await axe(buttonElement)).toHaveNoViolations();

		expect(wrapperElement).toHaveAttribute('id', 'checkboxId-checkbox');
		expect(wrapperElement).toHaveAttribute('name', 'checkboxName-checkbox');
		expect(wrapperElement).toHaveAttribute('data-state', shouldBeChecked ? 'checked' : 'unchecked');
		expect(wrapperElement).toHaveAttribute('data-disabled', `${!!opts?.disabled}`);
		expect(wrapperElement).toHaveAttribute('data-focus', `${!!opts?.focus}`);
		expect(wrapperElement).toHaveAttribute('data-focus-visible', `${!!opts?.focusVisible}`);
		expect(await axe(wrapperElement)).toHaveNoViolations();
	};
	const validateCheckboxOn = async (opts?: Options) => {
		const buttonElement = await screen.findByRole('checkbox');
		const wrapperElement = await screen.findByTestId('brnCheckBox');

		await validateAttributes(buttonElement, wrapperElement, true, opts);
	};
	const validateCheckboxOff = async (opts?: Options) => {
		const buttonElement = await screen.findByRole('checkbox');
		const wrapperElement = await screen.findByTestId('brnCheckBox');

		await validateAttributes(buttonElement, wrapperElement, false, opts);
	};

	describe('with aria-label', () => {
		it('unchecked by default', async () => {
			await setup();
			await validateCheckboxOff();
		});
		it('mouse click on element toggles', async () => {
			const { user, checkboxElement } = await setup();
			await validateCheckboxOff();
			await user.click(checkboxElement);
			await validateCheckboxOn({ focus: true });
			await user.click(checkboxElement);
			await validateCheckboxOff({ focus: true });
		});
		it('focus with tab and enter toggles', async () => {
			const { user } = await setup();
			const options = { focus: true, focusVisible: true };
			await validateCheckboxOff();
			await user.keyboard('[Tab][Enter]');
			await validateCheckboxOn(options);
			await user.keyboard('[Enter]');
			await validateCheckboxOff(options);
			await user.keyboard('[Enter]');
			await validateCheckboxOn(options);
		});
		it('focus with tab and space toggles', async () => {
			const { user } = await setup();
			const options = { focus: true, focusVisible: true };
			await validateCheckboxOff();
			await user.keyboard('[Tab][Space]');
			await validateCheckboxOn(options);
			await user.keyboard('[Space]');
			await validateCheckboxOff(options);
			await user.keyboard('[Space]');
			await validateCheckboxOn(options);
		});
	});

	describe('inside <label>', () => {
		it('unchecked by default', async () => {
			await setupInsideLabel();
			await validateCheckboxOff();
		});
		it('mouse click on element toggles', async () => {
			const { user, labelElement } = await setupInsideLabel();
			await validateCheckboxOff();
			await user.click(labelElement);
			await validateCheckboxOn({ focus: true });
			await user.click(labelElement);
			await validateCheckboxOff({ focus: true });
		});
		it('focus with tab and enter toggles', async () => {
			const { user } = await setupInsideLabel();
			const options = { focus: true, focusVisible: true };
			await validateCheckboxOff();
			await user.keyboard('[Tab][Enter]');
			await validateCheckboxOn(options);
			await user.keyboard('[Enter]');
			await validateCheckboxOff(options);
			await user.keyboard('[Enter]');
			await validateCheckboxOn(options);
		});
		it('focus with tab and space toggles', async () => {
			const { user } = await setupInsideLabel();
			const options = { focus: true, focusVisible: true };
			await validateCheckboxOff();
			await user.keyboard('[Tab][Space]');
			await validateCheckboxOn(options);
			await user.keyboard('[Space]');
			await validateCheckboxOff(options);
			await user.keyboard('[Space]');
			await validateCheckboxOn(options);
		});
		it('disabled', async () => {
			const { user } = await setupInsideLabelDisabled();
			// await validateCheckboxOff({ focus: false, focusVisible: false, disabled: true });
			const options = { focus: false, focusVisible: false, disabled: true };
			await user.keyboard('[Tab][Space]');
			await validateCheckboxOff(options);
			await user.keyboard('[Space]');
			await validateCheckboxOff(options);
			await user.keyboard('[Space]');
			await validateCheckboxOff(options);
			const label = await screen.findByTestId('label');
			expect(label).toHaveAttribute('data-disabled', 'true');
		});
	});

	describe('outside <label> with aria-labelledby', () => {
		it('unchecked by default', async () => {
			await setupOutsideLabelWithAriaLabelledBy();
			await validateCheckboxOff();
		});
		it('mouse click on element toggles', async () => {
			const { user, labelElement } = await setupOutsideLabelWithAriaLabelledBy();
			await validateCheckboxOff();
			await user.click(labelElement);
			await validateCheckboxOn({ focus: true });
			await user.click(labelElement);
			await validateCheckboxOff({ focus: true });
		});
		it('focus with tab and enter toggles', async () => {
			const { user } = await setupOutsideLabelWithAriaLabelledBy();
			const options = { focus: true, focusVisible: true };
			await validateCheckboxOff();
			await user.keyboard('[Tab][Enter]');
			await validateCheckboxOn(options);
			await user.keyboard('[Enter]');
			await validateCheckboxOff(options);
			await user.keyboard('[Enter]');
			await validateCheckboxOn(options);
		});
		it('focus with tab and space toggles', async () => {
			const { user } = await setupOutsideLabelWithAriaLabelledBy();
			const options = { focus: true, focusVisible: true };
			await validateCheckboxOff();
			await user.keyboard('[Tab][Space]');
			await validateCheckboxOn(options);
			await user.keyboard('[Space]');
			await validateCheckboxOff(options);
			await user.keyboard('[Space]');
			await validateCheckboxOn(options);
		});
	});

	describe('outside <label> with for and id', () => {
		it('unchecked by default', async () => {
			await setupOutsideLabelWithForAndId();
			await validateCheckboxOff();
		});
		it('mouse click on element toggles', async () => {
			const { user, labelElement } = await setupOutsideLabelWithForAndId();
			await validateCheckboxOff();
			await user.click(labelElement);
			await validateCheckboxOn({ focus: true });
			await user.click(labelElement);
			await validateCheckboxOff({ focus: true });
		});
		it('focus with tab and enter toggles', async () => {
			const { user } = await setupOutsideLabelWithForAndId();
			const options = { focus: true, focusVisible: true };
			await validateCheckboxOff();
			await user.keyboard('[Tab][Enter]');
			await validateCheckboxOn(options);
			await user.keyboard('[Enter]');
			await validateCheckboxOff(options);
			await user.keyboard('[Enter]');
			await validateCheckboxOn(options);
		});
		it('focus with tab and space toggles', async () => {
			const { user } = await setupOutsideLabelWithForAndId();
			const options = { focus: true, focusVisible: true };
			await validateCheckboxOff();
			await user.keyboard('[Tab][Space]');
			await validateCheckboxOn(options);
			await user.keyboard('[Space]');
			await validateCheckboxOff(options);
			await user.keyboard('[Space]');
			await validateCheckboxOn(options);
			const label = await screen.findByTestId('label');
			expect(label).toHaveAttribute('data-disabled', 'false');
		});
		it('sets data-disabled to the label toggles do not change anything', async () => {
			const { user } = await setupOutsideLabelWithForAndIdDisabled();
			const options = { focus: false, focusVisible: false, disabled: true };
			await validateCheckboxOff(options);
			await user.keyboard('[Tab][Space]');
			await validateCheckboxOff(options);
			await user.keyboard('[Space]');
			await validateCheckboxOff(options);
			await user.keyboard('[Space]');
			await validateCheckboxOff(options);
			const label = await screen.findByTestId('label');
			expect(label).toHaveAttribute('data-disabled', 'true');
		});
	});
});
