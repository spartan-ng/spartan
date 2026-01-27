import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
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
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { AvatarBadgeIconPreview } from './avatar--badge-icon.preview';
import { AvatarBadgePreview } from './avatar--badge.preview';
import { AvatarBasicPreview } from './avatar--basic.preview';
import { AvatarDropdownPreview } from './avatar--dropdown.preview';
import { AvatarGroupCountPreview } from './avatar--group-count.preview';
import { AvatarGroupIconPreview } from './avatar--group-icon.preview';
import { AvatarGroupPreview } from './avatar--group.preview';
import { AvatarSizesPreview } from './avatar--sizes.preview';
import { AvatarPreview, defaultImports, defaultSkeleton } from './avatar.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Avatar', api: 'avatar' },
	meta: metaWith('spartan/ui - Avatar', 'An image element with a fallback for representing the user.'),
	title: 'spartan/ui - Avatar',
};

@Component({
	selector: 'spartan-avatar',
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
		SectionSubSubHeading,
		AvatarPreview,
		AvatarBasicPreview,
		AvatarBadgePreview,
		AvatarBadgeIconPreview,
		AvatarSizesPreview,
		AvatarGroupPreview,
		AvatarGroupCountPreview,
		AvatarGroupIconPreview,
		AvatarDropdownPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Avatar" lead="An image element with a fallback for representing the user." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui avatar" ngCode="ng g @spartan-ng/cli:ui avatar" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__basic" spartanH4>Basic</h3>
			<p class="${hlmP}">A basic avatar component with an image and a fallback.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-basic-preview />
				</div>
				<spartan-code secondTab [code]="_basicCode()" />
			</spartan-tabs>

			<h3 id="examples__badge" spartanH4>Badge</h3>
			<p class="${hlmP}">
				Use the
				<code class="${hlmCode}">hlm-avatar-badge</code>
				component to add a badge to the avatar. The badge is positioned at the bottom right of the avatar.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-badge-preview />
				</div>
				<spartan-code secondTab [code]="_badgeCode()" />
			</spartan-tabs>

			<h3 id="examples__badge-icon" spartanH4>Badge Icon</h3>
			<p class="${hlmP}">
				You can also use an icon inside
				<code class="${hlmCode}">hlm-avatar-badge</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-badge-icon-preview />
				</div>
				<spartan-code secondTab [code]="_badgeIconCode()" />
			</spartan-tabs>

			<h3 id="examples___avatar-group" spartanH4>Avatar Group</h3>
			<p class="${hlmP}">
				Use the
				<code class="${hlmCode}">hlm-avatar-group</code>
				component to add a group of avatars.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-group-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="examples___avatar-group-count" spartanH4>Avatar Group Count</h3>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">hlm-avatar-group-count</code>
				to add a count to the group.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-group-count-preview />
				</div>
				<spartan-code secondTab [code]="_groupCountCode()" />
			</spartan-tabs>

			<h3 id="examples___avatar-group-icon" spartanH4>Avatar Group Icon</h3>
			<p class="${hlmP}">
				You can also use an icon inside
				<code class="${hlmCode}">hlm-avatar-group-count</code>
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-group-icon-preview />
				</div>
				<spartan-code secondTab [code]="_groupIconCode()" />
			</spartan-tabs>

			<h3 id="examples__sizes" spartanH4>Sizes</h3>
			<p class="${hlmP}">
				Use the
				<code class="${hlmCode}">size</code>
				prop to change the size of the avatar.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-sizes-preview />
				</div>
				<spartan-code secondTab [code]="_sizesCode()" />
			</spartan-tabs>

			<h3 id="examples__dropdown" spartanH4>Dropdown</h3>
			<p class="${hlmP}">
				You can use the
				<code class="${hlmCode}">hlm-avatar</code>
				component as trigger for a dropdown menu.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-avatar-dropdown-preview />
				</div>
				<spartan-code secondTab [code]="_dropdownCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="badge" label="Badge" />
				<spartan-page-bottom-nav-link direction="previous" href="autocomplete" label="Autocomplete" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AvatarPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('avatar');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _basicCode = computed(() => this._snippets()['basic']);
	protected readonly _badgeCode = computed(() => this._snippets()['badge']);
	protected readonly _badgeIconCode = computed(() => this._snippets()['badgeIcon']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _groupCountCode = computed(() => this._snippets()['groupCount']);
	protected readonly _groupIconCode = computed(() => this._snippets()['groupIcon']);
	protected readonly _sizesCode = computed(() => this._snippets()['sizes']);
	protected readonly _dropdownCode = computed(() => this._snippets()['dropdown']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
