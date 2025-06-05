import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fireEvent, render } from '@testing-library/angular';
import { BrnToggleGroupComponent } from './brn-toggle-group.component';
import { BrnToggleGroupItemDirective } from './brn-toggle-item.directive';

@Component({
	imports: [BrnToggleGroupItemDirective, BrnToggleGroupComponent],
	template: `
		<brn-toggle-group [(value)]="value" [disabled]="disabled" [multiple]="multiple">
			<button brnToggleGroupItem value="option-1">Option 1</button>
			<button brnToggleGroupItem value="option-2">Option 2</button>
			<button brnToggleGroupItem value="option-3">Option 3</button>
		</brn-toggle-group>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class BrnToggleGroupDirectiveSpecComponent {
	@Input() public value?: string | string[];
	@Input() public disabled = false;
	@Input() public multiple = false;
}

@Component({
	imports: [BrnToggleGroupItemDirective, BrnToggleGroupComponent, FormsModule],
	template: `
		<brn-toggle-group [(ngModel)]="value" [multiple]="multiple">
			<button brnToggleGroupItem value="option-1">Option 1</button>
			<button brnToggleGroupItem value="option-2">Option 2</button>
			<button brnToggleGroupItem value="option-3">Option 3</button>
		</brn-toggle-group>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class BrnToggleGroupDirectiveFormSpecComponent {
	@Input() public value?: string | string[];
	@Input() public multiple = false;
}

describe('BrnToggleGroupDirective', () => {
	it('should allow only a single selected toggle button when multiple is false', async () => {
		const { getAllByRole } = await render(BrnToggleGroupDirectiveSpecComponent);
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('data-state', 'off');
		expect(buttons[1]).toHaveAttribute('data-state', 'off');
		expect(buttons[2]).toHaveAttribute('data-state', 'off');

		await fireEvent.click(buttons[0]);
		expect(buttons[0]).toHaveAttribute('data-state', 'on');
		expect(buttons[1]).toHaveAttribute('data-state', 'off');
		expect(buttons[2]).toHaveAttribute('data-state', 'off');

		await fireEvent.click(buttons[1]);
		expect(buttons[0]).toHaveAttribute('data-state', 'off');
		expect(buttons[1]).toHaveAttribute('data-state', 'on');
		expect(buttons[2]).toHaveAttribute('data-state', 'off');
	});

	it('should allow multiple selected toggle buttons when multiple is true', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveSpecComponent, {
			inputs: {
				multiple: true,
			},
		});
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('data-state', 'off');
		expect(buttons[1]).toHaveAttribute('data-state', 'off');
		expect(buttons[2]).toHaveAttribute('data-state', 'off');

		await fireEvent.click(buttons[0]);
		detectChanges();
		expect(buttons[0]).toHaveAttribute('data-state', 'on');
		expect(buttons[1]).toHaveAttribute('data-state', 'off');
		expect(buttons[2]).toHaveAttribute('data-state', 'off');

		await fireEvent.click(buttons[1]);
		detectChanges();
		expect(buttons[0]).toHaveAttribute('data-state', 'on');
		expect(buttons[1]).toHaveAttribute('data-state', 'on');
		expect(buttons[2]).toHaveAttribute('data-state', 'off');
	});

	it('should disable all toggle buttons when disabled is true', async () => {
		const { getAllByRole } = await render(BrnToggleGroupDirectiveSpecComponent, {
			inputs: {
				disabled: true,
			},
		});
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('disabled');
		expect(buttons[1]).toHaveAttribute('disabled');
		expect(buttons[2]).toHaveAttribute('disabled');
	});

	it('should initially select the button with the provided value (multiple = false)', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveFormSpecComponent, {
			inputs: {
				value: 'option-2',
			},
		});
		detectChanges();
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('data-state', 'off');
		expect(buttons[1]).toHaveAttribute('data-state', 'on');
		expect(buttons[2]).toHaveAttribute('data-state', 'off');
	});

	it('should initially select the buttons with the provided values (multiple = true)', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveFormSpecComponent, {
			inputs: {
				value: ['option-1', 'option-3'],
				multiple: true,
			},
		});
		detectChanges();
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('data-state', 'on');
		expect(buttons[1]).toHaveAttribute('data-state', 'off');
		expect(buttons[2]).toHaveAttribute('data-state', 'on');
	});

	it('should initially select the button with the provided value (multiple = false) using ngModel', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveFormSpecComponent, {
			inputs: {
				value: 'option-2',
			},
		});
		detectChanges();
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('data-state', 'off');
		expect(buttons[1]).toHaveAttribute('data-state', 'on');
		expect(buttons[2]).toHaveAttribute('data-state', 'off');
	});

	it('should initially select the buttons with the provided values (multiple = true) using ngModel', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveFormSpecComponent, {
			inputs: {
				value: ['option-1', 'option-3'],
				multiple: true,
			},
		});
		detectChanges();
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('data-state', 'on');
		expect(buttons[1]).toHaveAttribute('data-state', 'off');
		expect(buttons[2]).toHaveAttribute('data-state', 'on');
	});
});
