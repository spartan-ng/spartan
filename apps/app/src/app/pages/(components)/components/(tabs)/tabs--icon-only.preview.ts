import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHome, lucideSearch, lucideSettings } from '@ng-icons/lucide';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-icons-only',
	imports: [HlmTabsImports, NgIcon],
	providers: [provideIcons({ lucideHome, lucideSearch, lucideSettings })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-tabs tab="home">
			<hlm-tabs-list>
				<button hlmTabsTrigger="home">
					<ng-icon name="lucideHome" />
				</button>
				<button hlmTabsTrigger="search">
					<ng-icon name="lucideSearch" />
				</button>
				<button hlmTabsTrigger="settings">
					<ng-icon name="lucideSettings" />
				</button>
			</hlm-tabs-list>
		</hlm-tabs>
	`,
})
export class TabsIconsOnlyPreview {}
