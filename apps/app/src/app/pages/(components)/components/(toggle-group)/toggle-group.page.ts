import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { CodePreviewDirective } from '@spartan-ng/app/app/shared/code/code-preview.directive';
import { CodeComponent } from '@spartan-ng/app/app/shared/code/code.component';
import { MainSectionDirective } from '@spartan-ng/app/app/shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '@spartan-ng/app/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '@spartan-ng/app/app/shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '@spartan-ng/app/app/shared/layout/tabs-cli.component';
import { TabsComponent } from '@spartan-ng/app/app/shared/layout/tabs.component';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { ToggleGroupDisabledPreviewComponent, disabledCode } from './toggle-group--disabled.preview';
import { ToggleGroupLargePreviewComponent, largeCode } from './toggle-group--large.preview';
import { ToggleGroupOutlinePreviewComponent, outlineCode } from './toggle-group--outline.preview';
import { ToggleGroupSmallPreviewComponent, smallCode } from './toggle-group--small.preview';
import { ToggleGroupPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './toggle-group.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Toggle Group' },
	meta: metaWith(
		'spartan/ui - Toggle Group',
		'A group of two-state buttons that can be used to select one or more options.',
	),
	title: 'spartan/ui - Toggle Group',
};

@Component({
	selector: 'spartan-toggle-group-page',
	imports: [
		CodeComponent,
		CodePreviewDirective,
		MainSectionDirective,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		TabsComponent,
		TabsCliComponent,
		ToggleGroupPreviewComponent,
		ToggleGroupOutlinePreviewComponent,
		ToggleGroupSmallPreviewComponent,
		ToggleGroupLargePreviewComponent,
		ToggleGroupDisabledPreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Toggle Group" lead="A group of toggle buttons." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui toggle-group"
				ngCode="ng g @spartan-ng/cli:ui toggle-group"
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
					<spartan-toggle-group-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<h3 id="examples__outline" class="${hlmH4} mb-2 mt-6">Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-outline />
				</div>
				<spartan-code secondTab [code]="outlineCode" />
			</spartan-tabs>

			<h3 id="examples__small" class="${hlmH4} mb-2 mt-6">Small</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-small />
				</div>
				<spartan-code secondTab [code]="smallCode" />
			</spartan-tabs>

			<h3 id="examples__large" class="${hlmH4} mb-2 mt-6">Large</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-large />
				</div>
				<spartan-code secondTab [code]="largeCode" />
			</spartan-tabs>

			<h3 id="examples__disabled" class="${hlmH4} mb-2 mt-6">Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-toggle-group-disabled />
				</div>
				<spartan-code secondTab [code]="disabledCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="tooltip" label="Tooltip" />
				<spartan-page-bottom-nav-link direction="previous" href="toggle" label="Toggle" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ToggleGroupPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultImports = defaultImports;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly outlineCode = outlineCode;
	protected readonly smallCode = smallCode;
	protected readonly largeCode = largeCode;
	protected readonly disabledCode = disabledCode;
}
