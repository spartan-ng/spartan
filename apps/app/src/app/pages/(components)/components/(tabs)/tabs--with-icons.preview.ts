import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAppWindow, lucideCode } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'spartan-tabs-with-icons',
	imports: [HlmTabsImports, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideAppWindow, lucideCode })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-tabs tab="preview">
			<hlm-tabs-list>
				<button hlmTabsTrigger="preview">
					<ng-icon hlmIcon name="lucideAppWindow" />
					Preview
				</button>
				<button hlmTabsTrigger="code">
					<ng-icon hlmIcon name="lucideCode" />
					Code
				</button>
			</hlm-tabs-list>
		</hlm-tabs>
	`,
})
export class TabsWithIconsPreview {}
