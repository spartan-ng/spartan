import { Injectable, signal } from '@angular/core';
import { Style } from '@spartan-ng/registry';

@Injectable({
	providedIn: 'root',
})
export class StyleService {
	public readonly style = signal<Style>('vega');
}
