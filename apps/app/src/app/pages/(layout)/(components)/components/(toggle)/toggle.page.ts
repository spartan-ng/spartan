import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { CodePreviewDirective } from '../../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../../shared/layout/main-section.directive';

import { PageBottomNavLinkComponent } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../../shared/layout/tabs.component';
import { UIApiDocsComponent } from '../../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../../shared/meta/meta.util';
import { ToggleDisabledPreviewComponent } from './toggle--disabled.preview';
import { ToggleLargePreviewComponent } from './toggle--large.preview';
import { ToggleOutlinePreviewComponent } from './toggle--outline.preview';
import { ToggleSmallPreviewComponent } from './toggle--small.preview';
import { ToggleWithTextPreviewComponent } from './toggle--with-text.preview';
import {
	defaultCode,
	toggleDisabledCode,
	toggleLargeCode,
	toggleOutlineCode,
	toggleSmallCode,
	toggleWithTextCode,
} from './toggle.generated';
import { TogglePreviewComponent, defaultImports, defaultSkeleton } from './toggle.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Toggle', api: 'toggle' },
	meta: metaWith('spartan/ui - Toggle', 'A two-state button that can be either on or off.'),
	title: 'spartan/ui - Toggle',
};
@Component({
	selector: 'spartan-input',
	imports: [
		UIApiDocsComponent,
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
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Toggle" lead="A two-state button that can be either on or off." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui toggle"
				ngCode="ng g @spartan-ng/cli:ui toggle"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__outline" class="${hlmH4} mb-2 mt-6">Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-outline />
				</div>
				<spartan-code secondTab [code]="_outlineCode" />
			</spartan-tabs>
			<h3 id="examples__with_text" class="${hlmH4} mb-2 mt-6">With Text</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-with-text />
				</div>
				<spartan-code secondTab [code]="_withTextCode" />
			</spartan-tabs>
			<h3 id="examples__small" class="${hlmH4} mb-2 mt-6">Small</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-small />
				</div>
				<spartan-code secondTab [code]="_smallCode" />
			</spartan-tabs>
			<h3 id="examples__large" class="${hlmH4} mb-2 mt-6">Large</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-large />
				</div>
				<spartan-code secondTab [code]="_largeCode" />
			</spartan-tabs>
			<h3 id="examples__disabled" class="${hlmH4} mb-2 mt-6">Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="toggle-group" label="Toggle Group" />
				<spartan-page-bottom-nav-link direction="previous" href="textarea" label="Textarea" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class TogglePageComponent {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _disabledCode = toggleDisabledCode;
	protected readonly _largeCode = toggleLargeCode;
	protected readonly _outlineCode = toggleOutlineCode;
	protected readonly _smallCode = toggleSmallCode;
	protected readonly _withTextCode = toggleWithTextCode;
}
