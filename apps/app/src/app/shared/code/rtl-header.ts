import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { HlmAlert, HlmAlertDescription, HlmAlertIcon, HlmAlertTitle } from '@spartan-ng/helm/alert';
import { HlmP } from '@spartan-ng/helm/typography';

@Component({
	selector: 'spartan-header-rtl',
	imports: [SectionSubHeading, HlmP, RouterLink, HlmAlert, HlmAlertDescription, HlmAlertIcon, HlmAlertTitle, NgIcon],
	providers: [provideIcons({ lucideCircleAlert })],
	template: `
		<spartan-section-sub-heading id="rtl">RTL</spartan-section-sub-heading>

		<div hlmAlert variant="destructive" class="mt-6">
			<ng-icon hlmAlertIcon name="lucideCircleAlert" />
			<h4 hlmAlertTitle>This is currently work in progress.</h4>
			<div hlmAlertDescription>
				<p>We will provide this feature when we adjust the styles for all components.</p>
			</div>
		</div>

		<p hlmP>
			To enable RTL support in spartan-ng, see the
			<a routerLink="/documentation/rtl" class="{{ _link }}">RTL configuration guide.</a>
		</p>
	`,
})
export class RtlHeader {
	protected readonly _link = link;
}
