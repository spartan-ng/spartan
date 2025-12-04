import { Directive, effect, inject, input, untracked } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialog } from './brn-dialog';

@Directive({
	selector: '[brnDialogOverlay],brn-dialog-overlay',
	providers: [provideCustomClassSettableExisting(() => BrnDialogOverlay)],
})
export class BrnDialogOverlay {
	private readonly _brnDialog = inject(BrnDialog);

	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });

	constructor() {
		effect(() => {
			if (!this._brnDialog) return;
			const newClass = this.className();
			untracked(() => this._brnDialog.setOverlayClass(newClass));
		});
	}

	setClassToCustomElement(newClass: string) {
		this._brnDialog.setOverlayClass(newClass);
	}
}
