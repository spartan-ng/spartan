import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-swipe-area-preview',
	imports: [HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'relative flex h-80 w-full items-center justify-center overflow-hidden' },
	template: `
		<hlm-drawer showSwipeHandle>
			<p class="text-muted-foreground text-sm">Swipe up from the bar below to open the drawer.</p>
			<hlm-drawer-swipe-area
				id="drawer-swipe-area"
				class="absolute inset-x-6 bottom-0 flex h-12 cursor-grab items-center justify-center rounded-t-xl border border-b-0 border-dashed active:cursor-grabbing"
			>
				<span class="bg-muted-foreground/40 h-1 w-12 rounded-full"></span>
			</hlm-drawer-swipe-area>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Swipe Area</h3>
					<p hlmDrawerDescription>Opened by swiping up from the edge.</p>
				</hlm-drawer-header>
				<div class="flex-1 p-4">
					<div class="bg-muted h-60 w-full rounded-2xl"></div>
				</div>
				<hlm-drawer-footer>
					<button hlmDrawerClose hlmBtn>Close</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerSwipeAreaPreview {}
