import { computed, Injectable, signal } from '@angular/core';
import { ComponentApiData, Primitives, PrimitiveSubTypes } from '../models/ui-docs.model';

type SamePageAnchorLink = {
	id: string;
	label: string;
	isNested: boolean;
};

@Injectable()
export class UIDocsService {
	private readonly _uiDocs = signal<ComponentApiData | null>(null);
	public uiDocs = computed(() => this._uiDocs());

	setAPIData(data: ComponentApiData): void {
		this._uiDocs.set(data);
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
