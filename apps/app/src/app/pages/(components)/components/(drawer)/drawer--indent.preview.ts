import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnDrawerImports } from '@spartan-ng/brain/drawer';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-indent-preview',
	imports: [BrnDrawerImports, HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block h-full' },
	template: `
		<!-- In your root component: the provider tracks the drawers opened inside it. -->
		<div brnDrawerProvider class="h-full">
			<div brnDrawerIndentBackground class="fixed inset-0 bg-black dark:bg-neutral-300"></div>
			<div
				brnDrawerIndent
				class="bg-background relative flex min-h-full origin-[center_top] [transform:scale(1)_translateY(0)] items-center justify-center [transition-duration:calc(400ms*var(--indent-transition)),calc(250ms*var(--indent-transition))] will-change-transform [--indent-radius:calc(1rem*(1-var(--drawer-swipe-progress)))] [--indent-transition:calc(1-clamp(0,calc(var(--drawer-swipe-progress)*100000),1))] [transition:transform_0.4s_cubic-bezier(0.32,0.72,0,1),border-radius_0.25s_cubic-bezier(0.32,0.72,0,1)] data-active:transform-[scale(calc(0.98+(0.02*var(--drawer-swipe-progress))))_translateY(calc(0.5rem*(1-var(--drawer-swipe-progress))))] data-active:rounded-t-(--indent-radius)"
			>
				<!-- Your app content, e.g. <router-outlet /> -->
				<!-- "reposition" keeps the page in place: on iOS, the default scroll lock repaints the indent. -->
				<hlm-drawer showSwipeHandle scrollStrategy="reposition">
					<button id="drawer-indent-trigger" hlmDrawerTrigger hlmBtn variant="outline">Open Drawer</button>
					<hlm-drawer-content *hlmDrawerPortal="let ctx">
						<hlm-drawer-header>
							<h3 hlmDrawerTitle>Notifications</h3>
							<p hlmDrawerDescription>You are all caught up. Good job!</p>
						</hlm-drawer-header>
						<hlm-drawer-footer class="pt-4">
							<button hlmDrawerClose hlmBtn variant="outline">Close</button>
						</hlm-drawer-footer>
					</hlm-drawer-content>
				</hlm-drawer>
			</div>
		</div>
	`,
})
export class DrawerIndentPreview {}
