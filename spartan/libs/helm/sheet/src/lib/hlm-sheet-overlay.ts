import { Directive, computed, effect, input, untracked } from '@angular/core';
import { injectCustomClassSettable } from '@spartan-ng/brain/core';
import { BrnSheetOverlay } from '@spartan-ng/brain/sheet';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSheetOverlay],hlm-sheet-overlay',
	hostDirectives: [BrnSheetOverlay],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSheetOverlay {
	private readonly _classSettable = injectCustomClassSettable({ optional: true, host: true });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-black/50',
			this.userClass(),
		),
	);

	constructor() {
		effect(() => {
			const classValue = this._computedClass();
			untracked(() => this._classSettable?.setClassToCustomElement(classValue));
		});
	}
}
