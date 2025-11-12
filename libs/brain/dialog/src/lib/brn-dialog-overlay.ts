import { ChangeDetectionStrategy, Component, effect, inject, input, untracked } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialog } from './brn-dialog';

@Component({
	selector: 'brn-dialog-overlay',
	providers: [provideCustomClassSettableExisting(() => BrnDialogOverlay)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
})
export class BrnDialogOverlay {
	private readonly _brnDialog = inject(BrnDialog);

	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });

	setClassToCustomElement(newClass: string) {
		this._brnDialog.setOverlayClass(newClass);
	}
	constructor() {
		effect(() => {
			if (!this._brnDialog) return;
			const newClass = this.className();
			untracked(() => this._brnDialog.setOverlayClass(newClass));
		});
	}
}
