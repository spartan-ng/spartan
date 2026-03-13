import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class StyleService {
	public readonly style = signal<'vega' | 'nova' | 'maia' | 'lyra' | 'mira'>('vega');
}
