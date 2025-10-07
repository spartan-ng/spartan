import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as lucideIcons from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';

import { IconPreview, defaultImports, defaultSkeleton } from '../(icon)/icon.preview';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';

import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Icon', api: 'icon' },
	meta: metaWith('spartan/ui - Icon', 'Visual cues for enhancing user interaction.'),
	title: 'spartan/ui - Icon',
};

@Component({
	selector: 'spartan-icon',
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Icon" lead="Visual cues for enhancing user interaction." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-icon-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="about">About</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Icon is built on top of
				<a href="https://ng-icons.github.io/ng-icons" target="_blank" rel="noreferrer" class="${link}">ng-icons</a>
				by
				<a href="https://github.com/ashley-hunter" target="_blank" rel="noreferrer" class="${link}">
					&#64;ashley-hunter
				</a>
				.
			</p>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui icon" ngCode="ng g @spartan-ng/cli:ui icon" />

			<p class="${hlmP} mb-6">
				This will also install
				<code class="${hlmCode}">&#64;ng-icons/core</code>
				and
				<code class="${hlmCode}">&#64;ng-icons/lucide</code>
				. ng-icons comes with multiple
				<a href="https://ng-icons.github.io/ng-icons/#/browse-icons" target="_blank" rel="noreferrer" class="${link}">
					icon sets
				</a>
				. By default, we use the popular
				<a href="https://lucide.dev/" target="_blank" rel="noreferrer" class="${link}">Lucide</a>
				icon set. If you want to use a different icon set, replace
				<code class="${hlmCode}">&#64;ng-icons/lucide</code>
				with your preferred icon set.
			</p>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="icons">Icons</spartan-section-sub-heading>
			<input
				#searchQuery
				class="w-full"
				hlmInput
				placeholder="Search icons..."
				type="text"
				(input)="onSearchUpdated(searchQuery.value)"
			/>
			<div
				class="border-border mt-2 grid grid-cols-2 place-items-center gap-4 rounded-md border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
			>
				@for (icon of _iconsList(); track $index) {
					<div class="flex w-full flex-col items-center gap-2 p-4">
						<ng-icon hlm size="lg" [name]="icon" />
						<span class="whitespace-normal break-all text-center text-sm">{{ icon }}</span>
					</div>
				}
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="input" label="Input" />
				<spartan-page-bottom-nav-link direction="previous" href="hover-card" label="Hover Card" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
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
		IconPreview,
		HlmInput,
		NgIcon,
		HlmIcon,
	],
	providers: [provideIcons(lucideIcons)],
})
export default class IconPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('icon');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;

	private readonly _searchQuery = signal<string>('');

	protected readonly _lucideIconsList = computed(() => {
		return Object.keys(lucideIcons).filter((iconName) => Object.prototype.hasOwnProperty.call(lucideIcons, iconName));
	});

	protected readonly _iconsList = computed(() => {
		const query = this._searchQuery();
		return this._lucideIconsList().filter((iconName) =>
			iconName.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
		);
	});

	protected onSearchUpdated(query: string) {
		this._searchQuery.set(query);
	}
}
