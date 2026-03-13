import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { HlmP } from '@spartan-ng/helm/typography';

@Component({
	selector: 'spartan-header-rtl',
	imports: [SectionSubHeading, HlmP, RouterLink],
	providers: [provideIcons({ lucideCircleAlert })],
	template: `
		<spartan-section-sub-heading id="rtl">RTL</spartan-section-sub-heading>
		<p hlmP>
			To enable RTL support in spartan-ng, see the
			<a routerLink="/documentation/rtl" class="{{ _link }}">RTL configuration guide.</a>
		</p>
	`,
})
export class RtlHeader {
	protected readonly _link = link;
}
