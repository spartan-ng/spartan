import type { RouteMeta } from '@analogjs/router';
import { injectLoad } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRocket } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/helm/alert';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { ApiDocsService } from '../../core/services/api-docs.service';
import { PageComponent } from '../../shared/layout/page.component';
import { metaWith } from '../../shared/meta/meta.util';
import { load } from './components.server';

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
	imports: [
		PageComponent,
		HlmAlertDirective,
		HlmAlertTitleDirective,
		HlmAlertDescriptionDirective,
		NgIcon,
		HlmIconDirective,
		HlmAlertIconDirective,
	],
	providers: [provideIcons({ lucideRocket }), ApiDocsService],
	template: `
		<div
			hlmAlert
			class="text-primary-foreground border-border bg-primary mx-auto my-2 max-w-[95vw] rounded-lg border p-4"
		>
			<ng-icon hlm hlmAlertIcon name="lucideRocket" class="!text-primary-foreground" />
			<h2 hlmAlertTitle>Spartans get ready! v1 is coming!</h2>
			<div hlmAlertDescription>
				<p>
					We are very close to our first stable release. Expect more announcements in the coming weeks. v1 was made
					possible by
					<a class="underline" target="_blank" href="https://zerops.io">our partner Zerops.</a>
				</p>
			</div>
		</div>
		<spartan-page />
	`,
})
export default class ComponentsPageComponent {
	private readonly _apiData = toSignal(injectLoad<typeof load>(), { requireSync: true });
	private readonly _apiDocsService = inject(ApiDocsService);

	constructor() {
		this._apiDocsService.setApiDocs(this._apiData());
	}
}
