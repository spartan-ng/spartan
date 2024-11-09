import { waitFor } from '@analogjs/trpc';
import { computed, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay, Subject, switchMap } from 'rxjs';
import { injectTRPCClient } from '../../../trpc-client';
import { ComponentApiData, Primitives, PrimitiveSubTypes, SubTypeRecord } from '../models/ui-docs.model';

type SamePageAnchorLink = {
	id: string;
	label: string;
	isNested: boolean;
};

@Injectable()
export class UIDocsService {
	private readonly _trpc = injectTRPCClient();
	private readonly _uiDocs = toSignal<ComponentApiData>(this._trpc.docs.list.query());
	private readonly _primitiveDocHeaders = signal<string[]>([]);
	public readonly primitiveDocheaders = computed(() => this._primitiveDocHeaders());

	public readonly primitiveDocPageLinks = computed(() => {
		const primitiveDocHeaders: string[] = this.primitiveDocheaders() ?? [];

		if (!primitiveDocHeaders) {
			return null;
		}

		return primitiveDocHeaders.reduce<{
			brnArray: SamePageAnchorLink[];
			hlmArray: SamePageAnchorLink[];
		}>(
			(acc, str) => {
				if (str.startsWith('Brn')) {
					acc.brnArray.push({
						id: str.toLowerCase(),
						label: str,
						isNested: true,
					});
				} else if (str.startsWith('Hlm')) {
					acc.hlmArray.push({
						id: str.toLowerCase(),
						label: str,
						isNested: true,
					});
				}
				return acc;
			},
			{ brnArray: [], hlmArray: [] },
		);
	});

	public triggerRefresh$ = new Subject<void>();
	public uiDocs$ = this.triggerRefresh$.pipe(
		switchMap(() => this._trpc.docs.list.query()),
		shareReplay(1),
	);
	public uiDocs = toSignal(this.uiDocs$);

	constructor() {
		void waitFor(this.uiDocs$);
		this.triggerRefresh$.next();
	}

	getPrimitiveDoc(primitive: Primitives): PrimitiveSubTypes | undefined {
		return this._uiDocs()?.[primitive];
	}

	getPrimitiveDocHeaders(primitive: Primitives, subType: SubTypeRecord): string[] | null {
		const subTypePrimitives = this._uiDocs()?.[primitive][subType];
		if (!subTypePrimitives) {
			return null;
		}
		return Object.keys(subTypePrimitives);
	}

	injectPrimitivePageNavLinks(primitive: Primitives, subType: SubTypeRecord): void {
		// Would at most be called twice on each page, 1 for each primitive subtype 'brn' or 'hlm'
		// We could have each page call this but i think this ensures api doc sections are present and leaves responsibility to the compoentn
		const primitiveDocheaders = this.getPrimitiveDocHeaders(primitive, subType);
		if (primitiveDocheaders) {
			this._primitiveDocHeaders.update((state) => [...state, ...primitiveDocheaders]);
		}
	}
}
