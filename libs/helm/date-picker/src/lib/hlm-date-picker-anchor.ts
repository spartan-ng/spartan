import { Directive, effect, ElementRef, inject, input, untracked } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { BrnPopover } from '@spartan-ng/brain/popover';

@Directive({ selector: '[hlmDatePickerAnchor]' })
export class HlmDatePickerAnchor {
	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnDialog = inject(BrnDialog, { optional: true });

	public readonly hlmDatePickerAnchorFor = input<BrnPopover | undefined>(undefined, {
		alias: 'hlmDatePickerAnchorFor',
	});

	constructor() {
		effect(() => {
			const brnDialog = this.hlmDatePickerAnchorFor();
			untracked(() => {
				if (!brnDialog) return;
				brnDialog.mutableAttachTo.set(this._host.nativeElement);
				brnDialog.mutableCloseOnOutsidePointerEvents.set(true);
			});
		});

		if (!this._brnDialog) return;
		this._brnDialog.mutableAttachTo.set(this._host.nativeElement);
		this._brnDialog.mutableCloseOnOutsidePointerEvents.set(true);
	}
}
