import { computed, Directive, inject, input } from '@angular/core';
import { BrnOverlay } from './brn-overlay';
import { BrnOverlayRef } from './brn-overlay-ref';
import type { BrnOverlayState } from './brn-overlay-state';

let idSequence = 0;

@Directive({
	selector: 'button[brnOverlayTrigger],button[brnOverlayTriggerFor]',
	exportAs: 'brnOverlayTrigger',
	host: {
		'[id]': 'id()',
		'(click)': 'open()',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'overlayId()',
		'[type]': 'type()',
	},
})
export class BrnOverlayTrigger {
	protected readonly _brnOverlay = inject(BrnOverlay, { optional: true });
	protected readonly _brnOverlayRef = inject(BrnOverlayRef, { optional: true });

	public readonly id = input<string>(`brn-overlay-trigger-${++idSequence}`);
	public readonly type = input<'button' | 'submit' | 'reset'>('button');

	public readonly state = computed<BrnOverlayState>(() => {
		const overlay = this.getOverlay();
		if (overlay) return overlay.stateComputed();
		if (this._brnOverlayRef) return this._brnOverlayRef.state();
		return 'closed';
	});

	public readonly brnOverlayTriggerFor = input<BrnOverlay | undefined>(undefined);
	public readonly overlayId = computed(() => this.getOverlay()?.id() ?? this._brnOverlayRef?.options().id ?? null);

	protected getOverlay(): BrnOverlay | undefined {
		return this.brnOverlayTriggerFor() ?? this._brnOverlay ?? undefined;
	}

	public open(): void {
		this.getOverlay()?.open();
	}
}
