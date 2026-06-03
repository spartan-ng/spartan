import { OverlayContainer } from '@angular/cdk/overlay';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Style } from '@spartan-ng/registry';

@Injectable({
	providedIn: 'root',
})
export class StyleService {
	private readonly _overlayContainer = inject(OverlayContainer);

	public readonly style = signal<Style>('vega');
	public readonly isNotVega = computed(() => this.style() !== 'vega');

	constructor() {
		// Keep the CDK overlay container class in sync with the active style so that
		// dialogs, popovers and other overlay-rendered components receive the correct theme.
		effect(() => {
			const el = this._overlayContainer.getContainerElement();
			for (const cls of Array.from(el.classList)) {
				if (cls.startsWith('style-') || cls === 'not-style-vega') el.classList.remove(cls);
			}
			el.classList.add(`style-${this.style()}`);
			if (this.isNotVega()) el.classList.add('not-style-vega');
		});
	}
}
