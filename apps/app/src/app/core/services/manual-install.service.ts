import { computed, Injectable, signal } from '@angular/core';
import { Style } from '@spartan-ng/registry';
import type { PrimitiveSnippet } from '../models/primitives-snippets.model';

export type ManualInstallPrimitives = PrimitiveSnippet | 'typography' | 'utils';

type ManualInstallSnippets = Record<string, Record<Style, string>>;

@Injectable({
	providedIn: 'root',
})
export class ManualInstallService {
	private readonly _snippets = signal<ManualInstallSnippets | null>(null);

	setSnippets(data: ManualInstallSnippets): void {
		this._snippets.set(data);
	}

	getSnippets(component: ManualInstallPrimitives) {
		return computed(() => this._snippets()?.[component]);
	}
}
