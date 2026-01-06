import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAppWindow, lucideCode } from '@ng-icons/lucide';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-with-icons',
	imports: [HlmTabsImports, NgIcon],
	providers: [provideIcons({ lucideAppWindow, lucideCode })],
	template: `
		<hlm-tabs tab="preview">
			<hlm-tabs-list>
				<button hlmTabsTrigger="preview">
					<ng-icon name="lucideAppWindow" />
					Preview
				</button>
				<button hlmTabsTrigger="code">
					<ng-icon name="lucideCode" />
					Code
				</button>
			</hlm-tabs-list>
		</hlm-tabs>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsWithIconsPreview {}
