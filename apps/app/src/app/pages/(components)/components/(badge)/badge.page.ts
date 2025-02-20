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
import { BadgeDestructiveComponent, destructiveCode } from './badge--destructive.example';
import { BadgeOutlineExampleComponent, outlineCode } from './badge--outline.example';
import { BadgeSecondaryExampleComponent, secondaryCode } from './badge--secondary.example';
import { BadgePreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './badge.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Badge' },
	meta: metaWith('spartan/ui - Badge', 'Makes a component look like a badge.'),
	title: 'spartan/ui - Badge',
};

@Component({
	selector: 'spartan-badge',
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
		BadgePreviewComponent,
		BadgeDestructiveComponent,
		BadgeOutlineExampleComponent,
		BadgeSecondaryExampleComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Badge" lead="Makes a component look like a badge." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui badge"
				ngCode="ng g @spartan-ng/cli:ui badge"
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
					<spartan-badge-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>
			<h3 id="examples__secondary" class="${hlmH4} mb-2 mt-6">Secondary</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-secondary />
				</div>
				<spartan-code secondTab [code]="secondaryCode" />
			</spartan-tabs>
			<h3 id="examples__outline" class="${hlmH4} mb-2 mt-6">Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-outline />
				</div>
				<spartan-code secondTab [code]="outlineCode" />
			</spartan-tabs>
			<h3 id="examples__destructive" class="${hlmH4} mb-2 mt-6">Destructive</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-badge-destructive />
				</div>
				<spartan-code secondTab [code]="destructiveCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="breadcrumb" label="Breadcrumb" />
				<spartan-page-bottom-nav-link direction="previous" href="avatar" label="Avatar" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class BadgePageComponent {
	public readonly defaultCode = defaultCode;
	public readonly defaultSkeleton = defaultSkeleton;
	public readonly defaultImports = defaultImports;

	public readonly secondaryCode = secondaryCode;
	public readonly outlineCode = outlineCode;
	public readonly destructiveCode = destructiveCode;
}
