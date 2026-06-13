import { Directive, effect, ElementRef, inject, input, untracked } from '@angular/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { BrnPopover } from '@spartan-ng/brain/popover';

@Directive({ selector: '[hlmDatePickerAnchor]' })
export class HlmDatePickerAnchor {
	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnOverlay = inject(BrnOverlay, { optional: true });

	public readonly hlmDatePickerAnchorFor = input<BrnPopover | undefined>(undefined, {
		alias: 'hlmDatePickerAnchorFor',
	});

	constructor() {
		effect(() => {
			const brnOverlay = this.hlmDatePickerAnchorFor();
			untracked(() => {
				if (!brnOverlay) return;
				brnOverlay.mutableAttachTo.set(this._host.nativeElement);
			});
		});

		if (!this._brnOverlay) return;
		this._brnOverlay.mutableAttachTo.set(this._host.nativeElement);
	}
}
