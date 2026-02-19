import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnTimePicker } from './brn-time-picker';
import { BrnTimePickerColumn } from './brn-time-picker-column';

// jsdom does not implement scrollIntoView
HTMLElement.prototype.scrollIntoView = jest.fn();

describe('BrnTimePickerColumn', () => {
	const setupColumn = async () => {
		const container = await render(
			`
			<div brnTimePickerColumn aria-label="Hours">
				<button type="button">01</button>
				<button type="button">02</button>
				<button type="button" data-selected="true">03</button>
				<button type="button">04</button>
				<button type="button">05</button>
			</div>
			`,
			{ imports: [BrnTimePickerColumn] },
		);

		const buttons = screen.getAllByRole('button');
		return {
			user: userEvent.setup(),
			container,
			buttons,
			selected: buttons[2],
		};
	};

	it('should set role="group" on the host', async () => {
		await setupColumn();
		const group = screen.getByRole('group');
		expect(group).toBeTruthy();
	});

	it('should move focus to the next button with ArrowDown', async () => {
		const { selected, buttons, user } = await setupColumn();
		selected.focus();
		await user.keyboard('[ArrowDown]');

		expect(document.activeElement).toBe(buttons[3]);
	});

	it('should move focus to the previous button with ArrowUp', async () => {
		const { selected, buttons, user } = await setupColumn();
		selected.focus();
		await user.keyboard('[ArrowUp]');

		expect(document.activeElement).toBe(buttons[1]);
	});

	it('should wrap from last to first with ArrowDown', async () => {
		const { buttons, user } = await setupColumn();
		buttons[4].focus();
		await user.keyboard('[ArrowDown]');

		expect(document.activeElement).toBe(buttons[0]);
	});

	it('should wrap from first to last with ArrowUp', async () => {
		const { buttons, user } = await setupColumn();
		buttons[0].focus();
		await user.keyboard('[ArrowUp]');

		expect(document.activeElement).toBe(buttons[4]);
	});
});

describe('BrnTimePicker', () => {
	const setupPicker = async () => {
		const container = await render(
			`
			<div brnTimePicker>
				<div brnTimePickerColumn aria-label="Hours">
					<button type="button">01</button>
					<button type="button" data-selected="true">02</button>
					<button type="button">03</button>
				</div>
				<div brnTimePickerColumn aria-label="Minutes">
					<button type="button" data-selected="true">15</button>
					<button type="button">30</button>
					<button type="button">45</button>
				</div>
				<div brnTimePickerColumn aria-label="Period">
					<button type="button" data-selected="true">AM</button>
					<button type="button">PM</button>
				</div>
			</div>
			`,
			{ imports: [BrnTimePicker, BrnTimePickerColumn] },
		);

		const columns = container.fixture.nativeElement.querySelectorAll('[brnTimePickerColumn]');
		return {
			user: userEvent.setup(),
			container,
			hoursCol: columns[0] as HTMLElement,
			minutesCol: columns[1] as HTMLElement,
			periodCol: columns[2] as HTMLElement,
		};
	};

	it('should set role="listbox" on the host', async () => {
		await setupPicker();
		const listbox = screen.getByRole('listbox');
		expect(listbox).toBeTruthy();
	});

	it('should move focus to the selected item in the next column with ArrowRight', async () => {
		const { hoursCol, minutesCol, user } = await setupPicker();
		const hourBtn = hoursCol.querySelector('button[data-selected="true"]') as HTMLButtonElement;
		hourBtn.focus();
		await user.keyboard('[ArrowRight]');

		const expectedTarget = minutesCol.querySelector('button[data-selected="true"]') as HTMLElement;
		expect(document.activeElement).toBe(expectedTarget);
	});

	it('should move focus to the selected item in the previous column with ArrowLeft', async () => {
		const { hoursCol, minutesCol, user } = await setupPicker();
		const minuteBtn = minutesCol.querySelector('button[data-selected="true"]') as HTMLButtonElement;
		minuteBtn.focus();
		await user.keyboard('[ArrowLeft]');

		const expectedTarget = hoursCol.querySelector('button[data-selected="true"]') as HTMLElement;
		expect(document.activeElement).toBe(expectedTarget);
	});

	it('should focus the first button if no item is selected in the target column', async () => {
		const container = await render(
			`
			<div brnTimePicker>
				<div brnTimePickerColumn aria-label="Hours">
					<button type="button" data-selected="true">02</button>
				</div>
				<div brnTimePickerColumn aria-label="Minutes">
					<button type="button">15</button>
					<button type="button">30</button>
				</div>
			</div>
			`,
			{ imports: [BrnTimePicker, BrnTimePickerColumn] },
		);

		const user = userEvent.setup();
		const hourBtn = container.fixture.nativeElement.querySelector('button[data-selected="true"]') as HTMLButtonElement;
		hourBtn.focus();
		await user.keyboard('[ArrowRight]');

		const minutesBtns = container.fixture.nativeElement.querySelectorAll('[brnTimePickerColumn]:nth-child(2) button');
		expect(document.activeElement).toBe(minutesBtns[0]);
	});

	it('should not move focus when ArrowRight on the last column', async () => {
		const { periodCol, user } = await setupPicker();
		const periodBtn = periodCol.querySelector('button[data-selected="true"]') as HTMLButtonElement;
		periodBtn.focus();
		await user.keyboard('[ArrowRight]');

		expect(document.activeElement).toBe(periodBtn);
	});

	it('should not move focus when ArrowLeft on the first column', async () => {
		const { hoursCol, user } = await setupPicker();
		const hourBtn = hoursCol.querySelector('button[data-selected="true"]') as HTMLButtonElement;
		hourBtn.focus();
		await user.keyboard('[ArrowLeft]');

		expect(document.activeElement).toBe(hourBtn);
	});

	it('should combine ArrowRight and ArrowDown for cross-column then in-column navigation', async () => {
		const { hoursCol, minutesCol, user } = await setupPicker();
		const hourBtn = hoursCol.querySelector('button[data-selected="true"]') as HTMLButtonElement;
		hourBtn.focus();

		// ArrowRight → moves to minutes selected (15)
		await user.keyboard('[ArrowRight]');
		const minuteSelected = minutesCol.querySelector('button[data-selected="true"]') as HTMLElement;
		expect(document.activeElement).toBe(minuteSelected);

		// ArrowDown → moves to next minute (30)
		await user.keyboard('[ArrowDown]');
		const minutesBtns = minutesCol.querySelectorAll('button');
		expect(document.activeElement).toBe(minutesBtns[1]);
	});
});
