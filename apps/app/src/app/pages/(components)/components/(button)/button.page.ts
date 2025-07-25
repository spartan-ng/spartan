import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';

import { PrimitiveSnippetsService } from '../../../../core/services/primitive-snippets.service';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { UIApiDocsComponent } from '../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { ButtonAnchorComponent } from './button--anchor.example';
import { ButtonDestructiveComponent } from './button--destructive.example';
import { ButtonGhostComponent } from './button--ghost.example';
import { ButtonIconComponent } from './button--icon.example';
import { ButtonLinkComponent } from './button--link.example';
import { ButtonLoadingComponent } from './button--loading.example';
import { ButtonOutlineComponent } from './button--outline.example';
import { ButtonSecondaryComponent } from './button--secondary.example';
import { ButtonWithIconComponent } from './button--with-icon.example';
import { ButtonPreviewComponent, defaultImports, defaultSkeleton } from './button.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Button', api: 'button' },
	meta: metaWith('spartan/ui - Button', 'Displays a button or a component that looks like a button.'),
	title: 'spartan/ui - Button',
};

@Component({
	selector: 'spartan-button',
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
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui button"
				ngCode="ng g @spartan-ng/cli:ui button"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__secondary" class="${hlmH4} mb-2 mt-6">Secondary</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-secondary />
				</div>
				<spartan-code secondTab [code]="_secondaryCode()" />
			</spartan-tabs>
			<h3 id="examples__destructive" class="${hlmH4} mb-2 mt-6">Destructive</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-destructive />
				</div>
				<spartan-code secondTab [code]="_destructiveCode()" />
			</spartan-tabs>
			<h3 id="examples__outline" class="${hlmH4} mb-2 mt-6">Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-outline />
				</div>
				<spartan-code secondTab [code]="_outlineCode()" />
			</spartan-tabs>
			<h3 id="examples__ghost" class="${hlmH4} mb-2 mt-6">Ghost</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-ghost />
				</div>
				<spartan-code secondTab [code]="_ghostCode()" />
			</spartan-tabs>
			<h3 id="examples__link" class="${hlmH4} mb-2 mt-6">Link</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-link />
				</div>
				<spartan-code secondTab [code]="_linkCode()" />
			</spartan-tabs>
			<h3 id="examples__icon" class="${hlmH4} mb-2 mt-6">Icon</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-icon />
				</div>
				<spartan-code secondTab [code]="_iconCode()" />
			</spartan-tabs>
			<h3 id="examples__with_icon" class="${hlmH4} mb-2 mt-6">With Icon</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-with-icon />
				</div>
				<spartan-code secondTab [code]="_withIconCode()" />
			</spartan-tabs>
			<h3 id="examples__loading" class="${hlmH4} mb-2 mt-6">Loading</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-loading />
				</div>
				<spartan-code secondTab [code]="_loadingCode()" />
			</spartan-tabs>
			<h3 id="examples__as_anchor" class="${hlmH4} mb-2 mt-6">As Anchor</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-anchor />
				</div>
				<spartan-code secondTab [code]="_anchorCode()" />
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
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('button');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;

	protected readonly _secondaryCode = computed(() => this._snippets()['secondary']);
	protected readonly _outlineCode = computed(() => this._snippets()['outline']);
	protected readonly _destructiveCode = computed(() => this._snippets()['destructive']);
	protected readonly _ghostCode = computed(() => this._snippets()['ghost']);
	protected readonly _linkCode = computed(() => this._snippets()['link']);
	protected readonly _iconCode = computed(() => this._snippets()['icon']);
	protected readonly _withIconCode = computed(() => this._snippets()['withIcon']);
	protected readonly _loadingCode = computed(() => this._snippets()['loading']);
	protected readonly _anchorCode = computed(() => this._snippets()['anchor']);
}
