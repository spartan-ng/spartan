import type { RouteMeta } from '@analogjs/router';
import { injectLoad } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRocket } from '@ng-icons/lucide';
import { HlmAlert, HlmAlertDescription, HlmAlertIcon, HlmAlertTitle } from '@spartan-ng/helm/alert';
import { HlmIcon } from '@spartan-ng/helm/icon';
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
	imports: [Page, HlmAlert, HlmAlertTitle, HlmAlertDescription, NgIcon, HlmIcon, HlmAlertIcon],
	providers: [provideIcons({ lucideRocket }), ApiDocsService],
	template: `
		<div
			hlmAlert
			class="text-primary-foreground border-border bg-primary container mx-auto my-2 rounded-lg border p-4 lg:h-[var(--stable-height)]"
		>
			<ng-icon hlm hlmAlertIcon name="lucideRocket" class="!text-primary-foreground" />
			<h2 hlmAlertTitle class="font-semibold tracking-normal">Spartans get ready! v1 is coming!</h2>
			<div hlmAlertDescription class="text-muted">
				<p>
					We are very close to our first stable release. Expect more announcements in the coming weeks. v1 was made
					possible by
					<a class="underline" target="_blank" href="https://zerops.io">our partner Zerops.</a>
				</p>
			</div>
		</div>

		<spartan-page />
	`,
	host: {
		class: '[--stable-height:78.75px]',
	},
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
