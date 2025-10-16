import { computed, Directive, effect, inject, input, TemplateRef, untracked } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialog } from './brn-dialog';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: '[brnDialogContent]',
	providers: [provideExposesStateProviderExisting(() => BrnDialogContent)],
})
export class BrnDialogContent<T> {
	private readonly _brnDialog = inject(BrnDialog, { optional: true });
	private readonly _brnDialogRef = inject(BrnDialogRef, { optional: true });
	private readonly _template = inject(TemplateRef);
	public readonly state = computed(() => this._brnDialog?.stateComputed() ?? this._brnDialogRef?.state() ?? 'closed');

	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });

	public readonly context = input<T | undefined>(undefined);

	constructor() {
		if (!this._brnDialog) return;
		this._brnDialog.registerTemplate(this._template);
		effect(() => {
			const context = this.context();
			if (!this._brnDialog || !context) return;
			untracked(() => this._brnDialog?.setContext(context));
		});
		effect(() => {
			if (!this._brnDialog) return;
			const newClass = this.className();
			untracked(() => this._brnDialog?.setPanelClass(newClass));
		});
	}
}
