import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { ButtonDefaultPreview } from '@spartan-ng/app/app/pages/(components)/components/(button)/button--default.example';
import { ButtonRoundedPreview } from '@spartan-ng/app/app/pages/(components)/components/(button)/button--rounded.example';
import { ButtonRtlPreview } from '@spartan-ng/app/app/pages/(components)/components/(button)/button--rtl.example';
import { buttonSizePreview } from '@spartan-ng/app/app/pages/(components)/components/(button)/button--size.example';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { HlmCode, HlmP } from '@spartan-ng/helm/typography';
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
import { ButtonOutline } from './button--outline.example';
import { ButtonSecondary } from './button--secondary.example';
import { ButtonSpinner } from './button--spinner.example';
import { ButtonWithIcon } from './button--with-icon.example';
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
		ButtonSpinner,
		ButtonAnchor,
		SectionSubSubHeading,
		CodePreview,
		CodeRtlPreview,
		buttonSizePreview,
		ButtonDefaultPreview,
		ButtonRoundedPreview,
		ButtonRtlPreview,
		HlmP,
		RtlHeader,
		HlmCode,
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
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui button" ngCode="ng g @spartan-ng/cli:ui button" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="cursor">Cursor</spartan-section-sub-heading>

			<p hlmP>
				Tailwind v4
				<a
					href="https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor"
					target="_blank"
					rel="noreferrer"
					class="${link}"
				>
					switched
				</a>
				from
				<span hlmCode>cursor: pointer</span>
				to
				<span hlmCode>cursor: default</span>
				for the button component.
				<br />
				If you want to keep the
				<span hlmCode>cursor: pointer</span>
				behavior, add the following code to your CSS file:
			</p>

			<spartan-code
				class="mt-4"
				code='
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
'
				fileName="src/styles.css"
			/>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__size" spartanH4>Size</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-size-preview />
				</div>
				<spartan-code secondTab [code]="_sizeCode()" />
			</spartan-tabs>

			<h3 id="examples__default" spartanH4>Default</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-default-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<h3 id="examples__outline" spartanH4>Outline</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-outline />
				</div>
				<spartan-code secondTab [code]="_outlineCode()" />
			</spartan-tabs>

			<h3 id="examples__secondary" spartanH4>Secondary</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-secondary />
				</div>
				<spartan-code secondTab [code]="_secondaryCode()" />
			</spartan-tabs>

			<h3 id="examples__ghost" spartanH4>Ghost</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-ghost />
				</div>
				<spartan-code secondTab [code]="_ghostCode()" />
			</spartan-tabs>

			<h3 id="examples__destructive" spartanH4>Destructive</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-destructive />
				</div>
				<spartan-code secondTab [code]="_destructiveCode()" />
			</spartan-tabs>
			<h3 id="examples__link" spartanH4>Link</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-link />
				</div>
				<spartan-code secondTab [code]="_linkCode()" />
			</spartan-tabs>
			<h3 id="examples__icon" spartanH4>Icon</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-icon />
				</div>
				<spartan-code secondTab [code]="_iconCode()" />
			</spartan-tabs>
			<h3 id="examples__with_icon" spartanH4>With Icon</h3>

			<p hlmP>
				Remember to add the
				<span hlmCode>data-icon="inline-start"</span>
				or
				<span hlmCode>data-icon="inline-end"</span>
				attribute to the icon for the correct spacing.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-with-icon />
				</div>
				<spartan-code secondTab [code]="_withIconCode()" />
			</spartan-tabs>

			<h3 id="examples__rounded" spartanH4>Rounded</h3>
			<p hlmP>
				Use the
				<span hlmCode>rounded-full</span>
				class to make the button rounded.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-rounded-preview />
				</div>
				<spartan-code secondTab [code]="_roundedCode()" />
			</spartan-tabs>

			<h3 id="examples__spinner" spartanH4>Spinner</h3>
			<p hlmP>
				Render a
				<span hlmCode>hlm-spinner</span>
				component inside the button to show a loading state. Remember to add the
				<span hlmCode>data-icon="inline-start"</span>
				or
				<span hlmCode>data-icon="inline-end"</span>
				attribute to the spinner for the correct spacing.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-spinner />
				</div>
				<spartan-code secondTab [code]="_spinnerCode()" />
			</spartan-tabs>
			<h3 id="examples__as_anchor" spartanH4>As Anchor</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-anchor />
				</div>
				<spartan-code secondTab [code]="_anchorCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-button-rtl-preview />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="button-group" label="Button Group" />
				<spartan-page-bottom-nav-link direction="previous" href="breadcrumb" label="Breadcrumb" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ButtonPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('button');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _sizeCode = computed(() => this._snippets()['size']);
	protected readonly _secondaryCode = computed(() => this._snippets()['secondary']);
	protected readonly _outlineCode = computed(() => this._snippets()['outline']);
	protected readonly _destructiveCode = computed(() => this._snippets()['destructive']);
	protected readonly _ghostCode = computed(() => this._snippets()['ghost']);
	protected readonly _linkCode = computed(() => this._snippets()['link']);
	protected readonly _iconCode = computed(() => this._snippets()['icon']);
	protected readonly _withIconCode = computed(() => this._snippets()['withIcon']);
	protected readonly _roundedCode = computed(() => this._snippets()['rounded']);
	protected readonly _spinnerCode = computed(() => this._snippets()['spinner']);
	protected readonly _anchorCode = computed(() => this._snippets()['anchor']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
