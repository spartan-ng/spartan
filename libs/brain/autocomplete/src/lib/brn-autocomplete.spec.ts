import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { BrnPopover, BrnPopoverContent, provideBrnPopoverDefaultOptions } from '@spartan-ng/brain/popover';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnAutocomplete } from './brn-autocomplete';
import { BrnAutocompleteContent } from './brn-autocomplete-content';
import { BrnAutocompleteInput } from './brn-autocomplete-input';
import { BrnAutocompleteItem } from './brn-autocomplete-item';
import { BrnAutocompleteList } from './brn-autocomplete-list';

@Component({
	imports: [
		BrnPopover,
		BrnPopoverContent,
		BrnAutocomplete,
		BrnAutocompleteContent,
		BrnAutocompleteItem,
		BrnAutocompleteList,
		BrnAutocompleteInput,
	],
	providers: [provideBrnPopoverDefaultOptions({ role: null })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnPopover brnAutocomplete [disabled]="disabled()" [value]="value()" (valueChange)="onChange($event)">
			<input brnAutocompleteInput aria-label="Fruit" />
			<ng-template brnPopoverContent>
				<div brnAutocompleteContent>
					<div brnAutocompleteList>
						<div brnAutocompleteItem value="apple">Apple</div>
						<div brnAutocompleteItem value="orange">Orange</div>
					</div>
				</div>
			</ng-template>
		</div>
	`,
})
class AutocompleteHost {
	public readonly disabled = signal(false);
	public readonly value = signal('apple');
	public readonly autocomplete = viewChild.required(BrnAutocomplete);
	public readonly onChange = vi.fn((value: string) => this.value.set(value));
}

describe('BrnAutocomplete disabled while open', () => {
	it.each(['input', 'form control'])('ignores option clicks after disabling through its %s', async (source) => {
		const view = await render(AutocompleteHost);
		const host = view.fixture.componentInstance;
		const user = userEvent.setup();
		const trigger = screen.getByRole('combobox');

		await user.click(trigger);
		await user.keyboard('{ArrowDown}');
		const orange = await screen.findByRole('option', { name: 'Orange' });

		if (source === 'input') {
			host.disabled.set(true);
		} else {
			host.autocomplete().setDisabledState(true);
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
