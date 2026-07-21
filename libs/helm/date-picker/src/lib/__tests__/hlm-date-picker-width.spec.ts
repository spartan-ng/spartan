import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { render } from '@testing-library/angular';
import { HlmDatePickerImports } from '../../index';
import { HlmDatePicker } from '../hlm-date-picker';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-date-picker-input-width-host',
	imports: [HlmDatePickerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-date-picker>
			<hlm-date-picker-input style="display: block; width: 400px" />
		</hlm-date-picker>
	`,
})
class DatePickerInputWidthHost {
	public readonly datePicker = viewChild.required(HlmDatePicker);
}

@Component({
	selector: 'hlm-date-picker-trigger-width-host',
	imports: [HlmDatePickerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-date-picker>
			<hlm-date-picker-trigger>Pick date</hlm-date-picker-trigger>
		</hlm-date-picker>
	`,
})
class DatePickerTriggerWidthHost {}

describe('HlmDatePicker popup width', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('exposes the input control width to the popup so it can match it', async () => {
		const view = await render(DatePickerInputWidthHost);

		view.fixture.componentInstance.datePicker().open();
		view.detectChanges();
		await flush();
		view.detectChanges();

		const content = document.querySelector('hlm-popover-content') as HTMLElement;
		expect(content).toBeTruthy();
		expect(content.style.getPropertyValue('--brn-popover-trigger-width')).toBe('400px');
		expect(content.classList).toContain('min-w-(--brn-popover-trigger-width)');
	});

	it('exposes the trigger button width to the popup so it can match it', async () => {
		const view = await render(DatePickerTriggerWidthHost);
		const button = view.container.querySelector('hlm-date-picker-trigger button') as HTMLButtonElement;
		button.style.width = '360px';

		button.click();
		view.detectChanges();
		await flush();
		view.detectChanges();

		const content = document.querySelector('hlm-popover-content') as HTMLElement;
		expect(content).toBeTruthy();
		expect(content.style.getPropertyValue('--brn-popover-trigger-width')).toBe('360px');
		expect(content.classList).toContain('min-w-(--brn-popover-trigger-width)');
	});
});
