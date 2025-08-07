import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { HlmAlert, HlmAlertDescription, HlmAlertIcon, HlmAlertTitle } from '@spartan-ng/helm/alert';
import { HlmIcon } from '@spartan-ng/helm/icon';
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
import { DialogClosePreview } from './dialog-close.preview';
import { DialogContextMenuPreview } from './dialog-context-menu.preview';
import { DialogDeclarativePreview } from './dialog-declarative.preview';
import { DialogDynamicPreview } from './dialog-dynamic-component.preview';
import { DialogPreview, defaultImports, defaultSkeleton } from './dialog.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Dialog', api: 'dialog' },
	meta: metaWith(
		'spartan/ui - Dialog',
		'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
	),
	title: 'spartan/ui - Dialog',
};
@Component({
	selector: 'spartan-dialog',
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
		DialogPreview,
		DialogPreview,
		DialogContextMenuPreview,
		DialogDynamicPreview,
		HlmAlert,
		HlmAlertDescription,
		NgIcon,
		HlmIcon,
		HlmAlertIcon,
		HlmAlertTitle,
		DialogDeclarativePreview,
		DialogClosePreview,
	],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Dialog"
				lead="A window overlaid on either the primary window or another dialog window, rendering the content underneath inert."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui dialog"
				ngCode="ng g @spartan-ng/cli:ui dialog"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="declarative-usage">Declarative Usage</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				Spartan's dialog supports declarative usage. Simply set it's state
				<code class="${hlmCode}">input</code>
				to
				<code class="${hlmCode}">open</code>
				or
				<code class="${hlmCode}">closed</code>
				and let spartan handle the rest. This allows you to leverage the power of declarative code, like listening to
				changes in an input field, debouncing the value, and opening the dialog only if the user's enters the correct
				passphrase.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-declarative-preview />
				</div>
				<spartan-code secondTab [code]="_declarativeCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="inside-menu">Inside Menu</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				You can nest dialogs inside context or dropdown menus. Make sure to wrap the menu-item inside the
				<code class="${hlmCode}">brn-dialog</code>
				component and apply the
				<code class="${hlmCode}">BrnDialogTrigger</code>
				directive. Another option is to use the
				<code class="${hlmCode}">brnDialogTriggerFor</code>
				alternative, which takes in a reference to the brn-dialog. That way you can avoid nesting the template.
			</p>
			<div hlmAlert class="mb-6" variant="destructive">
				<ng-icon hlm name="lucideTriangleAlert" hlmAlertIcon />
				<p hlmAlertTitle>Note</p>
				<p hlmAlertDescription class="leading-loose">
					Do not use the
					<code class="${hlmCode}">HlmMenuItem</code>
					or
					<code class="${hlmCode}">BrnMenuItem</code>
					directives as they conflict with
					<code class="${hlmCode}">BrnDialogTrigger</code>
					&
					<code class="${hlmCode}">brnDialogTriggerFor!</code>
					We expose the hlm variants so you can directly use them to style your elements. Check out the code of the
					example below!
				</p>
			</div>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-context-menu />
				</div>
				<spartan-code secondTab [code]="_contextMenuCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="dynamic-component">Dynamic Component</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				You can dynamically open a dialog with a component rendered as the content. The dialog context can be injected
				into the dynamic component using the provided
				<code class="${hlmCode}">injectBrnDialogContext</code>
				function.
			</p>
			<div hlmAlert class="mb-6" variant="destructive">
				<ng-icon hlm name="lucideTriangleAlert" hlmAlertIcon />
				<p hlmAlertTitle>Note</p>
				<p hlmAlertDescription class="leading-loose">
					Avoid using the
					<code class="${hlmCode}">&lt;hlm-dialog-content&gt;</code>
					tag when your dialog relies on dynamic content. Using it in this case can cause the dialog to repeatedly
					render itself in a loop. The tag is meant to wrap static content for the dialog, but with a dynamic component,
					the component automatically acts as the wrapper.
				</p>
			</div>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-dynamic-component-preview />
				</div>
				<spartan-code secondTab [code]="_dynamicComponentCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="close-dialog">Close Dialog</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				You can close the dialog by using a directive, a template reference, or a viewchild/contentchild reference to
				the dialog.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-close-preview />
				</div>
				<spartan-code secondTab [code]="_closeCode()" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dropdown-menu" label="Dropdown Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="data-table" label="Data Table" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DialogPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('dialog');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _contextMenuCode = computed(() => this._snippets()['contextMenu']);
	protected readonly _dynamicComponentCode = computed(() => this._snippets()['dynamicComponent']);
	protected readonly _declarativeCode = computed(() => this._snippets()['declarative']);
	protected readonly _closeCode = computed(() => this._snippets()['close']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
