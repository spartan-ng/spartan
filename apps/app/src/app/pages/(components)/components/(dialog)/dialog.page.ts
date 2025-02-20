import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { DialogClosePreviewComponent, defaultCloseCode } from './dialog-close.preview';
import { DialogContextMenuPreviewComponent, contextMenuCode } from './dialog-context-menu.preview';
import { DialogDeclarativePreviewComponent, declarativeCode } from './dialog-declarative.preview';
import { DialogDynamicComponentPreviewComponent, dynamicComponentCode } from './dialog-dynamic-component.preview';
import { DialogPreviewComponent, defaultCode, defaultImports, defaultSkeleton } from './dialog.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Dialog' },
	meta: metaWith(
		'spartan/ui - Dialog',
		'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
	),
	title: 'spartan/ui - Dialog',
};
@Component({
	selector: 'spartan-dialog',
	imports: [
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		TabsCliComponent,
		CodePreviewDirective,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		DialogPreviewComponent,
		DialogPreviewComponent,
		DialogContextMenuPreviewComponent,
		DialogDynamicComponentPreviewComponent,
		HlmAlertDirective,
		HlmAlertDescriptionDirective,
		NgIcon,
		HlmIconDirective,
		HlmAlertIconDirective,
		HlmAlertTitleDirective,
		DialogDeclarativePreviewComponent,
		DialogClosePreviewComponent,
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
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui dialog"
				ngCode="ng g @spartan-ng/cli:ui dialog"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="dynamic-component">Declarative Usage</spartan-section-sub-heading>
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
				<spartan-code secondTab [code]="declarativeCode" />
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
				<spartan-code secondTab [code]="contextMenuCode" />
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
				<spartan-code secondTab [code]="dynamicComponentCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="dynamic-component">Close Dialog</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				You can close the dialog by using a directive, a template reference, or a viewchild/contentchild reference to
				the dialog.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-dialog-close-preview />
				</div>
				<spartan-code secondTab [code]="defaultCloseCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dropdown-menu" label="Dropdown Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="data-table" label="Data Table" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DialogPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
	protected readonly contextMenuCode = contextMenuCode;
	protected readonly dynamicComponentCode = dynamicComponentCode;
	protected readonly declarativeCode = declarativeCode;
	protected readonly defaultCloseCode = defaultCloseCode;
}
