import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

@Component({
	selector: 'spartan-header-style',
	imports: [SectionSubHeading, NgIcon, HlmAlertImports],
	providers: [provideIcons({ lucideCircleAlert })],
	template: `
		<spartan-section-sub-heading id="style">Styles</spartan-section-sub-heading>
		<div hlmAlert variant="destructive" class="mt-6">
			<ng-icon name="lucideCircleAlert" />
			<h4 hlmAlertTitle>This is currently work in progress.</h4>
			<div hlmAlertDescription>
				<p>
					We will provide this feature when we adjust the styles for all components. All Components will be shipped with
					the Vega style!
				</p>
			</div>
		</div>
	`,
})
export class StyleHeader {}
