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
import { ButtonAnchorComponent, anchorCode } from './button--anchor.example';
import { ButtonDestructiveComponent, destructiveCode } from './button--destructive.example';
import { ButtonGhostComponent, ghostCode } from './button--ghost.example';
import { ButtonIconComponent, iconCode } from './button--icon.example';
import { ButtonLinkComponent, linkCode } from './button--link.example';
import { ButtonLoadingComponent, loadingCode } from './button--loading.example';
import { ButtonOutlineComponent, outlineCode } from './button--outline.example';
import { ButtonSecondaryComponent, secondaryCode } from './button--secondary.example';
import { ButtonWithIconComponent, withIconCode } from './button--with-icon.example';
import { ButtonPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './button.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Button' },
	meta: metaWith('spartan/ui - Button', 'Displays a button or a component that looks like a button.'),
	title: 'spartan/ui - Button',
};

@Component({
	selector: 'spartan-button',
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
		ButtonPreviewComponent,
		ButtonDestructiveComponent,
		ButtonOutlineComponent,
		ButtonSecondaryComponent,
		ButtonGhostComponent,
		ButtonLinkComponent,
		ButtonIconComponent,
		ButtonWithIconComponent,
		ButtonLoadingComponent,
		ButtonAnchorComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Button" lead="Displays a callout for user attention." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui button"
				ngCode="ng g @spartan-ng/cli:ui button"
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
					<spartan-button-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>
			<h3 id="examples__secondary" class="${hlmH4} mb-2 mt-6">Secondary</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-secondary />
				</div>
				<spartan-code secondTab [code]="secondaryCode" />
			</spartan-tabs>
			<h3 id="examples__destructive" class="${hlmH4} mb-2 mt-6">Destructive</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-destructive />
				</div>
				<spartan-code secondTab [code]="destructiveCode" />
			</spartan-tabs>
			<h3 id="examples__outline" class="${hlmH4} mb-2 mt-6">Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-outline />
				</div>
				<spartan-code secondTab [code]="outlineCode" />
			</spartan-tabs>
			<h3 id="examples__ghost" class="${hlmH4} mb-2 mt-6">Ghost</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-ghost />
				</div>
				<spartan-code secondTab [code]="ghostCode" />
			</spartan-tabs>
			<h3 id="examples__link" class="${hlmH4} mb-2 mt-6">Link</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-link />
				</div>
				<spartan-code secondTab [code]="linkCode" />
			</spartan-tabs>
			<h3 id="examples__icon" class="${hlmH4} mb-2 mt-6">Icon</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-icon />
				</div>
				<spartan-code secondTab [code]="iconCode" />
			</spartan-tabs>
			<h3 id="examples__with_icon" class="${hlmH4} mb-2 mt-6">With Icon</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-with-icon />
				</div>
				<spartan-code secondTab [code]="withIconCode" />
			</spartan-tabs>
			<h3 id="examples__loading" class="${hlmH4} mb-2 mt-6">Loading</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-loading />
				</div>
				<spartan-code secondTab [code]="loadingCode" />
			</spartan-tabs>
			<h3 id="examples__as_anchor" class="${hlmH4} mb-2 mt-6">As Anchor</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-anchor />
				</div>
				<spartan-code secondTab [code]="anchorCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="card" label="Card" />
				<spartan-page-bottom-nav-link direction="previous" href="breadcrumb" label="Breadcrumb" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ButtonPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;

	protected readonly secondaryCode = secondaryCode;
	protected readonly outlineCode = outlineCode;
	protected readonly destructiveCode = destructiveCode;
	protected readonly ghostCode = ghostCode;
	protected readonly linkCode = linkCode;
	protected readonly iconCode = iconCode;
	protected readonly withIconCode = withIconCode;
	protected readonly loadingCode = loadingCode;
	protected readonly anchorCode = anchorCode;
}
