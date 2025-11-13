import type { RouteMeta } from '@analogjs/router';
import { injectLoad } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';
import { lucideRocket } from '@ng-icons/lucide';
import { ApiDocsService } from '../../core/services/api-docs.service';
import { PrimitiveSnippetsService } from '../../core/services/primitive-snippets.service';
import { Page } from '../../shared/layout/page';
import { metaWith } from '../../shared/meta/meta.util';
import type { load } from './components.server';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan/ui - Components',
		'spartan/ui provides unstyled components that are accessible by default. It also gives you beautiful shadcn-like styling options.',
	),
	data: {
		breadcrumb: 'Components',
	},
	title: 'spartan/ui - Components',
};

@Component({
	selector: 'spartan-components',
	imports: [Page],
	providers: [provideIcons({ lucideRocket }), ApiDocsService],
	host: {
		class: '[--stable-height:78.75px]',
	},
	template: `
		<spartan-page />
	`,
})
export default class ComponentsPage {
	private readonly _apiData = toSignal(injectLoad<typeof load>(), { requireSync: true });
	private readonly _apiDocsService = inject(ApiDocsService);
	private readonly _primitivesService = inject(PrimitiveSnippetsService);

	constructor() {
		this._apiDocsService.setApiDocs(this._apiData().docsData);
		this._primitivesService.setSnippets(this._apiData().primitivesData);
	}
}
