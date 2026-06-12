import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { BrnAlertDialog } from './brn-alert-dialog';
import { BrnAlertDialogContent } from './brn-alert-dialog-content';

@Component({
	selector: 'brn-alert-dialog-reopen-host',
	imports: [BrnAlertDialog, BrnAlertDialogContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-alert-dialog>
			<div *brnAlertDialogContent>content</div>
		</brn-alert-dialog>
	`,
})
class AlertDialogReopenHost {}

// The dialog defers the actual CDK teardown until `closeDelay` (default 100ms)
// after close() so the exit animation can play. Wait comfortably past it.
const waitPastCloseDelay = () => new Promise((resolve) => setTimeout(resolve, 250));

describe('BrnAlertDialog reopen during close', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	const setup = async () => {
		const view = await render(AlertDialogReopenHost);
		view.detectChanges();
		await view.fixture.whenStable();
		view.detectChanges();
		const dialog = view.fixture.debugElement.query(By.directive(BrnAlertDialog)).injector.get(BrnAlertDialog);
		return { view, dialog };
	};

	it('stays open when re-opened within the close-delay window', async () => {
		const { dialog } = await setup();

		dialog.open();
		expect(dialog.stateComputed()).toBe('open');

		// Begin closing - the CDK teardown is now scheduled but has NOT run yet.
		dialog.close();
		expect(dialog.stateComputed()).toBe('closed');

		// Re-open before the teardown fires. Regression: open() used to early-return
		// because the still-present dialog ref tripped its guard, so the re-open was
		// swallowed and the dialog finished closing (the intermittent "flicker").
		dialog.open();
		expect(dialog.stateComputed()).toBe('open');

		// The originally scheduled close must have been cancelled - the dialog stays
		// open past the delay rather than disappearing.
		await waitPastCloseDelay();
		expect(dialog.stateComputed()).toBe('open');
	});

	it('still closes normally when not interrupted', async () => {
		const { dialog } = await setup();

		dialog.open();
		expect(dialog.stateComputed()).toBe('open');

		dialog.close();
		await waitPastCloseDelay();
		expect(dialog.stateComputed()).toBe('closed');
	});
});
