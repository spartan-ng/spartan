import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnDialog } from './brn-dialog';
import { BrnDialogContent } from './brn-dialog-content';
import { BrnDialogService } from './brn-dialog.service';

@Component({
	imports: [BrnDialog, BrnDialogContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-dialog [trapFocus]="false" closeOnFocusOut>
			<p *brnDialogContent>Declarative dialog content</p>
		</brn-dialog>
	`,
})
class FocusOptionsHost {
	public readonly dialog = viewChild.required(BrnDialog);
}

describe('BrnDialog options', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('passes the trapFocus and closeOnFocusOut inputs to the dialog service', () => {
		const open = vi.spyOn(TestBed.inject(BrnDialogService), 'open');
		const fixture = TestBed.createComponent(FocusOptionsHost);
		fixture.detectChanges();

		fixture.componentInstance.dialog().open();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ trapFocus: false, closeOnFocusOut: true }),
		);
	});

	it('keeps the CDK default dialog size when no size is given', () => {
		TestBed.configureTestingModule({
			providers: [{ provide: DEFAULT_DIALOG_CONFIG, useValue: { width: '500px', height: '300px' } }],
		});
		TestBed.inject(BrnDialogService).open(FocusOptionsHost);

		const pane = document.querySelector('.cdk-overlay-pane') as HTMLElement;
		expect(pane.style.width).toBe('500px');
		expect(pane.style.height).toBe('300px');
	});
});
