import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';

import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { ButtonAnchor } from './button--anchor.example';
import { ButtonDestructive } from './button--destructive.example';
import { ButtonGhost } from './button--ghost.example';
import { ButtonIcon } from './button--icon.example';
import { ButtonLink } from './button--link.example';
import { ButtonLoading } from './button--loading.example';
import { ButtonOutline } from './button--outline.example';
import { ButtonSecondary } from './button--secondary.example';
import { ButtonWithIcon } from './button--with-icon.example';
import {
	buttonAnchorCode,
	buttonDestructiveCode,
	buttonGhostCode,
	buttonIconCode,
	buttonLinkCode,
	buttonLoadingCode,
	buttonOutlineCode,
	buttonSecondaryCode,
	buttonWithIconCode,
	defaultCode,
} from './button.generated';
import { ButtonPreview, defaultImports, defaultSkeleton } from './button.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Button', api: 'button' },
	meta: metaWith('spartan/ui - Button', 'Displays a button or a component that looks like a button.'),
	title: 'spartan/ui - Button',
};

@Component({
	selector: 'spartan-button',
	imports: [
		UIApiDocs,
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		ButtonPreview,
		ButtonDestructive,
		ButtonOutline,
		ButtonSecondary,
		ButtonGhost,
		ButtonLink,
		ButtonIcon,
		ButtonWithIcon,
		ButtonLoading,
		ButtonAnchor,
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

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
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
export default class ButtonPage {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;

	protected readonly secondaryCode = buttonSecondaryCode;
	protected readonly outlineCode = buttonOutlineCode;
	protected readonly destructiveCode = buttonDestructiveCode;
	protected readonly ghostCode = buttonGhostCode;
	protected readonly linkCode = buttonLinkCode;
	protected readonly iconCode = buttonIconCode;
	protected readonly withIconCode = buttonWithIconCode;
	protected readonly loadingCode = buttonLoadingCode;
	protected readonly anchorCode = buttonAnchorCode;
}
