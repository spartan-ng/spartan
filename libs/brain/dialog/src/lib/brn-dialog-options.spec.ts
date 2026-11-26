import { DEFAULT_DIALOG_CONFIG, Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnDialog } from './brn-dialog';
import { BrnDialogContent } from './brn-dialog-content';
import { BrnDialogService } from './brn-dialog.service';

@Component({
	imports: [BrnDialog, BrnDialogContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-dialog>
			<p *brnDialogContent>Declarative dialog content</p>
		</brn-dialog>
	`,
})
class DialogHost {
	public readonly dialog = viewChild.required(BrnDialog);
}

describe('BrnDialog options', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('emits openChangeComplete(false) when the CDK closes the dialog itself', () => {
		const fixture = TestBed.createComponent(DialogHost);
		fixture.detectChanges();
		const dialog = fixture.componentInstance.dialog();
		const openChangeComplete = vi.fn();
		dialog.openChangeComplete.subscribe(openChangeComplete);

		dialog.open();
		fixture.detectChanges();
		TestBed.inject(Dialog).closeAll();

		expect(openChangeComplete).toHaveBeenLastCalledWith(false);
	});

	it('keeps the CDK default dialog size when no size is given', () => {
		TestBed.configureTestingModule({
			providers: [{ provide: DEFAULT_DIALOG_CONFIG, useValue: { width: '500px', height: '300px' } }],
		});
		TestBed.inject(BrnDialogService).open(DialogHost);

		const pane = document.querySelector('.cdk-overlay-pane') as HTMLElement;
		expect(pane.style.width).toBe('500px');
		expect(pane.style.height).toBe('300px');
	});
});
