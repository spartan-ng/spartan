import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
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
import { EmptyAvatarGroup } from './empty--avatar-group.preview';
import { EmptyAvatar } from './empty--avatar.preview';
import { EmptyBackground } from './empty--background.preview';
import { EmptyOutline } from './empty--outline.preview';
import { defaultImports, defaultSkeleton, EmptyPreview } from './empty.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Empty', api: 'empty' },
	meta: metaWith('spartan/ui - Empty', 'Use the Empty component to display a empty state.'),
	title: 'spartan/ui - Empty',
};
@Component({
	selector: 'spartan-empty',

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
		EmptyPreview,
		EmptyOutline,
		EmptyBackground,
		EmptyAvatar,
		EmptyAvatarGroup,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Empty" lead="Use the Empty component to display a empty state." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-empty-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui empty"
				ngCode="ng g @spartan-ng/cli:ui empty"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__outline" spartanH4>Outline</h3>
			<p class="${hlmP} mb-2">
				Use the
				<code class="${hlmCode} mr-0.5">border</code>
				utility class to create a outline empty state.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-empty-outline />
				</div>
				<spartan-code secondTab [code]="_outlineCode()" />
			</spartan-tabs>

			<h3 id="examples__background" spartanH4>Background</h3>
			<p class="${hlmP} mb-2">
				Use the
				<code class="${hlmCode} mr-0.5">bg-*</code>
				and
				<code class="${hlmCode} mr-0.5">bg-gradient-*</code>
				utilities to add a background to the empty state.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="!p-0">
					<spartan-empty-background class="h-[350px] w-full" />
				</div>
				<spartan-code secondTab [code]="_backgroundCode()" />
			</spartan-tabs>

			<h3 id="examples__avatar" spartanH4>Avatar</h3>
			<p class="${hlmP} mb-2">
				Use the
				<code class="${hlmCode} mr-0.5">EmptyMedia</code>
				component to display an avatar in the empty state.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-empty-avatar />
				</div>
				<spartan-code secondTab [code]="_avatarCode()" />
			</spartan-tabs>

			<h3 id="examples__avatar-group" spartanH4>Avatar Group</h3>
			<p class="${hlmP} mb-2">
				Use the
				<code class="${hlmCode} mr-0.5">EmptyMedia</code>
				component to display an avatar group in the empty state.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-empty-avatar-group />
				</div>
				<spartan-code secondTab [code]="_avatarGroupCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="field" label="Field" />
				<spartan-page-bottom-nav-link direction="previous" href="dropdown-menu" label="Dropdown Menu" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class EmptyPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('empty');
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _outlineCode = computed(() => this._snippets()['outline']);
	protected readonly _backgroundCode = computed(() => this._snippets()['background']);
	protected readonly _avatarCode = computed(() => this._snippets()['avatar']);
	protected readonly _avatarGroupCode = computed(() => this._snippets()['avatarGroup']);
}
