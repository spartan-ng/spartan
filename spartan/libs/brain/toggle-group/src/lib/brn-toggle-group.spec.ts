import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fireEvent, render } from '@testing-library/angular';
import { BrnToggleGroup } from './brn-toggle-group';
import { BrnToggleGroupItem } from './brn-toggle-item';

@Component({
	imports: [BrnToggleGroupItem, BrnToggleGroup],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-toggle-group [(value)]="value" [disabled]="disabled()" [type]="type()">
			<button brnToggleGroupItem value="option-1">Option 1</button>
			<button brnToggleGroupItem value="option-2">Option 2</button>
			<button brnToggleGroupItem value="option-3">Option 3</button>
		</brn-toggle-group>
	`,
})
class BrnToggleGroupDirectiveSpec {
	public readonly value? = model<string | string[]>();
	public readonly disabled = input(false);
	public readonly type = input('single');
}

@Component({
	imports: [BrnToggleGroupItem, BrnToggleGroup, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-toggle-group [(ngModel)]="value" [type]="type()">
			<button brnToggleGroupItem value="option-1">Option 1</button>
			<button brnToggleGroupItem value="option-2">Option 2</button>
			<button brnToggleGroupItem value="option-3">Option 3</button>
		</brn-toggle-group>
	`,
})
class BrnToggleGroupDirectiveFormSpec {
	public readonly value = model<string | string[]>();
	public readonly type = input('single');
}

describe('BrnToggleGroupDirective', () => {
	it('should allow only a single selected toggle button when type is single', async () => {
		const { getAllByRole } = await render(BrnToggleGroupDirectiveSpec);
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

	it('should allow multiple selected toggle buttons when type is multiple', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveSpec, {
			inputs: {
				type: 'multiple',
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
		const { getAllByRole } = await render(BrnToggleGroupDirectiveSpec, {
			inputs: {
				disabled: true,
			},
		});
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('disabled');
		expect(buttons[1]).toHaveAttribute('disabled');
		expect(buttons[2]).toHaveAttribute('disabled');
	});

	it('should initially select the button with the provided value (type = single)', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveFormSpec, {
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

	it('should initially select the buttons with the provided values (type = multiple)', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveFormSpec, {
			inputs: {
				value: ['option-1', 'option-3'],
				type: 'multiple',
			},
		});
		detectChanges();
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('data-state', 'on');
		expect(buttons[1]).toHaveAttribute('data-state', 'off');
		expect(buttons[2]).toHaveAttribute('data-state', 'on');
	});

	it('should initially select the button with the provided value (type = single) using ngModel', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveFormSpec, {
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

	it('should initially select the buttons with the provided values (type = multiple) using ngModel', async () => {
		const { getAllByRole, detectChanges } = await render(BrnToggleGroupDirectiveFormSpec, {
			inputs: {
				value: ['option-1', 'option-3'],
				type: 'multiple',
			},
		});
		detectChanges();
		const buttons = getAllByRole('button');

		expect(buttons[0]).toHaveAttribute('data-state', 'on');
		expect(buttons[1]).toHaveAttribute('data-state', 'off');
		expect(buttons[2]).toHaveAttribute('data-state', 'on');
	});
});
