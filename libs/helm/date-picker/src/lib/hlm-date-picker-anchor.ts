import { Directive, effect, ElementRef, inject, input, linkedSignal } from '@angular/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { BrnPopover } from '@spartan-ng/brain/popover';

@Directive({ selector: '[hlmDatePickerAnchor]' })
export class HlmDatePickerAnchor {
	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnOverlay = inject(BrnOverlay, { optional: true });

	public readonly hlmDatePickerAnchorForInput = input<BrnPopover | undefined>(undefined, {
		alias: 'hlmDatePickerAnchorFor',
	});

	public readonly hlmDatePickerAnchorFor = linkedSignal(this.hlmDatePickerAnchorForInput);

	constructor() {
		effect(() => {
			this.hlmDatePickerAnchorFor()?.setOrigin(this._host.nativeElement);
		});

		this._brnOverlay?.setOrigin(this._host.nativeElement);
	}
}
