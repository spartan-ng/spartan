import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { render } from '@testing-library/angular';
import { HlmDatePickerImports } from '../../index';
import { HlmDatePicker } from '../hlm-date-picker';

@Component({
	selector: 'hlm-date-picker-trigger-id-host',
	imports: [HlmDatePickerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-date-picker>
			<button hlmDatePickerTrigger id="dp" data-testid="static">Pick a date</button>
		</hlm-date-picker>
		<hlm-date-picker>
			<button hlmDatePickerTrigger data-testid="generated">Pick a date</button>
		</hlm-date-picker>
	`,
})
class DatePickerTriggerIdHost {
	public readonly datePicker = viewChild.required(HlmDatePicker);
}

describe('HlmDatePickerTrigger id', () => {
	it('keeps a static id set by the consumer and uses it for labelling', async () => {
		const { getByTestId, fixture } = await render(DatePickerTriggerIdHost);

		expect(getByTestId('static')).toHaveAttribute('id', 'dp');
		expect(fixture.componentInstance.datePicker().labelableId()).toBe('dp');
	});

	it('generates an id when none is set', async () => {
		const { getByTestId } = await render(DatePickerTriggerIdHost);

		expect(getByTestId('generated').id).toMatch(/^hlm-date-picker-\d+$/);
	});
});
