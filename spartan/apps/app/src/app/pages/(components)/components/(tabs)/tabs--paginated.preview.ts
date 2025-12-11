import { Component, input } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-paginated',
	imports: [HlmTabsImports],
	host: {
		class: 'block w-full max-w-lg min-h-[150px]',
	},
	template: `
		<hlm-tabs [tab]="activeTab()" class="w-full">
			<hlm-paginated-tabs-list>
				@for (tab of lotsOfTabs; track tab) {
					<button [hlmTabsTrigger]="tab">{{ tab }}</button>
				}
			</hlm-paginated-tabs-list>
			@for (tab of lotsOfTabs; track tab) {
				<div [hlmTabsContent]="tab">{{ tab }}</div>
			}
		</hlm-tabs>
	`,
})
export class TabsPaginatedPreview {
	public readonly activeTab = input('Tab 0');

	public readonly lotsOfTabs = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => `Tab ${index}`);
}
