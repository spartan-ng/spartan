import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-input-button',
	imports: [HlmTabsImports, HlmInputImports, HlmButtonImports],
	template: `
		<hlm-tabs tab="overview">
			<div class="flex items-center gap-4">
				<hlm-tabs-list>
					<button hlmTabsTrigger="overview">Overview</button>
					<button hlmTabsTrigger="analytics">Settings</button>
				</hlm-tabs-list>

				<div class="ml-auto flex items-center gap-2">
					<input hlmInput placeholder="Search..." />
					<button hlmBtn>Action</button>
				</div>
			</div>

			<div hlmTabsContent="overview" class="rounded-lg border p-6">
				View your dashboard metrics and key performance indicators.
			</div>
			<div hlmTabsContent="analytics" class="rounded-lg border p-6">
				Detailed analytics and insights about your data.
			</div>
		</hlm-tabs>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsInputButtonPreview {}
