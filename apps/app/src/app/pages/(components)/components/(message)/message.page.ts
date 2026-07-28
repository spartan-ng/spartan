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
import { MessageActionsPreview } from './message--actions.preview';
import { MessageAttachmentPreview } from './message--attachment.preview';
import { MessageAvatarPreview } from './message--avatar.preview';
import { MessageGroupPreview } from './message--group.preview';
import { MessageHeaderFooterPreview } from './message--header-footer.preview';
import { MessageRtlPreview } from './message--rtl.preview';
import { defaultImports, defaultSkeleton, MessagePreview } from './message.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Message', api: 'message' },
	meta: metaWith(
		'spartan/ui - Message',
		'Displays a message in a conversation, with optional avatar, header, footer, and alignment.',
	),
	title: 'spartan/ui - Message',
};

@Component({
	selector: 'spartan-message',
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
		MessagePreview,
		MessageAvatarPreview,
		MessageGroupPreview,
		MessageHeaderFooterPreview,
		MessageActionsPreview,
		MessageAttachmentPreview,
		RtlHeader,
		CodeRtlPreview,
		MessageRtlPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Message"
				lead="Displays a message in a conversation, with optional avatar, header, footer, and alignment."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="message" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<p class="${hlmP}">
				<code class="${hlmCode}">Message</code>
				owns the row layout — avatar, alignment, header, and footer. Render the visible message surface with
				<code class="${hlmCode}">Bubble</code>
				.
			</p>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__avatar" spartanH4>Avatar</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">hlmMessageAvatar</code>
				to render an avatar next to the message. Set
				<code class="${hlmCode}">align="end"</code>
				to flip the row.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-avatar-preview />
				</div>
				<spartan-code secondTab [code]="_avatarCode()" />
			</spartan-tabs>

			<h3 id="examples__group" spartanH4>Group</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">hlmMessageGroup</code>
				to stack consecutive messages from the same sender. Render an empty avatar slot on earlier messages to keep
				alignment.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-group-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="examples__header_footer" spartanH4>Header and Footer</h3>
			<p class="${hlmP} mb-2">
				Use
				<code class="${hlmCode}">hlmMessageHeader</code>
				for a sender name and
				<code class="${hlmCode}">hlmMessageFooter</code>
				for metadata such as delivery status.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-header-footer-preview />
				</div>
				<spartan-code secondTab [code]="_headerFooterCode()" />
			</spartan-tabs>

			<h3 id="examples__actions" spartanH4>Actions</h3>
			<p class="${hlmP} mb-2">
				Place message-level actions in
				<code class="${hlmCode}">hlmMessageFooter</code>
				, such as copy, retry, or feedback buttons.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-actions-preview />
				</div>
				<spartan-code secondTab [code]="_actionsCode()" />
			</spartan-tabs>

			<h3 id="examples__attachment" spartanH4>Attachment</h3>
			<p class="${hlmP} mb-2">
				Compose
				<code class="${hlmCode}">Attachment</code>
				inside
				<code class="${hlmCode}">hlmMessageContent</code>
				alongside bubbles.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab class="theme-blue !h-auto !min-h-0">
					<spartan-message-attachment-preview />
				</div>
				<spartan-code secondTab [code]="_attachmentCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-message-rtl-preview />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="native-select" label="Native Select" />
				<spartan-page-bottom-nav-link direction="previous" href="menubar" label="Menubar" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class MessagePage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('message');
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _avatarCode = computed(() => this._snippets()['avatar']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _headerFooterCode = computed(() => this._snippets()['headerFooter']);
	protected readonly _actionsCode = computed(() => this._snippets()['actions']);
	protected readonly _attachmentCode = computed(() => this._snippets()['attachment']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
}
