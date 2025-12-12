import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
		SectionSubSubHeading,
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
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui dialog" ngCode="ng g @spartan-ng/cli:ui dialog" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__declarative-usage" spartanH4>Declarative Usage</h3>
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

			<h3 id="examples__inside-menu" spartanH4>Inside Menu</h3>
			<p class="${hlmP} mb-6">
				You can nest dialogs inside context or dropdown menus. Make sure to wrap the menu-item inside the
				<code class="${hlmCode}">hlm-dialog</code>
				component and apply the
				<code class="${hlmCode}">HlmDialogTrigger</code>
				directive. Another option is to use the
				<code class="${hlmCode}">hlmDialogTriggerFor</code>
				alternative, which takes in a reference to the hlm-dialog. That way you can avoid nesting the template.
			</p>
			<div hlmAlert class="mb-6" variant="destructive">
				<ng-icon hlm name="lucideTriangleAlert" hlmAlertIcon />
				<p hlmAlertTitle>Note</p>
				<div hlmAlertDescription class="leading-loose">
					<p>
						Do not use the
						<code class="${hlmCode}">HlmDropdownMenuItem</code>
						directives as they conflict with
						<code class="${hlmCode}">HlmDialogTrigger</code>
						&
						<code class="${hlmCode}">hlmDialogTriggerFor</code>
						! We expose the hlm variants so you can directly use them to style your elements. Check out the code of the
						example below!
					</p>
				</div>
			</div>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-context-menu />
				</div>
				<spartan-code secondTab [code]="_contextMenuCode()" />
			</spartan-tabs>

			<h3 id="examples__dynamic-component" spartanH4>Dynamic Component</h3>
			<p class="${hlmP} mb-6">
				You can dynamically open a dialog with a component rendered as the content. The dialog context can be injected
				into the dynamic component using the provided
				<code class="${hlmCode}">injectBrnDialogContext</code>
				function.
			</p>
			<div hlmAlert class="mb-6" variant="destructive">
				<ng-icon hlm name="lucideTriangleAlert" hlmAlertIcon />
				<p hlmAlertTitle>Note</p>
				<div hlmAlertDescription class="leading-loose">
					<p>
						Avoid using the
						<code class="${hlmCode}">&lt;hlm-dialog-content&gt;</code>
						tag when your dialog relies on dynamic content. Using it in this case can cause the dialog to repeatedly
						render itself in a loop. The tag is meant to wrap static content for the dialog, but with a dynamic
						component, the component automatically acts as the wrapper.
					</p>
				</div>
			</div>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-dynamic-component-preview />
				</div>
				<spartan-code secondTab [code]="_dynamicComponentCode()" />
			</spartan-tabs>

			<h3 id="examples__close-dialog" spartanH4>Close Dialog</h3>
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

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dropdown-menu" label="Dropdown Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="date-picker" label="Date Picker" />
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
