import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/ui-typography-helm';
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
import { ToggleDisabledPreviewComponent, disabledCode } from './toggle--disabled.preview';
import { ToggleLargePreviewComponent, largeCode } from './toggle--large.preview';
import { ToggleOutlinePreviewComponent, outlineCode } from './toggle--outline.preview';
import { ToggleSmallPreviewComponent, smallCode } from './toggle--small.preview';
import { ToggleWithTextPreviewComponent, withTextCode } from './toggle--with-text.preview';
import { TogglePreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './toggle.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Toggle' },
	meta: metaWith('spartan/ui - Toggle', 'A two-state button that can be either on or off.'),
	title: 'spartan/ui - Toggle',
};
@Component({
	selector: 'spartan-input',
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
		TogglePreviewComponent,
		ToggleDisabledPreviewComponent,
		ToggleLargePreviewComponent,
		ToggleOutlinePreviewComponent,
		ToggleSmallPreviewComponent,
		ToggleWithTextPreviewComponent,
		PageBottomNavPlaceholderComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Toggle" lead="A two-state button that can be either on or off." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui toggle"
				ngCode="ng g @spartan-ng/cli:ui toggle"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__default" class="${hlmH4} mb-2 mt-6">Default</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>
			<h3 id="examples__outline" class="${hlmH4} mb-2 mt-6">Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-outline />
				</div>
				<spartan-code secondTab [code]="outlineCode" />
			</spartan-tabs>
			<h3 id="examples__with_text" class="${hlmH4} mb-2 mt-6">With Text</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-with-text />
				</div>
				<spartan-code secondTab [code]="withTextCode" />
			</spartan-tabs>
			<h3 id="examples__small" class="${hlmH4} mb-2 mt-6">Small</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-small />
				</div>
				<spartan-code secondTab [code]="smallCode" />
			</spartan-tabs>
			<h3 id="examples__large" class="${hlmH4} mb-2 mt-6">Large</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-large />
				</div>
				<spartan-code secondTab [code]="largeCode" />
			</spartan-tabs>
			<h3 id="examples__disabled" class="${hlmH4} mb-2 mt-6">Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-disabled />
				</div>
				<spartan-code secondTab [code]="disabledCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="tooltip" label="Tooltip" />
				<spartan-page-bottom-nav-link direction="previous" href="textarea" label="Textarea" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class TogglePageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
	protected readonly disabledCode = disabledCode;
	protected readonly largeCode = largeCode;
	protected readonly outlineCode = outlineCode;
	protected readonly smallCode = smallCode;
	protected readonly withTextCode = withTextCode;
}
