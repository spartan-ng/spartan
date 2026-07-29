import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
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
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { AttachmentGroupPreview } from './attachment--group.preview';
import { AttachmentImagePreview } from './attachment--image.preview';
import { AttachmentRtlPreview } from './attachment--rtl.preview';
import { AttachmentSizesPreview } from './attachment--sizes.preview';
import { AttachmentStatesPreview } from './attachment--states.preview';
import { AttachmentTriggerPreview } from './attachment--trigger.preview';
import { AttachmentPreview, defaultImports, defaultSkeleton } from './attachment.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Attachment', api: 'attachment' },
	meta: metaWith(
		'spartan/ui - Attachment',
		'Displays file and image attachments with media, metadata, upload state, and actions.',
	),
	title: 'spartan/ui - Attachment',
};

@Component({
	selector: 'spartan-attachment',
	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		SectionSubSubHeading,
		Tabs,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		AttachmentPreview,
		AttachmentImagePreview,
		AttachmentStatesPreview,
		AttachmentSizesPreview,
		AttachmentGroupPreview,
		AttachmentTriggerPreview,
		RtlHeader,
		CodeRtlPreview,
		AttachmentRtlPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Attachment"
				lead="Displays file and image attachments with media, metadata, upload state, and actions."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue bg-surface dark:bg-background !h-auto !min-h-0">
					<spartan-attachment-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="attachment" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<p class="${hlmP}">Compose attachments inside a message bubble or as a standalone file card.</p>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__image" spartanH4>Image</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue bg-surface dark:bg-background !h-auto !min-h-0">
					<spartan-attachment-image-preview />
				</div>
				<spartan-code secondTab [code]="_imageCode()" />
			</spartan-tabs>

			<h3 id="examples__states" spartanH4>States</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue bg-surface dark:bg-background !h-auto !min-h-0">
					<spartan-attachment-states-preview />
				</div>
				<spartan-code secondTab [code]="_statesCode()" />
			</spartan-tabs>

			<h3 id="examples__sizes" spartanH4>Sizes</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue bg-surface dark:bg-background !h-auto !min-h-0">
					<spartan-attachment-sizes-preview />
				</div>
				<spartan-code secondTab [code]="_sizesCode()" />
			</spartan-tabs>

			<h3 id="examples__group" spartanH4>Group</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue bg-surface dark:bg-background !h-auto !min-h-0">
					<spartan-attachment-group-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="examples__trigger" spartanH4>Trigger</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">hlmAttachmentTrigger</code>
				to make the whole card open a dialog or link while keeping actions independently clickable.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue bg-surface dark:bg-background !h-auto !min-h-0">
					<spartan-attachment-trigger-preview />
				</div>
				<spartan-code secondTab [code]="_triggerCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-attachment-rtl-preview />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="autocomplete" label="Autocomplete" />
				<spartan-page-bottom-nav-link direction="previous" href="aspect-ratio" label="Aspect Ratio" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AttachmentPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('attachment');
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _imageCode = computed(() => this._snippets()['image']);
	protected readonly _statesCode = computed(() => this._snippets()['states']);
	protected readonly _sizesCode = computed(() => this._snippets()['sizes']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _triggerCode = computed(() => this._snippets()['trigger']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
}
