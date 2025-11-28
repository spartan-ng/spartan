import { computed, Injectable, signal } from '@angular/core';

@Injectable()
export class HlmFieldA11yService {
	private readonly _descriptions = signal<string[]>([]);
	private readonly _errors = signal<string[]>([]);

	public readonly describedBy = computed(() => {
		const ids = [...this._descriptions(), ...this._errors()].filter(Boolean);
		const uniqueIds = [...new Set(ids)];
		return uniqueIds.length ? uniqueIds.join(' ') : null;
	});

	public registerDescription(id: string) {
		this._descriptions.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
	}

	public unregisterDescription(id: string) {
		this._descriptions.update((ids) => ids.filter((value) => value !== id));
	}

	public registerError(id: string) {
		this._errors.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
	}

	public unregisterError(id: string) {
		this._errors.update((ids) => ids.filter((value) => value !== id));
	}
}
