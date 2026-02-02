import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { TooltipDisabledButtonWithTooltip } from '@spartan-ng/app/app/pages/(components)/components/(tooltip)/tooltip--disabled-button-with-tooltip.example';
import { TooltipDisabled } from '@spartan-ng/app/app/pages/(components)/components/(tooltip)/tooltip--disabled.example';
import { TooltipPosition } from '@spartan-ng/app/app/pages/(components)/components/(tooltip)/tooltip--position.example';
import { TooltipTemplate } from '@spartan-ng/app/app/pages/(components)/components/(tooltip)/tooltip--template.example';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
import { TooltipSimple } from './tooltip--simple.example';
import { defaultImports, defaultSkeleton, TooltipPreview } from './tooltip.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Tooltip', api: 'tooltip' },
	meta: metaWith(
		'spartan/ui - Tooltip',
		'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
	),
	title: 'spartan/ui - Tooltip',
};
@Component({
	selector: 'spartan-tooltip',
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
		TooltipPreview,
		TooltipSimple,
		SectionSubSubHeading,
		TooltipSimple,
		TooltipPosition,
		TooltipSimple,
		TooltipDisabled,
		TooltipTemplate,
		TooltipDisabledButtonWithTooltip,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Tooltip"
				lead="A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tooltip-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui tooltip" ngCode="ng g @spartan-ng/cli:ui tooltip" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__simple" spartanH4>Simple</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tooltip-simple />
				</div>
				<spartan-code secondTab [code]="_simpleCode()" />
			</spartan-tabs>

			<h3 id="examples__position" spartanH4>Positions</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tooltip-position />
				</div>
				<spartan-code secondTab [code]="_positionCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tooltip-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled-button-with-tooltip" spartanH4>Disabled Button with Tooltip</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tooltip-disabled-button-with-tooltip />
				</div>
				<spartan-code secondTab [code]="_disabledBtnCode()" />
			</spartan-tabs>

			<h3 id="examples__template" spartanH4>Template</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-tooltip-template />
				</div>
				<spartan-code secondTab [code]="_templateCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/stack/overview" label="Stack" />
				<spartan-page-bottom-nav-link direction="previous" href="toggle" label="Toggle" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class TooltipPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('tooltip');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _simpleCode = computed(() => this._snippets()['simple']);
	protected readonly _positionCode = computed(() => this._snippets()['position']);
	protected readonly _templateCode = computed(() => this._snippets()['template']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _disabledBtnCode = computed(() => this._snippets()['disabledButtonWithTooltip']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
