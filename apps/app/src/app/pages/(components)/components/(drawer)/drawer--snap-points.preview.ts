import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-snap-points-preview',
	imports: [HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer [snapPoints]="_snapPoints" showSwipeHandle>
			<button id="drawer-snap-points-trigger" hlmDrawerTrigger hlmBtn variant="outline">Open Snap Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Snap points</h3>
					<p hlmDrawerDescription>Drag the drawer to snap between a compact peek and a near full-height view.</p>
				</hlm-drawer-header>
				<div class="flex-1 p-4">
					<div
						class="bg-muted rounded-2xl group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full"
					></div>
				</div>
				<hlm-drawer-footer>
					<button hlmDrawerClose hlmBtn>Close</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerSnapPointsPreview {
	protected readonly _snapPoints = ['31rem', 1];
}
