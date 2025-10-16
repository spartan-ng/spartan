import { Injectable, computed, signal } from '@angular/core';
import type { PrimitiveSnippet, PrimitiveSnippets } from '../models/primitives-snippets.model';

@Injectable({
	providedIn: 'root',
})
export class PrimitiveSnippetsService {
	private readonly _snippets = signal<PrimitiveSnippets | null>(null);

	setSnippets(data: PrimitiveSnippets): void {
		this._snippets.set(data);
	}

	getSnippets(component: PrimitiveSnippet) {
		return computed(() => this._snippets()?.[component] ?? {});
	}
}
