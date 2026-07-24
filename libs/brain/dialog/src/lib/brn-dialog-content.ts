import { computed, Directive, inject, input, TemplateRef } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialog } from './brn-dialog';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: '[brnDialogContent]',
	providers: [provideExposesStateProviderExisting(() => BrnDialogContent)],
})
export class BrnDialogContent<T extends Record<string, unknown>> {
	private readonly _brnDialog = inject<BrnDialog<unknown, T>>(BrnDialog, { optional: true });
	private readonly _brnDialogRef = inject(BrnDialogRef, { optional: true });
	private readonly _template = inject(TemplateRef);

	public readonly state = computed(() => this._brnDialog?.stateComputed() ?? this._brnDialogRef?.state() ?? 'closed');
	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });
	public readonly context = input<T | undefined>(undefined);

	constructor() {
		this._brnDialog?.registerContent(this._template, this.context, this.className);
	}
}
