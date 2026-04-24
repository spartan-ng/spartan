import { computed, Injectable, signal } from '@angular/core';
import { Style } from '@spartan-ng/registry';

@Injectable({
	providedIn: 'root',
})
export class StyleService {
	public readonly style = signal<Style>('vega');
	public readonly isNotVega = computed(() => this.style() !== 'vega');
}
