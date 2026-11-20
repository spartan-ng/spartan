import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-non-modal-preview',
	imports: [HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer [modal]="false" [closeOnOutsidePointerEvents]="false" swipeDirection="right">
			<button id="drawer-non-modal-trigger" hlmDrawerTrigger hlmBtn variant="outline">Non Modal</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Non Modal Drawer</h3>
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
export class DrawerNonModalPreview {}
