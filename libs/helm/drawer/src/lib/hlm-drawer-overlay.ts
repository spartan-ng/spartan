import { Directive, computed, effect, input, untracked } from '@angular/core';
import { injectCustomClassSettable } from '@spartan-ng/brain/core';
import { BrnDrawerOverlay } from '@spartan-ng/brain/drawer';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDrawerOverlay],hlm-drawer-overlay',
	hostDirectives: [BrnDrawerOverlay],
})
export class HlmDrawerOverlay {
	private readonly _classSettable = injectCustomClassSettable({ optional: true, host: true });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'spartan-drawer-overlay transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0',
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
