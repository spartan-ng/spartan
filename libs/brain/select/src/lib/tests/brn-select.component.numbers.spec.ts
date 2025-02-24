import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnSelectImports } from '../../index';

describe('BrnSelectComponent NumberValues', () => {
	beforeAll(() => {
		global.ResizeObserver = jest.fn().mockImplementation(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));
		window.HTMLElement.prototype.scrollIntoView = jest.fn();
	});

	const setup = async () => {
		const selectedValue = signal(15);
		const container = await render(
			`
			 <brn-select class="inline-block" [(ngModel)]="selectedValue" [multiple]="multiple">
			   <button brnSelectTrigger class='w-56' data-testid="brn-select-trigger">
			     <brn-select-value data-testid="brn-select-value" />
			   </button>
			   <brn-select-content class="w-56" data-testid="brn-select-content">
			     <label brnSelectLabel>Numbers</label>
			     <div brnOption [value]="0">0</div>
			     <div brnOption [value]="5">5</div>
			     <div brnOption [value]="10">10</div>
			     <div brnOption [value]="15">15</div>
			     <div brnOption [value]="20">20</div>
			   </brn-select-content>
			 </brn-select>
      `,
			{
				imports: [...BrnSelectImports, FormsModule],
				componentProperties: {
					selectedValue,
					multiple: false,
				},
			},
		);
		return {
			user: userEvent.setup(),
			container,
			trigger: screen.getByTestId('brn-select-trigger'),
			selectedValue,
			value: screen.getByTestId('brn-select-value'),
		};
	};

	it('should display the correct value after render', async () => {
		const { container, user, trigger, value, selectedValue } = await setup();
		// without rerenderung
		container.detectChanges();
		expect(value.textContent?.trim()).toBe('15');

		await user.click(trigger);
		const options = await screen.getAllByRole('option');

		await user.click(options[0]);
		expect(trigger.textContent?.trim()).toBe('0');
		expect(selectedValue()).toBe(0);

		await user.click(options[1]);
		expect(selectedValue()).toBe(5);
		expect(trigger.textContent?.trim()).toBe('5');

		await user.click(options[2]);
		expect(trigger.textContent?.trim()).toBe('10');
		expect(selectedValue()).toBe(10);
	});

	it('should display the correct value after render when multiple is true', async () => {
		const { container, user, trigger, value } = await setup();
		const selectedValue = signal([15]);
		await container.rerender({
			componentProperties: {
				multiple: true,
				selectedValue,
			},
		});
		container.detectChanges();
		expect(value.textContent?.trim()).toBe('15');
		expect(selectedValue()).toEqual([15]);

		await user.click(trigger);
		const options = await screen.getAllByRole('option');

		await user.click(options[1]);
		expect(selectedValue()).toEqual([15, 5]);
		expect(trigger.textContent?.trim()).toBe('15, 5');

		await user.click(options[2]);
		expect(trigger.textContent?.trim()).toBe('15, 5, 10');
		expect(selectedValue()).toEqual([15, 5, 10]);
	});
});
