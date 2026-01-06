import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-line',
	imports: [HlmTabsImports],
	template: `
		<hlm-tabs tab="home">
			<hlm-tabs-list variant="line">
				<button hlmTabsTrigger="home">Home</button>
				<button hlmTabsTrigger="settings">Settings</button>
			</hlm-tabs-list>
		</hlm-tabs>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsLinePreview {}
