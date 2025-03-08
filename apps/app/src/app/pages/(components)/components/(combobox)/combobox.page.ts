import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
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
import { ComboboxPreviewComponent, defaultCode } from './combobox.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Combobox' },
	meta: metaWith('spartan/ui - Combobox', 'Autocomplete input and command palette with a list of suggestions.'),
	title: 'spartan/ui - Combobox',
};

@Component({
	selector: 'spartan-combobox',
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
		ComboboxPreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Combobox"
				lead="Autocomplete input and command palette with a list of suggestions."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<p class="${hlmP}">
				The Combobox is built using a composition of the
				<code class="${hlmCode}">brn-popover</code>
				and the
				<code class="${hlmCode}">brn-command</code>
				components.
			</p>
			<p class="${hlmP}">See installation instructions for the Popover and the Command components.</p>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultCode" />
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="command" label="Command" />
				<spartan-page-bottom-nav-link direction="previous" href="collapsible" label="Collapsible" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ComboboxPageComponent {
	protected readonly defaultCode = defaultCode;
}
