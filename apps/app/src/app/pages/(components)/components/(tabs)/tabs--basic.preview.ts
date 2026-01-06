import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-basic',
	imports: [HlmTabsImports],
	template: `
		<hlm-tabs tab="home">
			<hlm-tabs-list>
				<button hlmTabsTrigger="home">Home</button>
				<button hlmTabsTrigger="settings">Settings</button>
			</hlm-tabs-list>
		</hlm-tabs>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsBasicPreview {}
