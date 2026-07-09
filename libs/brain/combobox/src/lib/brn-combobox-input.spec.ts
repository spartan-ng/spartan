import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { BrnComboboxInput } from './brn-combobox-input';
import { BrnComboboxBaseToken } from './brn-combobox.token';

type SimpleValue = string | number | boolean | null | undefined;

function comboboxStub(initialValue: SimpleValue = null) {
	const value = signal<SimpleValue>(initialValue);
	return {
		value,
		search: signal(''),
		isExpanded: signal(false),
		disabledState: signal(false),
		itemToString: signal(undefined),
		mode: signal('combobox'),
		hasValue: signal(false),
		controlState: signal(null),
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

describe('BrnComboboxInput', () => {
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
});
