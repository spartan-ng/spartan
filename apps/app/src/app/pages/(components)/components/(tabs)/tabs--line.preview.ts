import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-line',
	imports: [HlmTabsImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-tabs tab="home">
			<hlm-tabs-list variant="line">
				<button hlmTabsTrigger="home">Home</button>
				<button hlmTabsTrigger="settings">Settings</button>
			</hlm-tabs-list>
		</hlm-tabs>
	`,
})
export class TabsLinePreview {}
