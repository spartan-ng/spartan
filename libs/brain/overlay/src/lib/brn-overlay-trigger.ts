import { computed, Directive, inject, input } from '@angular/core';
import { BrnOverlay } from './brn-overlay';
import { BrnOverlayRef } from './brn-overlay-ref';
import type { BrnOverlayState } from './brn-overlay-state';

let triggerIdSequence = 0;

@Directive({
	selector: 'button[brnOverlayTrigger],button[brnOverlayTriggerFor]',
	exportAs: 'brnOverlayTrigger',
	host: {
		'[id]': 'id()',
		'(click)': 'open()',
		'[attr.aria-expanded]': "state() === 'open' ? 'true' : 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'overlayId()',
		'[type]': 'type()',
	},
})
export class BrnOverlayTrigger {
	private readonly _injectedOverlay = inject(BrnOverlay, { optional: true });
	private readonly _overlayRef = inject(BrnOverlayRef, { optional: true });

	public readonly id = input<string>(`brn-overlay-trigger-${++triggerIdSequence}`);
	public readonly type = input<'button' | 'submit' | 'reset'>('button');
	public readonly brnOverlayTriggerFor = input<BrnOverlay | undefined>(undefined);

	public readonly state = computed<BrnOverlayState>(
		() => this.getOverlay()?.stateComputed() ?? this._overlayRef?.state() ?? 'closed',
	);
	public readonly overlayId = computed(() => this.getOverlay()?.id() ?? this._overlayRef?.id ?? null);

	protected getOverlay(): BrnOverlay | undefined {
		return this.brnOverlayTriggerFor() ?? this._injectedOverlay ?? undefined;
	}

	public open(): void {
		this.getOverlay()?.open();
	}
}
