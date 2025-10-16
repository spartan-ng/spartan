import { Injectable, computed, signal } from '@angular/core';
import type { ComponentApiData, Primitives } from '../models/ui-docs.model';

@Injectable({
	providedIn: 'root',
})
export class ApiDocsService {
	private readonly _apiDocs = signal<ComponentApiData | null>(null);
	public readonly apiDocs = computed(() => this._apiDocs());

	setApiDocs(data: ComponentApiData): void {
		this._apiDocs.set(data);
	}

	getComponentDocs(component: Primitives) {
		return computed(() => this.apiDocs()?.[component] ?? null);
	}

	getComponentHeaders(component: Primitives) {
		const docs = this.apiDocs()?.[component];
		if (!docs) return [];

		const brainHeaders = docs.brain
			? Object.keys(docs.brain).map((name) => ({
					id: name.toLowerCase(),
					label: name,
					type: 'brain' as const,
				}))
			: [];

		const helmHeaders = docs.helm
			? Object.keys(docs.helm).map((name) => ({
					id: name.toLowerCase(),
					label: name,
					type: 'helm' as const,
				}))
			: [];

		return [...brainHeaders, ...helmHeaders];
	}
}
