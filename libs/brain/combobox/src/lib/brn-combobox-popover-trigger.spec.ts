import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { fireEvent, render } from '@testing-library/angular';
import { BrnComboboxPopoverTrigger } from './brn-combobox-popover-trigger';
import { BrnComboboxBaseToken } from './brn-combobox.token';

@Component({
	selector: 'brn-combobox-button-trigger-host',
	imports: [BrnComboboxPopoverTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button brnComboboxPopoverTrigger>trigger</button>
	`,
})
class ButtonTriggerHost {}

@Component({
	selector: 'brn-combobox-input-trigger-host',
	imports: [BrnComboboxPopoverTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input brnComboboxPopoverTrigger [closeOnTriggerClick]="false" />
	`,
})
class InputTriggerHost {}

const overlayStub = () => ({ toggle: vi.fn(), open: vi.fn() }) as unknown as BrnOverlay;
const comboboxStub = (disabled = false) => ({ disabledState: () => disabled });

const renderTrigger = async <T>(host: new () => T, overlay: BrnOverlay, disabled = false) =>
	render(host, {
		providers: [
			{ provide: BrnOverlay, useValue: overlay },
			{ provide: BrnComboboxBaseToken, useValue: comboboxStub(disabled) },
		],
	});

describe('BrnComboboxPopoverTrigger', () => {
	it('toggles the overlay on click when closeOnTriggerClick is true (button trigger)', async () => {
		const overlay = overlayStub();
		const view = await renderTrigger(ButtonTriggerHost, overlay);

		fireEvent.click(view.container.querySelector('button') as HTMLButtonElement);

		expect(overlay.toggle).toHaveBeenCalledTimes(1);
		expect(overlay.open).not.toHaveBeenCalled();
	});

	it('only opens the overlay on click when closeOnTriggerClick is false (input trigger)', async () => {
		const overlay = overlayStub();
		const view = await renderTrigger(InputTriggerHost, overlay);

		fireEvent.click(view.container.querySelector('input') as HTMLInputElement);

		expect(overlay.open).toHaveBeenCalledTimes(1);
		expect(overlay.toggle).not.toHaveBeenCalled();
	});

	it('does nothing on click when the combobox is disabled', async () => {
		const overlay = overlayStub();
		const view = await renderTrigger(ButtonTriggerHost, overlay, true);

		fireEvent.click(view.container.querySelector('button') as HTMLButtonElement);

		expect(overlay.toggle).not.toHaveBeenCalled();
		expect(overlay.open).not.toHaveBeenCalled();
	});

	it('keeps the behavior in sync with the closeOnTriggerClick input', async () => {
		const overlay = overlayStub();
		const view = await renderTrigger(ButtonTriggerHost, overlay);
		const trigger = view.fixture.debugElement
			.query(By.directive(BrnComboboxPopoverTrigger))
			.injector.get(BrnComboboxPopoverTrigger);

		// linkedSignal lets the behavior be flipped programmatically, not only via the input binding.
		trigger.closeOnTriggerClick.set(false);
		fireEvent.click(view.container.querySelector('button') as HTMLButtonElement);

		expect(overlay.open).toHaveBeenCalledTimes(1);
		expect(overlay.toggle).not.toHaveBeenCalled();
	});
});
