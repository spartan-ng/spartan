import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-position-preview',
	imports: [HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer swipeDirection="left">
			<button id="drawer-position-trigger" hlmDrawerTrigger hlmBtn variant="secondary">Open Left Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Move Goal</h3>
					<p hlmDrawerDescription>Set your daily activity goal.</p>
				</hlm-drawer-header>
				<div class="flex-1 p-4">
					<div class="bg-muted size-full rounded-2xl"></div>
				</div>
				<hlm-drawer-footer>
					<button hlmDrawerClose hlmBtn>Close</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerPositionPreview {}
