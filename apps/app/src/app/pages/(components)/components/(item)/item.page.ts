import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { ItemAvatarPreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item--avatar.preview';
import { ItemDropdownPreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item--dropdown.preview';
import { ItemGroupPreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item--group.preview';
import { ItemHeaderPreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item--header.preview';
import { ItemIconPreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item--icon.preview';
import { ItemImagePreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item--image.preview';
import { ItemLinkPreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item--link.preview';
import { ItemSizePreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item--size.preview';
import { ItemVariantsPreview } from '@spartan-ng/app/app/pages/(components)/components/(item)/item--variants.preview';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { defaultImports, defaultSkeleton, ItemPreview } from './item.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'item', api: 'item' },
	meta: metaWith('spartan/ui - item', 'A versatile component that you can use to display any content.'),
	title: 'spartan/ui - Item',
};

@Component({
	selector: 'spartan-item',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		ItemPreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
		SectionSubSubHeading,
		ItemVariantsPreview,
		ItemSizePreview,
		HlmP,
		HlmCode,
		ItemVariantsPreview,
		ItemVariantsPreview,
		ItemIconPreview,
		ItemAvatarPreview,
		ItemImagePreview,
		ItemGroupPreview,
		ItemHeaderPreview,
		ItemLinkPreview,
		ItemDropdownPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Item" lead="A versatile component that you can use to display any content." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui item" ngCode="ng g @spartan-ng/cli:ui item" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="item-vs-field">Item vs Field</spartan-section-sub-heading>
			<p hlmP>
				Use
				<span hlmCode>hlmField</span>
				if you need to display a form input such as a checkbox, input, radio, or select. If you only need to display
				content such as a title, description, and actions, use
				<span hlmCode>hlmItem</span>
				.
			</p>

			<h3 id="examples_variants" spartanH4>Variants</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-variants-preview />
				</div>
				<spartan-code secondTab [code]="_variantsCode()" />
			</spartan-tabs>

			<h3 id="examples_size" spartanH4>Size</h3>
			<p hlmP>
				The
				<span hlmCode>hlmItem</span>
				component has different sizes for different use cases. For example, you can use the
				<span hlmCode>sm</span>
				size for a compact item or the
				<span hlmCode>default</span>
				size for a standard item.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-size-preview />
				</div>
				<spartan-code secondTab [code]="_sizeCode()" />
			</spartan-tabs>

			<h3 id="examples_icon" spartanH4>Icon</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-icon-preview />
				</div>
				<spartan-code secondTab [code]="_iconCode()" />
			</spartan-tabs>

			<h3 id="examples_avatar" spartanH4>Avatar</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-avatar-preview />
				</div>
				<spartan-code secondTab [code]="_avatarCode()" />
			</spartan-tabs>

			<h3 id="examples_image" spartanH4>Image</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-image-preview />
				</div>
				<spartan-code secondTab [code]="_imageCode()" />
			</spartan-tabs>

			<h3 id="examples_group" spartanH4>Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-group-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="examples_header" spartanH4>Header</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-header-preview />
				</div>
				<spartan-code secondTab [code]="_headerCode()" />
			</spartan-tabs>

			<h3 id="examples_link" spartanH4>Link</h3>
			<p hlmP>
				To render an item as a link, use a
				<span hlmCode>anchor</span>
				element. The hover and focus states will be applied to the anchor element.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-link-preview />
				</div>
				<spartan-code secondTab [code]="_linkCode()" />
			</spartan-tabs>

			<h3 id="examples_dropdown" spartanH4>Dropdown</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-item-dropdown-preview />
				</div>
				<spartan-code secondTab [code]="_dropdownCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="kbd" label="Kbd" />
				<spartan-page-bottom-nav-link direction="previous" href="input-otp" label="Input OTP" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ItemPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('item');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _avatarCode = computed(() => this._snippets()['avatar']);
	protected readonly _dropdownCode = computed(() => this._snippets()['dropdown']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _headerCode = computed(() => this._snippets()['header']);
	protected readonly _iconCode = computed(() => this._snippets()['icon']);
	protected readonly _imageCode = computed(() => this._snippets()['image']);
	protected readonly _linkCode = computed(() => this._snippets()['link']);
	protected readonly _sizeCode = computed(() => this._snippets()['size']);
	protected readonly _variantsCode = computed(() => this._snippets()['variants']);

	protected readonly _imports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
