import { Component, input } from '@angular/core';
import {
	HlmTabsComponent,
	HlmTabsContentDirective,
	HlmTabsPaginatedListComponent,
	HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';

@Component({
	selector: 'spartan-tabs-paginated',
	imports: [HlmTabsComponent, HlmTabsPaginatedListComponent, HlmTabsTriggerDirective, HlmTabsContentDirective],
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
export class TabsPaginatedPreviewComponent {
	public activeTab = input('Tab 0');

	public lotsOfTabs = Array.from({ length: 30 })
		.fill(0)
		.map((_, index) => `Tab ${index}`);
}

export const paginatedCode = `
import { Component, input } from '@angular/core';
import {
	HlmTabsComponent,
	HlmTabsContentDirective,
	HlmTabsPaginatedListComponent,
	HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';

@Component({
	selector: 'spartan-tabs-paginated',
	standalone: true,
	imports: [HlmTabsComponent, HlmTabsPaginatedListComponent, HlmTabsTriggerDirective, HlmTabsContentDirective],
	host: {
		class: 'block w-full max-w-lg min-h-[150px]',
	},
	template: \`
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
	\`,
})
export class TabsPaginatedPreviewComponent {
	activeTab = input('Tab 0');

	lotsOfTabs = Array.from({ length: 30 }).fill(0).map((_, index) => \`Tab \${index}\`);
}`;
