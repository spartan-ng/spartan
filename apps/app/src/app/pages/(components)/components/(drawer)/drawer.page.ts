import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { injectComponentDocs } from '@spartan-ng/app/app/core/services/component-docs';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
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
import { DrawerNestedPreview } from './drawer--nested.preview';
import { DrawerNonModalPreview } from './drawer--non-modal.preview';
import { DrawerPositionPreview } from './drawer--position.preview';
import { DrawerResponsivePreview } from './drawer--responsive.preview';
import { DrawerRtl } from './drawer--rtl.preview';
import { DrawerSnapPointsPreview } from './drawer--snap-points.preview';
import { DrawerSwipeAreaPreview } from './drawer--swipe-area.preview';
import { DrawerSwipeHandlePreview } from './drawer--swipe-handle.preview';
import { DrawerPreview, defaultImports, defaultSkeleton } from './drawer.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Drawer', api: 'drawer' },
	meta: metaWith('spartan/ui - Drawer', 'A panel that slides in from the edge of the screen.'),
	title: 'spartan/ui - Drawer',
};
@Component({
	selector: 'spartan-drawer',

	imports: [
		UIApiDocs,
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,

		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SectionSubSubHeading,
		RtlHeader,
		CodeRtlPreview,
		DrawerPreview,
		DrawerPositionPreview,
		DrawerSwipeHandlePreview,
		DrawerSwipeAreaPreview,
		DrawerNestedPreview,
		DrawerNonModalPreview,
		DrawerSnapPointsPreview,
		DrawerResponsivePreview,
		DrawerRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Drawer"
				showThemeToggle
				lead="A panel that slides in from the edge of the screen. Supports swipe to dismiss, snap points and nested drawers."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="drawer" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="composition">Composition</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">Use the following composition to build a drawer:</p>
			<spartan-code [code]="_composition" />
			<p class="${hlmP}">
				<code class="${hlmCode}">hlm-drawer-content</code>
				composes the viewport, popup and content area of the brain drawer, and
				<code class="${hlmCode}">hlm-drawer</code>
				renders the overlay. For lower-level control,
				<code class="${hlmCode}">hlmDrawerOverlay</code>
				and
				<code class="${hlmCode}">hlm-drawer-swipe-handle</code>
				are also exported, and the brain primitives (
				<code class="${hlmCode}">brnDrawerViewport</code>
				,
				<code class="${hlmCode}">brnDrawerPopup</code>
				,
				<code class="${hlmCode}">brnDrawerContent</code>
				, ...) can be composed directly.
			</p>

			<spartan-section-sub-heading id="custom-sizes">Custom Sizes</spartan-section-sub-heading>
			<p class="${hlmP}">
				A vertical drawer sizes itself to its content and is capped at
				<code class="${hlmCode}">calc(100dvh - 6rem)</code>
				by default. A side drawer spans
				<code class="${hlmCode}">75%</code>
				of the viewport width, or
				<code class="${hlmCode}">24rem</code>
				on larger screens. Use the
				<code class="${hlmCode}">h-*</code>
				/
				<code class="${hlmCode}">max-h-*</code>
				or
				<code class="${hlmCode}">w-*</code>
				/
				<code class="${hlmCode}">max-w-*</code>
				utilities on
				<code class="${hlmCode}">hlm-drawer-content</code>
				, and scope an override to one axis with the
				<code class="${hlmCode}">data-[swipe-axis=*]</code>
				variants.
			</p>
			<div class="mt-6">
				<spartan-code [code]="_customSizes" />
			</div>
			<p class="${hlmP}">
				To make a region scrollable, make the scroll container a flex item (
				<code class="${hlmCode}">flex-1 overflow-y-auto</code>
				). Avoid
				<code class="${hlmCode}">h-full</code>
				, which does not resolve inside a content-sized drawer.
			</p>

			<spartan-section-sub-heading id="styling">Styling</spartan-section-sub-heading>
			<p class="${hlmP}">The drawer exposes CSS variables and data attributes for style-level customization:</p>
			<ul class="${hlmUl}">
				<li>
					<code class="${hlmCode}">--drawer-inset</code>
					(on the content): floats the drawer from the viewport edges.
				</li>
				<li>
					<code class="${hlmCode}">--drawer-bleed-background</code>
					(on the content): fills the gap behind the drawer on swipe overshoot.
				</li>
				<li>
					<code class="${hlmCode}">--drawer-overlay-min-opacity</code>
					(on the overlay): the minimum overlay opacity,
					<code class="${hlmCode}">0.5</code>
					when snap points are active.
				</li>
				<li>
					<code class="${hlmCode}">data-swipe-direction</code>
					,
					<code class="${hlmCode}">data-swipe-axis</code>
					,
					<code class="${hlmCode}">data-snap-points</code>
					,
					<code class="${hlmCode}">data-expanded</code>
					,
					<code class="${hlmCode}">data-swiping</code>
					and
					<code class="${hlmCode}">data-nested-drawer-open</code>
					on the popup, e.g.
					<code class="${hlmCode}">data-[swipe-direction=down]:</code>
					on the content or
					<code class="${hlmCode}">group-data-[swipe-axis=y]/drawer-popup:</code>
					on its descendants.
				</li>
			</ul>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="position" spartanH4>Position</h3>
			<p class="${hlmP} mb-6">
				Use the
				<code class="${hlmCode}">swipeDirection</code>
				input to set the side of the drawer. Available options are
				<code class="${hlmCode}">up</code>
				,
				<code class="${hlmCode}">right</code>
				,
				<code class="${hlmCode}">down</code>
				and
				<code class="${hlmCode}">left</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-position-preview />
				</div>
				<spartan-code secondTab [code]="_positionCode()" />
			</spartan-tabs>

			<h3 id="swipe-handle" spartanH4>Swipe Handle</h3>
			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">showSwipeHandle</code>
				to render a handle at the edge of the drawer. A mouse drag starts from the handle, touch can swipe from anywhere
				in the drawer.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-swipe-handle-preview />
				</div>
				<spartan-code secondTab [code]="_swipeHandleCode()" />
			</spartan-tabs>

			<h3 id="swipe-area" spartanH4>Swipe Area</h3>
			<p class="${hlmP} mb-6">
				Place an
				<code class="${hlmCode}">hlm-drawer-swipe-area</code>
				inside the drawer to open it by swiping from the screen edge it comes from. It is invisible and sits on that
				edge by default; the example makes it visible inside the preview.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-swipe-area-preview />
				</div>
				<spartan-code secondTab [code]="_swipeAreaCode()" />
			</spartan-tabs>

			<h3 id="nested" spartanH4>Nested</h3>
			<p class="${hlmP} mb-6">
				Place an
				<code class="${hlmCode}">hlm-drawer</code>
				inside the content of another drawer. Parent drawers stay mounted, step back, and follow the swipe of the
				frontmost drawer.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-nested-preview />
				</div>
				<spartan-code secondTab [code]="_nestedCode()" />
			</spartan-tabs>

			<h3 id="non-modal" spartanH4>Non Modal</h3>
			<p class="${hlmP} mb-6">
				Set
				<code class="${hlmCode}">[modal]="false"</code>
				to keep the page interactive while the drawer is open, and
				<code class="${hlmCode}">[closeOnOutsidePointerEvents]="false"</code>
				to keep it open on outside clicks.
				<code class="${hlmCode}">modal="trap-focus"</code>
				traps focus without locking the page.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-non-modal-preview />
				</div>
				<spartan-code secondTab [code]="_nonModalCode()" />
			</spartan-tabs>

			<h3 id="snap-points" spartanH4>Snap Points</h3>
			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">snapPoints</code>
				to let a vertical drawer rest at several heights: fractions of the viewport (
				<code class="${hlmCode}">0</code>
				-
				<code class="${hlmCode}">1</code>
				), pixel numbers, or
				<code class="${hlmCode}">px</code>
				/
				<code class="${hlmCode}">rem</code>
				strings. Bind
				<code class="${hlmCode}">[(snapPoint)]</code>
				to control the active point.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-snap-points-preview />
				</div>
				<spartan-code secondTab [code]="_snapPointsCode()" />
			</spartan-tabs>

			<h3 id="responsive" spartanH4>Responsive</h3>
			<p class="${hlmP} mb-6">Render a dialog on desktop and a drawer on mobile.</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-drawer-responsive-preview />
				</div>
				<spartan-code secondTab [code]="_responsiveCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-drawer-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="migration">Migrating from the vaul based drawer</spartan-section-sub-heading>
			<p class="${hlmP}">
				The drawer is now a port of the Base UI drawer. Add the helm drawer again with the CLI, then update usages:
			</p>
			<ul class="${hlmUl}">
				<li>
					<code class="${hlmCode}">direction</code>
					on the trigger becomes
					<code class="${hlmCode}">swipeDirection</code>
					on
					<code class="${hlmCode}">hlm-drawer</code>
					, and
					<code class="${hlmCode}">top</code>
					/
					<code class="${hlmCode}">bottom</code>
					are now
					<code class="${hlmCode}">up</code>
					/
					<code class="${hlmCode}">down</code>
					.
				</li>
				<li>
					<code class="${hlmCode}">data-vaul-drawer-direction</code>
					is now
					<code class="${hlmCode}">data-swipe-direction</code>
					, set on the popup.
				</li>
				<li>
					<code class="${hlmCode}">BrnDrawerHandle</code>
					and
					<code class="${hlmCode}">closeThreshold</code>
					are removed: swiping is built into the viewport, and
					<code class="${hlmCode}">showSwipeHandle</code>
					renders a handle.
				</li>
				<li>
					The structural
					<code class="${hlmCode}">BrnDrawerContent</code>
					is now
					<code class="${hlmCode}">BrnDrawerPortal</code>
					(
					<code class="${hlmCode}">BrnDrawerContent</code>
					is the content area), and
					<code class="${hlmCode}">BrnDrawerOverlay</code>
					is now
					<code class="${hlmCode}">BrnDrawerBackdrop</code>
					.
				</li>
			</ul>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dropdown-menu" label="Dropdown Menu" />
				<spartan-page-bottom-nav-link direction="previous" href="dialog" label="Dialog" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class DrawerPage {
	constructor() {
		injectComponentDocs();
	}

	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('drawer');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _positionCode = computed(() => this._snippets()['position']);
	protected readonly _swipeHandleCode = computed(() => this._snippets()['swipeHandle']);
	protected readonly _swipeAreaCode = computed(() => this._snippets()['swipeArea']);
	protected readonly _nestedCode = computed(() => this._snippets()['nested']);
	protected readonly _nonModalCode = computed(() => this._snippets()['nonModal']);
	protected readonly _snapPointsCode = computed(() => this._snippets()['snapPoints']);
	protected readonly _responsiveCode = computed(() => this._snippets()['responsive']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _composition = `hlm-drawer
├── button[hlmDrawerTrigger]
└── hlm-drawer-content *hlmDrawerPortal
    ├── hlm-drawer-header
    │   ├── [hlmDrawerTitle]
    │   └── [hlmDrawerDescription]
    └── hlm-drawer-footer`;
	protected readonly _customSizes = `<!-- vertical drawer height -->
<hlm-drawer-content *hlmDrawerPortal="let ctx" class="h-[50vh]">

<!-- side drawer width -->
<hlm-drawer-content *hlmDrawerPortal="let ctx" class="w-96">

<!-- scoped to one axis -->
<hlm-drawer-content *hlmDrawerPortal="let ctx" class="data-[swipe-axis=y]:max-h-[50vh] data-[swipe-axis=x]:w-96">`;
}
