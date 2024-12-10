import { waitFor } from '@analogjs/trpc';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay, Subject, switchMap } from 'rxjs';
import { injectTRPCClient } from '../../../trpc-client';
import { Primitives, PrimitiveSubTypes } from '../models/ui-docs.model';

type SamePageAnchorLink = {
	id: string;
	label: string;
	isNested: boolean;
};

@Injectable()
export class UIDocsService {
	private readonly _trpc = injectTRPCClient();

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
		return this.uiDocs()?.[primitive];
	}

	getPrimitiveDocHeaders(primitive: Primitives): {
		brnArray: SamePageAnchorLink[];
		hlmArray: SamePageAnchorLink[];
	} {
		const uiDocs = this.uiDocs();

		if (!uiDocs && !uiDocs?.[primitive]) {
			return { brnArray: [], hlmArray: [] };
		}

		const primitiveHeaders = [...Object.keys(uiDocs[primitive].brain), ...Object.keys(uiDocs[primitive].helm)];

		return primitiveHeaders.reduce<{
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
	}
}
