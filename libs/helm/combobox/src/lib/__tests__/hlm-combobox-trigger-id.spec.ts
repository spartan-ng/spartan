import { ChangeDetectionStrategy, Component } from '@angular/core';
import { render } from '@testing-library/angular';
import { HlmComboboxImports } from '../../index';

@Component({
	selector: 'hlm-combobox-trigger-id-host',
	imports: [HlmComboboxImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox>
			<button hlmComboboxTrigger id="cb" data-testid="static">
				<hlm-combobox-value placeholder="Select" />
			</button>
		</hlm-combobox>
		<hlm-combobox>
			<button hlmComboboxTrigger data-testid="generated">
				<hlm-combobox-value placeholder="Select" />
			</button>
		</hlm-combobox>
	`,
})
class ComboboxTriggerIdHost {}

describe('HlmComboboxTrigger id', () => {
	it('keeps a static id set by the consumer', async () => {
		const { getByTestId } = await render(ComboboxTriggerIdHost);

		expect(getByTestId('static')).toHaveAttribute('id', 'cb');
	});

	it('generates an id when none is set', async () => {
		const { getByTestId } = await render(ComboboxTriggerIdHost);

		expect(getByTestId('generated').id).toMatch(/^hlm-combobox-trigger-\d+$/);
	});
});
