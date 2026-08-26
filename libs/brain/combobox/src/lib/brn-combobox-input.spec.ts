import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { fireEvent, render, screen } from '@testing-library/angular';
import { BrnComboboxContent } from './brn-combobox-content';
import { BrnComboboxInput } from './brn-combobox-input';
import { BrnComboboxBaseToken } from './brn-combobox.token';

type SimpleValue = string | number | boolean | null | undefined;

interface PartialControlState {
	invalid?: boolean;
	spartanInvalid?: boolean;
	touched?: boolean;
	dirty?: boolean;
}

function comboboxStub(initialValue: SimpleValue = null, state: PartialControlState | null = null) {
	const value = signal<SimpleValue>(initialValue);
	return {
		value,
		search: signal(''),
		isExpanded: signal(false),
		disabledState: signal(false),
		itemToString: signal(undefined),
		mode: signal('combobox'),
		listId: signal<string | undefined>(undefined),
		hasValue: computed(() => value() !== undefined && value() !== null && value() !== ''),
		controlState: signal(
			state !== null
				? { dirty: false, errors: null, invalid: false, spartanInvalid: false, touched: false, ...state }
				: null,
		),
	};
}

@Component({
	selector: 'brn-combobox-input-host',
	imports: [BrnComboboxInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input aria-label="Test" brnComboboxInput />
	`,
})
class ComboboxInputHost {}

const renderInput = async (combobox: ReturnType<typeof comboboxStub>) =>
	render(ComboboxInputHost, {
		providers: [{ provide: BrnComboboxBaseToken, useValue: combobox }],
	});

/** Renders the input in popup mode by faking the presence of BrnComboboxContent via DI. */
const renderInputInPopup = async (combobox: ReturnType<typeof comboboxStub>) =>
	render(ComboboxInputHost, {
		providers: [
			{ provide: BrnComboboxBaseToken, useValue: combobox },
			{ provide: BrnComboboxContent, useValue: {} },
		],
	});

function keyboardComboboxStub(options: { expanded?: boolean } = {}) {
	const value = signal<SimpleValue>(null);
	const isExpanded = signal(options.expanded ?? false);
	const selectActiveItem = vi.fn(() => {
		if (isExpanded()) {
			isExpanded.set(false);
		}
	});
	return {
		value,
		search: signal(''),
		isExpanded,
		disabledState: signal(false),
		itemToString: signal(undefined),
		mode: signal('combobox'),
		listId: signal<string | undefined>(undefined),
		hasValue: computed(() => value() !== undefined && value() !== null && value() !== ''),
		controlState: signal(null),
		keyManager: { onKeydown: vi.fn() },
		selectActiveItem,
		close: vi.fn(() => isExpanded.set(false)),
		open: vi.fn(() => isExpanded.set(true)),
		resetValue: vi.fn(),
		registerComboboxInput: vi.fn(),
	};
}

describe('BrnComboboxInput', () => {
	describe('value display', () => {
		it('displays the label of a string value', async () => {
			const combobox = comboboxStub('angular');
			await renderInput(combobox);
			const input = screen.getByLabelText('Test') as HTMLInputElement;
			expect(input.value).toBe('angular');
		});

		it('displays the label of a numeric value (including 0)', async () => {
			const combobox = comboboxStub(0);
			await renderInput(combobox);
			const input = screen.getByLabelText('Test') as HTMLInputElement;
			expect(input.value).toBe('0');
		});

		it('displays the label of a boolean false value', async () => {
			const combobox = comboboxStub(false);
			await renderInput(combobox);
			const input = screen.getByLabelText('Test') as HTMLInputElement;
			expect(input.value).toBe('false');
		});

		it('does not display a label for null value', async () => {
			const combobox = comboboxStub(null);
			await renderInput(combobox);
			const input = screen.getByLabelText('Test') as HTMLInputElement;
			expect(input.value).toBe('');
		});

		it('does not display a label for undefined value', async () => {
			const combobox = comboboxStub(undefined);
			await renderInput(combobox);
			const input = screen.getByLabelText('Test') as HTMLInputElement;
			expect(input.value).toBe('');
		});
	});

	describe('form-state attributes in combobox mode', () => {
		it('sets aria-invalid and data-invalid when the control is invalid', async () => {
			await renderInput(comboboxStub(null, { invalid: true }));
			const input = screen.getByLabelText('Test');
			expect(input).toHaveAttribute('aria-invalid', 'true');
			expect(input).toHaveAttribute('data-invalid', 'true');
		});

		it('omits aria-invalid and data-invalid when the control is valid', async () => {
			await renderInput(comboboxStub(null, { invalid: false }));
			const input = screen.getByLabelText('Test');
			expect(input).not.toHaveAttribute('aria-invalid');
			expect(input).not.toHaveAttribute('data-invalid');
		});

		it('sets data-matches-spartan-invalid when spartanInvalid is true', async () => {
			await renderInput(comboboxStub(null, { spartanInvalid: true }));
			expect(screen.getByLabelText('Test')).toHaveAttribute('data-matches-spartan-invalid', 'true');
		});

		it('omits data-matches-spartan-invalid when spartanInvalid is false', async () => {
			await renderInput(comboboxStub(null, { spartanInvalid: false }));
			expect(screen.getByLabelText('Test')).not.toHaveAttribute('data-matches-spartan-invalid');
		});

		it('sets data-touched when the control is touched', async () => {
			await renderInput(comboboxStub(null, { touched: true }));
			expect(screen.getByLabelText('Test')).toHaveAttribute('data-touched', 'true');
		});

		it('omits data-touched when the control is not touched', async () => {
			await renderInput(comboboxStub(null, { touched: false }));
			expect(screen.getByLabelText('Test')).not.toHaveAttribute('data-touched');
		});

		it('sets data-dirty when the control is dirty', async () => {
			await renderInput(comboboxStub(null, { dirty: true }));
			expect(screen.getByLabelText('Test')).toHaveAttribute('data-dirty', 'true');
		});

		it('omits data-dirty when the control is not dirty', async () => {
			await renderInput(comboboxStub(null, { dirty: false }));
			expect(screen.getByLabelText('Test')).not.toHaveAttribute('data-dirty');
		});

		it('omits all form-state attributes when controlState is null', async () => {
			await renderInput(comboboxStub(null, null));
			const input = screen.getByLabelText('Test');
			expect(input).not.toHaveAttribute('aria-invalid');
			expect(input).not.toHaveAttribute('data-invalid');
			expect(input).not.toHaveAttribute('data-matches-spartan-invalid');
			expect(input).not.toHaveAttribute('data-touched');
			expect(input).not.toHaveAttribute('data-dirty');
		});
	});

	describe('form-state attributes suppressed in popup mode (inside BrnComboboxContent)', () => {
		it('does not set aria-invalid or data-invalid even when the control is invalid', async () => {
			await renderInputInPopup(comboboxStub(null, { invalid: true }));
			const input = screen.getByLabelText('Test');
			expect(input).not.toHaveAttribute('aria-invalid');
			expect(input).not.toHaveAttribute('data-invalid');
		});

		it('does not set data-matches-spartan-invalid even when spartanInvalid is true', async () => {
			await renderInputInPopup(comboboxStub(null, { spartanInvalid: true }));
			expect(screen.getByLabelText('Test')).not.toHaveAttribute('data-matches-spartan-invalid');
		});

		it('does not set data-touched even when the control is touched', async () => {
			await renderInputInPopup(comboboxStub(null, { touched: true }));
			expect(screen.getByLabelText('Test')).not.toHaveAttribute('data-touched');
		});

		it('does not set data-dirty even when the control is dirty', async () => {
			await renderInputInPopup(comboboxStub(null, { dirty: true }));
			expect(screen.getByLabelText('Test')).not.toHaveAttribute('data-dirty');
		});
	});

	describe('keyboard selection', () => {
		it('does not re-open the popover on the Enter that selects and closes an item', async () => {
			const combobox = keyboardComboboxStub({ expanded: true });
			await renderInputInPopup(combobox);
			const input = screen.getByLabelText('Test');

			fireEvent.keyDown(input, { key: 'Enter' });

			expect(combobox.selectActiveItem).toHaveBeenCalledTimes(1);
			expect(combobox.open).not.toHaveBeenCalled();
			expect(combobox.isExpanded()).toBe(false);
		});

		it('opens a collapsed combobox on Enter', async () => {
			const combobox = keyboardComboboxStub({ expanded: false });
			await renderInputInPopup(combobox);
			const input = screen.getByLabelText('Test');

			fireEvent.keyDown(input, { key: 'Enter' });

			expect(combobox.open).toHaveBeenCalledTimes(1);
			expect(combobox.isExpanded()).toBe(true);
		});
	});
});
