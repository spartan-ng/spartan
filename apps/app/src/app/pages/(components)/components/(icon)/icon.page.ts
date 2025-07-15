import type { RouteMeta } from '@analogjs/router';
import { Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as lucideIcons from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';

import { IconPreview, defaultImports, defaultSkeleton } from '../(icon)/icon.preview';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { defaultCode } from './icon.generated';

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
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui icon" ngCode="ng g @spartan-ng/cli:ui icon" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
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
				@for (icon of iconsList(); track $index) {
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
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;

	private readonly _searchQuery = signal<string>('');

	protected lucideIconsList = computed(() => {
		return Object.keys(lucideIcons).filter((iconName) => Object.prototype.hasOwnProperty.call(lucideIcons, iconName));
	});

	protected iconsList = computed(() => {
		const query = this._searchQuery();
		return this.lucideIconsList().filter((iconName) =>
			iconName.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
		);
	});

	protected onSearchUpdated(query: string) {
		this._searchQuery.set(query);
	}
}
