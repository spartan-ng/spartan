import { injectLoad } from '@analogjs/router';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Style } from '@spartan-ng/registry';
import type { PrimitiveSnippets } from '../models/primitives-snippets.model';
import type { ComponentApiData } from '../models/ui-docs.model';
import { ApiDocsService } from './api-docs.service';
import { ManualInstallService } from './manual-install.service';
import { PrimitiveSnippetsService } from './primitive-snippets.service';
import { StackBlitzMetaService, type StackBlitzMeta } from './stackblitz-meta.service';

// Docs payload for a single component, loaded by each page's sibling `.server.ts`.
export type ComponentDocsData = {
	docsData: ComponentApiData;
	primitivesData: PrimitiveSnippets;
	manualInstallSnippets: Record<string, Record<Style, string>>;
	stackblitzMeta: StackBlitzMeta;
};

// Signature of a component page's `.server.ts` `load`.
export type ComponentDocsLoad = () => Promise<ComponentDocsData>;

// Pushes a component page's loaded docs slice into the shared docs services. Call from an injection
// context, or pass an `injector` to run it outside one.
export function injectComponentDocs(injector?: Injector): void {
	runInInjectionContext(injector ?? inject(Injector), () => {
		const data = toSignal(injectLoad<ComponentDocsLoad>(), { requireSync: true });
		const { docsData, primitivesData, manualInstallSnippets, stackblitzMeta } = data();
		inject(ApiDocsService).setApiDocs(docsData);
		inject(PrimitiveSnippetsService).setSnippets(primitivesData);
		inject(ManualInstallService).setSnippets(manualInstallSnippets);
		inject(StackBlitzMetaService).setMeta(stackblitzMeta);
	});
}
