import { computed, Directive, inject, input, signal } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDialog } from './brn-dialog';

@Directive({
	selector: '[brnDialogOverlay],brn-dialog-overlay',
	providers: [provideCustomClassSettableExisting(() => BrnDialogOverlay)],
})
export class BrnDialogOverlay {
	private readonly _brnDialog = inject(BrnDialog);
	private readonly _customClass = signal<string | undefined>(undefined);

	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });
	private readonly _resolvedClass = computed(() => this._customClass() ?? this.className());

	constructor() {
		this._brnDialog.registerOverlayClass(this._resolvedClass);
	}

	public setClassToCustomElement(newClass: string): void {
		this._customClass.set(newClass);
	}
}
