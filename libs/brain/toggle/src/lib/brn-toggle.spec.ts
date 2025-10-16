import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnToggle } from './brn-toggle';

describe('BrnToggleDirective', () => {
	const setup = async (disabled = false) => {
		const container = await render(
			`
     <button ${disabled ? 'disabled' : ''} brnToggle>Toggle</button>
    `,
			{
				imports: [BrnToggle],
			},
		);
		return {
			user: userEvent.setup(),
			container,
			toggle: screen.getByRole('button'),
		};
	};

	it('should be toggled off by default and then toggle between on and off on for click', async () => {
		const { toggle, container, user } = await setup();
		expect(toggle).not.toHaveAttribute('data-disabled');
		expect(toggle).not.toHaveAttribute('disabled');

		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'off');

		await user.click(toggle);
		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'on');

		await user.click(toggle);
		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'off');
	});

	it('should be toggled off by default and then toggle between on and off on for enter', async () => {
		const { toggle, container, user } = await setup();
		expect(toggle).not.toHaveAttribute('data-disabled');
		expect(toggle).not.toHaveAttribute('disabled');

		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'off');

		await user.keyboard('[Tab][Enter]');
		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'on');

		await user.keyboard('[Enter]');
		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'off');
	});

	it('should be toggled off by default and then toggle between on and off on for space', async () => {
		const { toggle, container, user } = await setup();
		expect(toggle).not.toHaveAttribute('data-disabled');
		expect(toggle).not.toHaveAttribute('disabled');

		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'off');

		await user.keyboard('[Tab][Space]');
		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'on');

		await user.keyboard('[Space]');
		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'off');
	});

	it('should add correct id, aria and disabled toggling when disabled', async () => {
		const { toggle, container, user } = await setup(true);
		expect(toggle).toHaveAttribute('data-state', 'off');
		expect(toggle).toHaveAttribute('id', expect.stringMatching(/brn-toggle-\d+/));
		expect(toggle).toHaveAttribute('data-disabled');
		expect(toggle).toHaveAttribute('disabled');

		await user.keyboard('[Tab][Space]');
		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'off');

		await user.click(toggle);
		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'off');

		await user.keyboard('[Enter]');
		container.detectChanges();
		expect(toggle).toHaveAttribute('data-state', 'off');
	});
});
