import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialogComponent } from './brn-dialog.component';

@Component({
	selector: 'brn-dialog-overlay',
	standalone: true,
	template: '',
	providers: [provideCustomClassSettableExisting(() => BrnDialogOverlayComponent)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnDialogOverlayComponent {
	private readonly _brnDialog = inject(BrnDialogComponent);

	@Input()
	public set class(newClass: string | null | undefined) {
		this._brnDialog.setOverlayClass(newClass);
	}

	setClassToCustomElement(newClass: string) {
		this._brnDialog.setOverlayClass(newClass);
	}
}
