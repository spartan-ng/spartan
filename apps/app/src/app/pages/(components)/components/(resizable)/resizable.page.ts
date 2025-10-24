import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
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

import { ResizableHandlePreview } from '@spartan-ng/app/app/pages/(components)/components/(resizable)/resizable--handle.preview';
import { ResizableVerticalPreview } from '@spartan-ng/app/app/pages/(components)/components/(resizable)/resizable--vertical.preview';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { HlmCode, HlmP } from '@spartan-ng/helm/typography';
import { defaultImports, defaultSkeleton, ResizablePreviewComponent } from './resizable.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Resizable', api: 'resizable' },
	meta: metaWith('spartan/ui - Resizable', 'A group of resizable horizontal and vertical panels.'),
	title: 'spartan/ui - Resizable',
};
@Component({
	selector: 'spartan-resizable',
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
		ResizablePreviewComponent,
		SectionSubSubHeading,
		ResizableVerticalPreview,
		ResizableHandlePreview,
		HlmP,
		HlmCode,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Resizable" lead="A group of resizable horizontal and vertical panels." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-resizable-example />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui resizable"
				ngCode="ng g @spartan-ng/cli:ui resizable"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__vertical" spartanH4>Vertical</h3>
			<p hlmP>
				Use the
				<span hlmCode>direction</span>
				prop to set the direction of the resizable panels.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-resizable-vertical-preview />
				</div>
				<spartan-code secondTab [code]="_verticalCode()" />
			</spartan-tabs>

			<h3 id="examples__handle" spartanH4>Handle</h3>
			<p hlmP>
				You can set or hide the handle by using the
				<span hlmCode>withHandle</span>
				prop on the
				<span hlmCode>hlm-resizable-handle</span>
				component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-resizable-handle-preview />
				</div>
				<spartan-code secondTab [code]="_handleCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="scroll-area" label="Scroll Area" />
				<spartan-page-bottom-nav-link direction="previous" href="radio-group" label="Radio Group" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ResizablePage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('resizable');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _verticalCode = computed(() => this._snippets()['vertical']);
	protected readonly _handleCode = computed(() => this._snippets()['handle']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
