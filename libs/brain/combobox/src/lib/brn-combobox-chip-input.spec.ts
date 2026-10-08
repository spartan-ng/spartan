import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { Subject } from 'rxjs';
import { BrnComboboxChipInput } from './brn-combobox-chip-input';
import { BrnComboboxBaseToken } from './brn-combobox.token';

interface PartialControlState {
	invalid?: boolean;
	spartanInvalid?: boolean;
	touched?: boolean;
	dirty?: boolean;
}

interface KeyManagerStub {
	change: Subject<void>;
	activeItem: { id: () => string } | undefined;
	activeItemIndex: number;
	onKeydown: ReturnType<typeof vi.fn>;
}

/** Minimal stand-in for the CDK ActiveDescendantKeyManager used by BrnComboboxChipInput. */
function keyManagerStub(): KeyManagerStub {
	return {
		change: new Subject<void>(),
		activeItem: undefined,
		activeItemIndex: -1,
		onKeydown: vi.fn(),
	};
}

function comboboxStub(options: { expanded?: boolean; listId?: string; state?: PartialControlState | null } = {}) {
	const value = signal<string[] | null>(null);
	const isExpanded = signal(options.expanded ?? false);
	return {
		value,
		search: signal(''),
		isExpanded,
		disabledState: signal(false),
		itemToString: signal(undefined),
		mode: signal('combobox'),
		listId: signal<string | undefined>(options.listId),
		hasValue: computed(() => (value() ?? []).length > 0),
		keyManager: keyManagerStub(),
		controlState: signal(
			options.state !== null && options.state !== undefined
				? { dirty: false, errors: null, invalid: false, spartanInvalid: false, touched: false, ...options.state }
				: null,
		),
		selectActiveItem: vi.fn(),
		close: vi.fn(() => isExpanded.set(false)),
		open: vi.fn(() => isExpanded.set(true)),
		resetValue: vi.fn(),
		removeLastSelectedItem: vi.fn(),
		registerComboboxChipInput: vi.fn(),
	};
}

@Component({
	selector: 'brn-combobox-chip-input-host',
	imports: [BrnComboboxChipInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input aria-label="Test" brnComboboxChipInput />
	`,
})
class ComboboxChipInputHost {}

const renderChipInput = async (combobox: ReturnType<typeof comboboxStub>) =>
	render(ComboboxChipInputHost, {
		providers: [{ provide: BrnComboboxBaseToken, useValue: combobox }],
	});

describe('BrnComboboxChipInput', () => {
	describe('form-state attributes', () => {
		it('sets aria-invalid and data-invalid when the control is invalid', async () => {
			await renderChipInput(comboboxStub({ state: { invalid: true } }));
			const input = screen.getByLabelText('Test');
			expect(input).toHaveAttribute('aria-invalid', 'true');
			expect(input).toHaveAttribute('data-invalid', 'true');
		});

		it('omits aria-invalid and data-invalid when the control is valid', async () => {
			await renderChipInput(comboboxStub({ state: { invalid: false } }));
			const input = screen.getByLabelText('Test');
			expect(input).not.toHaveAttribute('aria-invalid');
			expect(input).not.toHaveAttribute('data-invalid');
		});

		it('sets data-matches-spartan-invalid when spartanInvalid is true', async () => {
			await renderChipInput(comboboxStub({ state: { spartanInvalid: true } }));
			expect(screen.getByLabelText('Test')).toHaveAttribute('data-matches-spartan-invalid', 'true');
		});

		it('sets data-touched and data-dirty when the control is touched/dirty', async () => {
			await renderChipInput(comboboxStub({ state: { touched: true, dirty: true } }));
			const input = screen.getByLabelText('Test');
			expect(input).toHaveAttribute('data-touched', 'true');
			expect(input).toHaveAttribute('data-dirty', 'true');
		});
	});

	describe('accessibility', () => {
		it('links the input to the listbox via aria-controls while expanded', async () => {
			const combobox = comboboxStub({ expanded: true, listId: 'brn-combobox-list-1' });
			await renderChipInput(combobox);
			expect(screen.getByLabelText('Test')).toHaveAttribute('aria-controls', 'brn-combobox-list-1');
		});

		it('omits aria-controls while collapsed', async () => {
			const combobox = comboboxStub({ expanded: false, listId: 'brn-combobox-list-1' });
			await renderChipInput(combobox);
			expect(screen.getByLabelText('Test')).not.toHaveAttribute('aria-controls');
		});

		it('exposes the active option via aria-activedescendant while expanded', async () => {
			const combobox = comboboxStub({ expanded: true });
			const { fixture } = await renderChipInput(combobox);
			const input = screen.getByLabelText('Test');

			combobox.keyManager.activeItem = { id: () => 'brn-combobox-item-1' };
			combobox.keyManager.change.next();
			fixture.detectChanges();

			expect(input).toHaveAttribute('aria-activedescendant', 'brn-combobox-item-1');
		});

		it('updates aria-activedescendant as the highlight moves', async () => {
			const combobox = comboboxStub({ expanded: true });
			const { fixture } = await renderChipInput(combobox);
			const input = screen.getByLabelText('Test');

			combobox.keyManager.activeItem = { id: () => 'brn-combobox-item-1' };
			combobox.keyManager.change.next();
			fixture.detectChanges();
			expect(input).toHaveAttribute('aria-activedescendant', 'brn-combobox-item-1');

			combobox.keyManager.activeItem = { id: () => 'brn-combobox-item-2' };
			combobox.keyManager.change.next();
			fixture.detectChanges();
			expect(input).toHaveAttribute('aria-activedescendant', 'brn-combobox-item-2');
		});

		it('omits aria-activedescendant while collapsed', async () => {
			const combobox = comboboxStub({ expanded: false });
			const { fixture } = await renderChipInput(combobox);
			const input = screen.getByLabelText('Test');

			combobox.keyManager.activeItem = { id: () => 'brn-combobox-item-1' };
			combobox.keyManager.change.next();
			fixture.detectChanges();

			expect(input).not.toHaveAttribute('aria-activedescendant');
		});
	});

	describe('keyboard interactions', () => {
		it('selects the active item on Enter', async () => {
			const combobox = comboboxStub({ expanded: true });
			await renderChipInput(combobox);
			const input = screen.getByLabelText('Test');

			input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));

			expect(combobox.selectActiveItem).toHaveBeenCalledTimes(1);
		});

		it('removes the last selected chip on Backspace when the search is empty', async () => {
			const combobox = comboboxStub({ expanded: true });
			await renderChipInput(combobox);
			const input = screen.getByLabelText('Test');

			input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));

			expect(combobox.removeLastSelectedItem).toHaveBeenCalledTimes(1);
		});
	});
});
