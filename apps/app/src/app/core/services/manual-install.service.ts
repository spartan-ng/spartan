import { computed, Injectable, signal } from '@angular/core';
import type { PrimitiveSnippet } from '../models/primitives-snippets.model';

export type ManualInstallPrimitives = PrimitiveSnippet | 'typography' | 'utils';
export const THEMES = ['vega', 'lyra', 'maia', 'mira', 'nova'] as const;
export type Theme = (typeof THEMES)[number];

type ManualInstallSnippets = Record<string, Record<Theme, string>>;

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
