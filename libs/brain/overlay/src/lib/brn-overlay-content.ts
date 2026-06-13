import { computed, Directive, inject, input, TemplateRef } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/brain/core';
import { BrnOverlay } from './brn-overlay';
import { BrnOverlayRef } from './brn-overlay-ref';

@Directive({
	selector: '[brnOverlayContent]',
	providers: [provideExposesStateProviderExisting(() => BrnOverlayContent)],
})
export class BrnOverlayContent<T extends Record<string, unknown>> {
	private readonly _brnOverlay = inject<BrnOverlay<unknown, T>>(BrnOverlay, { optional: true });
	private readonly _brnOverlayRef = inject(BrnOverlayRef, { optional: true });
	private readonly _template = inject(TemplateRef);

	public readonly state = computed(() => this._brnOverlay?.stateComputed() ?? this._brnOverlayRef?.state() ?? 'closed');
	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });
	public readonly context = input<T | undefined>(undefined);

	constructor() {
		this._brnOverlay?.registerContent(this._template, this.context, this.className);
	}
}
