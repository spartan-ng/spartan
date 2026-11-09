import { Component, signal, viewChild } from '@angular/core';
import { BrnPopover, BrnPopoverContent, provideBrnPopoverDefaultOptions } from '@spartan-ng/brain/popover';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnSelect } from './brn-select';
import { BrnSelectContent } from './brn-select-content';
import { BrnSelectItem } from './brn-select-item';
import { BrnSelectList } from './brn-select-list';
import { BrnSelectTrigger } from './brn-select-trigger';

@Component({
	imports: [BrnPopover, BrnPopoverContent, BrnSelect, BrnSelectContent, BrnSelectItem, BrnSelectList, BrnSelectTrigger],
	providers: [provideBrnPopoverDefaultOptions({ role: null })],
	template: `
		<div brnPopover brnSelect [disabled]="disabled()" [value]="value()" (valueChange)="onChange($event)">
			<button brnSelectTrigger>{{ value() }}</button>
			<ng-template brnPopoverContent>
				<div brnSelectContent>
					<div brnSelectList>
						<div brnSelectItem value="apple">Apple</div>
						<div brnSelectItem value="orange">Orange</div>
					</div>
				</div>
			</ng-template>
		</div>
	`,
})
class SelectHost {
	public readonly disabled = signal(false);
	public readonly value = signal('apple');
	public readonly select = viewChild.required(BrnSelect);
	public readonly onChange = vi.fn((value: string) => this.value.set(value));
}

describe('BrnSelect disabled while open', () => {
	it.each(['input', 'form control'])('ignores option clicks after disabling through its %s', async (source) => {
		const view = await render(SelectHost);
		const host = view.fixture.componentInstance;
		const user = userEvent.setup();
		const trigger = screen.getByRole('combobox');

		await user.click(trigger);
		const orange = await screen.findByRole('option', { name: 'Orange' });

		if (source === 'input') {
			host.disabled.set(true);
		} else {
			host.select().setDisabledState(true);
		}
		view.detectChanges();

		expect(trigger).toBeDisabled();
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await user.click(orange);
		expect(host.value()).toBe('apple');
		expect(host.onChange).not.toHaveBeenCalled();
		expect(orange).toHaveAttribute('aria-disabled', 'true');
	});
});
