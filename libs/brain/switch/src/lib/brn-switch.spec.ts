import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BrnSwitch } from './brn-switch';
import { BrnSwitchThumb } from './brn-switch-thumb';

describe('BrnSwitchComponent', () => {
	const setup = async () => {
		const container = await render(
			`
     <brn-switch id='switchId' name='switchName' data-testid='brnSwitch' aria-label='switch'>
             <brn-switch-thumb />
      </brn-switch>
    `,
			{
				imports: [BrnSwitch, BrnSwitchThumb],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			containerElement: screen.getByLabelText('switch'),
		};
	};

	const setupInsideLabel = async () => {
		const container = await render(
			`
     <label>
     Switch Inside Label
     <brn-switch id='switchId' data-testid='brnSwitch' name='switchName'>
             <brn-switch-thumb />
      </brn-switch>
      </label>
    `,
			{
				imports: [BrnSwitch, BrnSwitchThumb],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			containerElement: screen.getByLabelText(/switch inside label/i),
			labelElement: screen.getByText(/switch inside label/i),
		};
	};

	const setupOutsideLabelWithAriaLabelledBy = async () => {
		const container = await render(
			`
     <!-- need for because arialabelledby only provides accessible name -->
     <label id='labelId' for='switchId'>
     Switch Outside Label with ariaLabelledBy
     </label>
     <brn-switch id='switchId' name='switchName' data-testid='brnSwitch' aria-labelledby='labelId'>
             <brn-switch-thumb />
      </brn-switch>
    `,
			{
				imports: [BrnSwitch, BrnSwitchThumb],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			containerElement: screen.getByLabelText(/switch outside label with arialabelledby/i),
			labelElement: screen.getByText(/switch outside label with arialabelledby/i),
		};
	};

	const setupOutsideLabelWithForAndId = async () => {
		const container = await render(
			`
     <label for='switchId'>
     Switch Outside Label with id
     </label>
     <brn-switch id='switchId' name='switchName' data-testid='brnSwitch'>
             <brn-switch-thumb />
      </brn-switch>
    `,
			{
				imports: [BrnSwitch, BrnSwitchThumb],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			containerElement: screen.getByLabelText(/switch outside label with id/i),
			labelElement: screen.getByText(/switch outside label with id/i),
		};
	};

	type Options = Partial<{ focus: boolean; focusVisible: boolean; disabled: boolean }>;

	const validateAttributes = async (
		switchElement: HTMLElement,
		containerElement: HTMLElement,
		shouldBeChecked: boolean,
		opts?: Options,
	) => {
		expect(switchElement).toBeInTheDocument();
		expect(switchElement).toHaveAttribute('type', 'button');
		expect(switchElement).toHaveAttribute('id', 'switchId');
		expect(switchElement).toHaveAttribute('name', 'switchName');
		expect(await axe(switchElement)).toHaveNoViolations();

		expect(containerElement).toHaveAttribute('id', 'switchId-switch');
		expect(containerElement).toHaveAttribute('name', 'switchName-switch');
		expect(containerElement).toHaveAttribute('data-state', shouldBeChecked ? 'checked' : 'unchecked');
		expect(containerElement).toHaveAttribute('data-disabled', `${!!opts?.disabled}`);
		expect(containerElement).toHaveAttribute('data-focus', `${!!opts?.focus}`);
		expect(containerElement).toHaveAttribute('data-focus-visible', `${!!opts?.focusVisible}`);
		expect(await axe(containerElement)).toHaveNoViolations();
	};
	const validateSwitchOn = async (opts?: Options) => {
		const switchElement = await screen.findByRole('switch');
		const containerElement = await screen.findByTestId('brnSwitch');

		await validateAttributes(switchElement, containerElement, true, opts);
	};
	const validateSwitchOff = async (opts?: Options) => {
		const switchElement = await screen.findByRole('switch');
		const containerElement = await screen.findByTestId('brnSwitch');

		await validateAttributes(switchElement, containerElement, false, opts);
	};

	describe('with aria-label', () => {
		it('unchecked by default', async () => {
			await setup();
			await validateSwitchOff();
		});
		it('mouse click on element toggles', async () => {
			const { user, containerElement } = await setup();
			await validateSwitchOff();
			await user.click(containerElement);
			await validateSwitchOn({ focus: true });
			await user.click(containerElement);
			await validateSwitchOff({ focus: true });
		});
		it('focus with tab and enter toggles', async () => {
			const { user } = await setup();
			const options = { focus: true, focusVisible: true };
			await validateSwitchOff();
			await user.keyboard('[Tab][Enter]');
			await validateSwitchOn(options);
			await user.keyboard('[Enter]');
			await validateSwitchOff(options);
			await user.keyboard('[Enter]');
			await validateSwitchOn(options);
		});
		it('focus with tab and space toggles', async () => {
			const { user } = await setup();
			const options = { focus: true, focusVisible: true };
			await validateSwitchOff();
			await user.keyboard('[Tab][Space]');
			await validateSwitchOn(options);
			await user.keyboard('[Space]');
			await validateSwitchOff(options);
			await user.keyboard('[Space]');
			await validateSwitchOn(options);
		});
	});

	describe('inside <label>', () => {
		it('unchecked by default', async () => {
			await setupInsideLabel();
			await validateSwitchOff();
		});
		it('mouse click on element toggles', async () => {
			const { user, labelElement } = await setupInsideLabel();
			await validateSwitchOff();
			await user.click(labelElement);
			await validateSwitchOn({ focus: true });
			await user.click(labelElement);
			await validateSwitchOff({ focus: true });
		});
		it('focus with tab and enter toggles', async () => {
			const { user } = await setupInsideLabel();
			const options = { focus: true, focusVisible: true };
			await validateSwitchOff();
			await user.keyboard('[Tab][Enter]');
			await validateSwitchOn(options);
			await user.keyboard('[Enter]');
			await validateSwitchOff(options);
			await user.keyboard('[Enter]');
			await validateSwitchOn(options);
		});
		it('focus with tab and space toggles', async () => {
			const { user } = await setupInsideLabel();
			const options = { focus: true, focusVisible: true };
			await validateSwitchOff();
			await user.keyboard('[Tab][Space]');
			await validateSwitchOn(options);
			await user.keyboard('[Space]');
			await validateSwitchOff(options);
			await user.keyboard('[Space]');
			await validateSwitchOn(options);
		});
	});

	describe('outside <label> with aria-labelledby', () => {
		it('unchecked by default', async () => {
			await setupOutsideLabelWithAriaLabelledBy();
			await validateSwitchOff();
		});
		it('mouse click on element toggles', async () => {
			const { user, labelElement } = await setupOutsideLabelWithAriaLabelledBy();
			await validateSwitchOff();
			await user.click(labelElement);
			await validateSwitchOn({ focus: true });
			await user.click(labelElement);
			await validateSwitchOff({ focus: true });
		});
		it('focus with tab and enter toggles', async () => {
			const { user } = await setupOutsideLabelWithAriaLabelledBy();
			const options = { focus: true, focusVisible: true };
			await validateSwitchOff();
			await user.keyboard('[Tab][Enter]');
			await validateSwitchOn(options);
			await user.keyboard('[Enter]');
			await validateSwitchOff(options);
			await user.keyboard('[Enter]');
			await validateSwitchOn(options);
		});
		it('focus with tab and space toggles', async () => {
			const { user } = await setupOutsideLabelWithAriaLabelledBy();
			const options = { focus: true, focusVisible: true };
			await validateSwitchOff();
			await user.keyboard('[Tab][Space]');
			await validateSwitchOn(options);
			await user.keyboard('[Space]');
			await validateSwitchOff(options);
			await user.keyboard('[Space]');
			await validateSwitchOn(options);
		});
	});

	describe('outside <label> with for and id', () => {
		it('unchecked by default', async () => {
			await setupOutsideLabelWithForAndId();
			await validateSwitchOff();
		});
		it('mouse click on element toggles', async () => {
			const { user, labelElement } = await setupOutsideLabelWithForAndId();
			await validateSwitchOff();
			await user.click(labelElement);
			await validateSwitchOn({ focus: true });
			await user.click(labelElement);
			await validateSwitchOff({ focus: true });
		});
		it('focus with tab and enter toggles', async () => {
			const { user } = await setupOutsideLabelWithForAndId();
			const options = { focus: true, focusVisible: true };
			await validateSwitchOff();
			await user.keyboard('[Tab][Enter]');
			await validateSwitchOn(options);
			await user.keyboard('[Enter]');
			await validateSwitchOff(options);
			await user.keyboard('[Enter]');
			await validateSwitchOn(options);
		});
		it('focus with tab and space toggles', async () => {
			const { user } = await setupOutsideLabelWithForAndId();
			const options = { focus: true, focusVisible: true };
			await validateSwitchOff();
			await user.keyboard('[Tab][Space]');
			await validateSwitchOn(options);
			await user.keyboard('[Space]');
			await validateSwitchOff(options);
			await user.keyboard('[Space]');
			await validateSwitchOn(options);
		});
	});
});
