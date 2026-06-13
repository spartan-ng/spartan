import { computed, Directive, effect, inject, input, TemplateRef, untracked } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnOverlay } from './brn-overlay';
import { BrnOverlayRef } from './brn-overlay-ref';

@Directive({
	selector: '[brnOverlayContent]',
	providers: [provideExposesStateProviderExisting(() => BrnOverlayContent)],
})
export class BrnOverlayContent<T> {
	private readonly _brnOverlay = inject(BrnOverlay, { optional: true });
	private readonly _brnOverlayRef = inject(BrnOverlayRef, { optional: true });
	private readonly _template = inject(TemplateRef);

	public readonly state = computed(() => this._brnOverlay?.stateComputed() ?? this._brnOverlayRef?.state() ?? 'closed');
	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });
	public readonly context = input<T | undefined>(undefined);

	constructor() {
		if (!this._brnOverlay) return;
		this._brnOverlay.registerTemplate(this._template);
		effect(() => {
			const context = this.context();
			if (!this._brnOverlay || !context) return;
			untracked(() => this._brnOverlay?.setContext(context));
		});
		effect(() => {
			if (!this._brnOverlay) return;
			const newClass = this.className();
			untracked(() => this._brnOverlay?.setPanelClass(newClass));
		});
	}
}
