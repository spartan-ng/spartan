import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { fireEvent, render } from '@testing-library/angular';
import { BrnDialog } from './brn-dialog';
import { BrnDialogContent } from './brn-dialog-content';

const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'brn-dialog-dismiss-host',
	imports: [BrnDialog, BrnDialogContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-dialog [disableClose]="disableClose()" [closeOnOutsidePointerEvents]="closeOnOutsidePointerEvents()">
			<ng-template brnDialogContent>
				<span data-testid="content">content</span>
			</ng-template>
		</brn-dialog>
	`,
})
class DialogDismissHost {
	public readonly disableClose = signal(false);
	public readonly closeOnOutsidePointerEvents = signal(true);
}

type View = Awaited<ReturnType<typeof render<DialogDismissHost>>>;

const dialogOf = (view: View) => view.fixture.debugElement.query(By.directive(BrnDialog)).injector.get(BrnDialog);
const backdrop = () => document.querySelector('.cdk-overlay-backdrop') as HTMLElement | null;

const pressEscape = async (view: View) => {
	// CDK's OverlayKeyboardDispatcher listens on document.body and forwards to the topmost overlay.
	fireEvent.keyDown(document.body, { key: 'Escape' });
	view.detectChanges();
	await flush();
};

const clickBackdrop = async (view: View) => {
	const element = backdrop();
	expect(element).toBeTruthy();
	fireEvent.click(element as HTMLElement);
	view.detectChanges();
	await flush();
};

const openDialog = async (view: View) => {
	dialogOf(view).open();
	view.detectChanges();
	await flush();
	expect(dialogOf(view).stateComputed()).toBe('open');
};

const setInputs = async (
	view: View,
	inputs: { disableClose?: boolean; closeOnOutsidePointerEvents?: boolean },
): Promise<void> => {
	const host = view.fixture.componentInstance;
	if (inputs.disableClose !== undefined) host.disableClose.set(inputs.disableClose);
	if (inputs.closeOnOutsidePointerEvents !== undefined) {
		host.closeOnOutsidePointerEvents.set(inputs.closeOnOutsidePointerEvents);
	}
	view.detectChanges();
	await flush();
};

describe('BrnDialog dismissal options while open (issue #1682)', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('blocks Escape once disableClose turns on after the dialog opened', async () => {
		const view = await render(DialogDismissHost);
		await openDialog(view);

		await setInputs(view, { disableClose: true });
		await pressEscape(view);
		expect(dialogOf(view).stateComputed()).toBe('open');

		await setInputs(view, { disableClose: false });
		await pressEscape(view);
		expect(dialogOf(view).stateComputed()).toBe('closed');
	});

	it('blocks backdrop clicks once disableClose turns on after the dialog opened', async () => {
		const view = await render(DialogDismissHost);
		await openDialog(view);

		await setInputs(view, { disableClose: true });
		await clickBackdrop(view);
		expect(dialogOf(view).stateComputed()).toBe('open');

		await setInputs(view, { disableClose: false });
		await clickBackdrop(view);
		expect(dialogOf(view).stateComputed()).toBe('closed');
	});

	it('allows Escape once disableClose turns off after opening with it on', async () => {
		const view = await render(DialogDismissHost);
		await setInputs(view, { disableClose: true });
		await openDialog(view);

		await pressEscape(view);
		expect(dialogOf(view).stateComputed()).toBe('open');

		await setInputs(view, { disableClose: false });
		await pressEscape(view);
		expect(dialogOf(view).stateComputed()).toBe('closed');
	});

	it('honours a closeOnOutsidePointerEvents change after the dialog opened', async () => {
		const view = await render(DialogDismissHost);
		await openDialog(view);

		await setInputs(view, { closeOnOutsidePointerEvents: false });
		await clickBackdrop(view);
		expect(dialogOf(view).stateComputed()).toBe('open');

		// Escape is unaffected by closeOnOutsidePointerEvents.
		await pressEscape(view);
		expect(dialogOf(view).stateComputed()).toBe('closed');
	});

	it('still lets programmatic close() through while disableClose is on', async () => {
		const view = await render(DialogDismissHost);
		await openDialog(view);

		await setInputs(view, { disableClose: true });
		dialogOf(view).close();
		view.detectChanges();
		await flush();
		expect(dialogOf(view).stateComputed()).toBe('closed');
	});
});
