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
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { link } from '@spartan-ng/app/app/shared/typography/link';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { IconMultipleSetsPreview } from './icon--multiple.example';
import { IconResponsivePreview } from './icon--responsive.example';
import { IconSizePreview } from './icon--size.example';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Icon', api: 'icon' },
	meta: metaWith('spartan/ui - Icon', 'Visual cues for enhancing user interaction.'),
	title: 'spartan/ui - Icon',
};

@Component({
	selector: 'spartan-icon',

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
		IconMultipleSetsPreview,
		IconSizePreview,
		IconResponsivePreview,
		SectionSubSubHeading,
	],
	providers: [provideIcons(lucideIcons)],
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
			<p class="${hlmP}">
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

			<p class="${hlmP}">
				This will also install
				<code class="${hlmCode}">&#64;ng-icons/core</code>
				and
				<code class="${hlmCode}">&#64;ng-icons/lucide</code>
				. ng-icons supports multiple
				<a href="https://ng-icons.github.io/ng-icons/#/browse-icons" target="_blank" rel="noreferrer" class="${link}">
					icon sets
				</a>
				, each with its own package.
			</p>

			<p class="${hlmP}">
				By default, spartan/ui components use the
				<a href="https://lucide.dev/" target="_blank" rel="noreferrer" class="${link}">Lucide</a>
				(
				<code class="${hlmCode}">&#64;ng-icons/lucide</code>
				) icon set. You can customize this behavior in two ways:
			</p>

			<ul class="${hlmUl}">
				<li>
					Replace
					<code class="${hlmCode}">&#64;ng-icons/lucide</code>
					entirely with another icon set - icon names vary and must be updated manually
				</li>
				<li>Use multiple icon sets side-by-side by installing additional packages</li>
			</ul>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__size" spartanH4>Size</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-icon-size />
				</div>
				<spartan-code secondTab [code]="_sizeCode()" />
			</spartan-tabs>

			<h3 id="examples__responsive_size" spartanH4>Responsive Size</h3>

			<p class="${hlmP} mb-6">
				Use font-sizes (e.g.
				<code class="${hlmCode}">text-lg</code>
				) utilities to adjust icon size responsively. The
				<code class="${hlmCode}">HlmIcon</code>
				directive is not required.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-icon-responsive />
				</div>
				<spartan-code secondTab [code]="_responsiveCode()" />
			</spartan-tabs>

			<h3 id="examples__multiple_icon_sets" spartanH4>Multiple Icon Sets</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-icon-multiple-sets />
				</div>
				<spartan-code secondTab [code]="_multipleCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="icons">Lucide Icons</spartan-section-sub-heading>
			<input
				#searchQuery
				class="mt-4 w-full"
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
						<span class="text-center text-sm break-all whitespace-normal">{{ icon }}</span>
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
})
export default class IconPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('icon');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _sizeCode = computed(() => this._snippets()['size']);
	protected readonly _responsiveCode = computed(() => this._snippets()['responsive']);
	protected readonly _multipleCode = computed(() => this._snippets()['multiple']);
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
