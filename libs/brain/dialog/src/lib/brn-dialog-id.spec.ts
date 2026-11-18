import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnDialog } from './brn-dialog';
import { BrnDialogContent } from './brn-dialog-content';
import { BrnDialogService } from './brn-dialog.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p>Service dialog content</p>
	`,
})
class DialogContent {}

@Component({
	imports: [BrnDialog, BrnDialogContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-dialog>
			<p *brnDialogContent>Declarative dialog content</p>
		</brn-dialog>
	`,
})
class DeclarativeDialogHost {
	public readonly dialog = viewChild.required(BrnDialog);
}

describe('BrnDialog ids', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('generates distinct ids for dialogs opened via the service and declaratively', () => {
		const serviceDialog = TestBed.inject(BrnDialogService).open(DialogContent);

		const fixture = TestBed.createComponent(DeclarativeDialogHost);
		fixture.detectChanges();
		const declarativeDialog = fixture.componentInstance.dialog();

		expect(declarativeDialog.id()).not.toBe(serviceDialog.id);
		expect(() => declarativeDialog.open()).not.toThrow();
		expect(declarativeDialog.stateComputed()).toBe('open');
		expect(serviceDialog.state()).toBe('open');
	});
});
