import { DestroyRef, inject, Injectable, signal } from '@angular/core';

export const injectStyle = () => {
	const service = inject(StyleService);
	const destroyRef = inject(DestroyRef);
	destroyRef.onDestroy(() => service.style.set('vega'));
};

@Injectable({
	providedIn: 'root',
})
export class StyleService {
	public readonly style = signal<'vega' | 'nova' | 'maia' | 'lyra' | 'mira'>('vega');
}
