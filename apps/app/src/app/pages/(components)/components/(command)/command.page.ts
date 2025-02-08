import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/ui-typography-helm';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavPlaceholderComponent } from '../../../../shared/layout/page-bottom-nav-placeholder.component';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { CommandDialogComponent, commandDialogCode } from './command--dialog.example';
import { CommandPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './command.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Command' },
	meta: metaWith('spartan/ui - Command', 'Fast, composable, command menu for Angular.'),
	title: 'spartan/ui - Command',
};

@Component({
	selector: 'spartan-command',
	standalone: true,
	imports: [
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		TabsCliComponent,
		CodePreviewDirective,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageBottomNavPlaceholderComponent,
		CommandPreviewComponent,
		HlmButtonDirective,
		CommandDialogComponent,
		RouterLink,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Command" lead="Fast, composable, command menu for Angular." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-command-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui command"
				ngCode="ng g @spartan-ng/cli:ui command"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__dialog" class="${hlmH4} mb-2 mt-6">Dialog</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-command-dialog />
				</div>
				<spartan-code secondTab [code]="commandDialogCode" />
			</spartan-tabs>

			<h3 id="examples__combobox" class="${hlmH4} mb-2 mt-6">Combobox</h3>
			<p class="${hlmP}">
				You can use the
				<code class="${hlmCode}">brn-command</code>
				component as a combobox. See the
				<a hlmBtn class="!px-1 text-base" variant="link" routerLink="../combobox">Combobox</a>
				page for more information.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="context-menu" label="Context Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="combobox" label="Combobox" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CommandPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
	protected readonly commandDialogCode = commandDialogCode;
}
