import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/ui-typography-helm';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { DropdownPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './dropdown-menu.preview';
import { DropdownWithContextPreviewComponent, dropdownWithContextCode } from './dropdown-with-context.preview';
import { DropdownWithStatePreviewComponent, dropdownWithStateCode } from './dropdown-with-state.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Dropdown' },
	meta: metaWith(
		'spartan/ui - Dropdown',
		'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
	),
	title: 'spartan/ui - Dropdown',
};
@Component({
	selector: 'spartan-dropdown-menu',
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
		DropdownPreviewComponent,
		DropdownPreviewComponent,
		DropdownWithStatePreviewComponent,
		DropdownWithContextPreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Dropdown"
				lead="Displays a menu to the user — such as a set of actions or functions — triggered by a button."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui menu" ngCode="ng g @spartan-ng/cli:ui menu" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__stateful" class="${hlmH4} mb-2 mt-6">Stateful</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-with-state />
				</div>
				<spartan-code secondTab [code]="dropdownWithStateCode" />
			</spartan-tabs>

			<h3 id="examples__context" class="${hlmH4} mb-2 mt-6">Passing context to menu</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dropdown-with-context />
				</div>
				<spartan-code secondTab [code]="dropdownWithContextCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="hover-card" label="Hover Card" />
				<spartan-page-bottom-nav-link direction="previous" href="dialog" label="Dialog" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DropdownPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
	protected readonly dropdownWithStateCode = dropdownWithStateCode;
	protected readonly dropdownWithContextCode = dropdownWithContextCode;
}
