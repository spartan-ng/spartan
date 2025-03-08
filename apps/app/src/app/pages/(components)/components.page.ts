import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRocket } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { PageComponent } from '../../shared/layout/page.component';
import { metaWith } from '../../shared/meta/meta.util';

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
	providers: [provideIcons({ lucideRocket })],
	template: `
		<div
			hlmAlert
			class="text-primary-foreground border-border bg-primary mx-auto my-2 max-w-[95vw] rounded-lg border p-4"
		>
			<ng-icon hlm hlmAlertIcon name="lucideRocket" class="!text-primary-foreground" />
			<h2 hlmAlertTitle>Components are in alpha</h2>
			<p hlmAlertDesc>
				Try them out! We'd love to hear your feedback! Expect breaking changes!
				<a class="underline" target="_blank" href="https://github.com/goetzrobin/spartan">
					Become the one making those changes on GitHub!
				</a>
			</p>
		</div>
		<spartan-page />
	`,
})
export default class ComponentsPageComponent {}
