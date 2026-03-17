import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Style } from '@spartan-ng/registry';

export const injectStyle = () => {
	const service = inject(StyleService);
	const destroyRef = inject(DestroyRef);
	destroyRef.onDestroy(() => service.style.set('vega'));
};

@Injectable({
	providedIn: 'root',
})
export class StyleService {
	public readonly style = signal<Style>('vega');
}
