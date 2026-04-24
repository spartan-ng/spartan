import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
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
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { SkeletonAvatar } from './skeleton--avatar.preview';
import { SkeletonCard } from './skeleton--card.preview';
import { SkeletonForm } from './skeleton--form.preview';
import { SkeletonRtl } from './skeleton--rtl.preview';
import { SkeletonTable } from './skeleton--table.preview';
import { SkeletonText } from './skeleton--text.preview';
import { SkeletonPreview, defaultImports, defaultSkeleton } from './skeleton.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Skeleton', api: 'skeleton' },
	meta: metaWith('spartan/ui - Skeleton', 'Use to show a placeholder while content is loading.'),
	title: 'spartan/ui - Skeleton',
};
@Component({
	selector: 'spartan-skeleton',

	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,

		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SectionSubSubHeading,
		RtlHeader,
		CodeRtlPreview,
		SkeletonPreview,
		SkeletonAvatar,
		SkeletonCard,
		SkeletonText,
		SkeletonForm,
		SkeletonTable,
		SkeletonRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Skeleton"
				lead="Use to show a placeholder while content is loading."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-skeleton-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="skeleton" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__avatar" spartanH4>Avatar</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-skeleton-avatar />
				</div>
				<spartan-code secondTab [code]="_avatarCode()" />
			</spartan-tabs>

			<h3 id="examples__card" spartanH4>Card</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-skeleton-card />
				</div>
				<spartan-code secondTab [code]="_cardCode()" />
			</spartan-tabs>

			<h3 id="examples__text" spartanH4>Text</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-skeleton-text />
				</div>
				<spartan-code secondTab [code]="_textCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-skeleton-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<h3 id="examples__table" spartanH4>Table</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-skeleton-table />
				</div>
				<spartan-code secondTab [code]="_tableCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-skeleton-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="slider" label="Slider" />
				<spartan-page-bottom-nav-link direction="previous" href="sidebar" label="Sidebar" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SkeletonPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('skeleton');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _avatarCode = computed(() => this._snippets()['avatar']);
	protected readonly _cardCode = computed(() => this._snippets()['card']);
	protected readonly _textCode = computed(() => this._snippets()['text']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _tableCode = computed(() => this._snippets()['table']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
