import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnSelectImports } from '../../index';

describe('BrnSelectComponent', () => {
	beforeAll(() => {
		global.ResizeObserver = jest.fn().mockImplementation(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));
		window.HTMLElement.prototype.scrollIntoView = jest.fn();
	});

	const setup = async () => {
		const openChangeSpy = jest.fn();
		const valueChangeSpy = jest.fn();
		const container = await render(
			`
            <brn-select class="inline-block" [multiple]="multiple" (openChange)="openChange($event)" (valueChange)="valueChange($event)">
			<button brnSelectTrigger class='w-56' data-testid="brn-select-trigger">
				<brn-select-value />
			</button>
			<brn-select-content class="w-56" data-testid="brn-select-content">
				<label brnSelectLabel>Fruits</label>
				<div brnOption value="apple">Apple</div>
				<div brnOption value="banana">Banana</div>
				<div brnOption value="blueberry">Blueberry</div>
				<div brnOption value="grapes">Grapes</div>
				<div brnOption value="pineapple">Pineapple</div>
				<div brnOption value="disabled" [disabled]="true">Disabled Option</div>
		  </brn-select-content>
		</brn-select>
    `,
			{
				imports: [...BrnSelectImports],
				componentProperties: {
					multiple: true,
					openChange: openChangeSpy,
					valueChange: valueChangeSpy,
				},
			},
		);
		return {
			user: userEvent.setup(),
			container,
			trigger: screen.getByTestId('brn-select-trigger'),
			openChangeSpy,
			valueChangeSpy,
		};
	};

	describe('default', () => {
		it('openChanged should emit event on open and close', async () => {
			const { user, trigger, openChangeSpy } = await setup();
			await user.click(trigger);
			expect(openChangeSpy).toHaveBeenCalledTimes(1);
			await user.click(trigger);
			expect(openChangeSpy).toHaveBeenCalledTimes(2);
		});
		it('shoud add data-disabled to a disabled option', async () => {
			const { user, trigger } = await setup();
			await user.click(trigger);
			const disabledOption = await screen.getByText('Disabled Option');

			expect(disabledOption).toHaveAttribute('data-disabled');
			await user.click(disabledOption);
			expect(trigger.textContent).not.toContain('Disabled Option');
		});

		it('single mode: valueChange should emit event on selection', async () => {
			const { user, trigger, container, openChangeSpy, valueChangeSpy } = await setup();
			container.rerender({
				componentProperties: {
					multiple: false,
					openChange: openChangeSpy,
					valueChange: valueChangeSpy,
				},
			});
			await user.click(trigger);
			const options = await screen.getAllByRole('option');
			await user.click(options[0]);
			expect(valueChangeSpy).toHaveBeenCalledWith('apple');
		});

		it('multi mode: valueChange should emit event on selection', async () => {
			const { user, trigger, valueChangeSpy } = await setup();
			await user.click(trigger);
			const options = await screen.getAllByRole('option');
			await user.click(options[0]);
			expect(valueChangeSpy).toHaveBeenCalledWith(['apple']);
			await user.click(options[1]);
			expect(valueChangeSpy).toHaveBeenCalledWith(['apple', 'banana']);
		});
	});

	describe('multiple option select', () => {
		it('when multiple true -> false with multiple selected values, should reset', async () => {
			const { user, trigger, container } = await setup();
			await user.click(trigger);
			const options = await screen.getAllByRole('option');
			await user.click(options[0]);
			await user.click(options[1]);
			expect(trigger.textContent).toContain(`${options[0].textContent}, ${options[1].textContent}`);
			container.rerender({
				componentProperties: {
					multiple: false,
				},
			});
			expect(trigger.textContent).toContain('');
		});

		it('when multiple true -> false with single value, should retain value', async () => {
			const { user, trigger, container } = await setup();
			await user.click(trigger);
			const options = await screen.getAllByRole('option');
			await user.click(options[0]);
			expect(trigger.textContent).toContain(`${options[0].textContent}`);
			container.rerender({
				componentProperties: {
					multiple: false,
				},
			});
			expect(trigger.textContent).toContain(`${options[0].textContent}`);
		});
	});
});
