import { ChangeDetectionStrategy, Component, type Type, input, viewChild } from '@angular/core';
import { render } from '@testing-library/angular';
import { HlmDatePickerImports } from '../../index';
import { HlmDatePicker } from '../hlm-date-picker';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-date-picker-align-host',
	imports: [HlmDatePickerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-date-picker [align]="align()">
			<hlm-date-picker-input style="display: block; width: 400px" />
		</hlm-date-picker>
	`,
})
class DatePickerAlignHost {
	public readonly align = input<'start' | 'center' | 'end'>('center');
	public readonly datePicker = viewChild.required(HlmDatePicker);
}

@Component({
	selector: 'hlm-date-picker-default-align-host',
	imports: [HlmDatePickerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-date-picker>
			<hlm-date-picker-input style="display: block; width: 400px" />
		</hlm-date-picker>
	`,
})
class DatePickerDefaultAlignHost {
	public readonly datePicker = viewChild.required(HlmDatePicker);
}

describe('HlmDatePicker popup alignment', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	const openAndMeasure = async (
		host: Type<DatePickerAlignHost | DatePickerDefaultAlignHost>,
		inputs?: { align: 'start' | 'center' | 'end' },
	) => {
		const view = await render(host, { inputs });

		view.fixture.componentInstance.datePicker().open();
		view.detectChanges();
		await flush();
		view.detectChanges();

		const trigger = view.container.querySelector('hlm-date-picker-input') as HTMLElement;
		const pane = document.querySelector('.cdk-overlay-pane') as HTMLElement;
		expect(pane).toBeTruthy();
		return { trigger: trigger.getBoundingClientRect(), pane: pane.getBoundingClientRect() };
	};

	it('aligns the popup with the start of the trigger', async () => {
		const { trigger, pane } = await openAndMeasure(DatePickerAlignHost, { align: 'start' });
		expect(Math.abs(pane.left - trigger.left)).toBeLessThanOrEqual(1);
	});

	it('aligns the popup with the end of the trigger', async () => {
		const { trigger, pane } = await openAndMeasure(DatePickerAlignHost, { align: 'end' });
		expect(Math.abs(pane.right - trigger.right)).toBeLessThanOrEqual(1);
	});

	it('centers the popup on the trigger by default', async () => {
		const { trigger, pane } = await openAndMeasure(DatePickerDefaultAlignHost);
		const triggerCenter = trigger.left + trigger.width / 2;
		const paneCenter = pane.left + pane.width / 2;
		expect(Math.abs(paneCenter - triggerCenter)).toBeLessThanOrEqual(1);
	});
});
