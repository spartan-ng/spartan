import { BreakpointObserver } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { map } from 'rxjs/operators';

@Component({
	selector: 'spartan-drawer-nested-preview',
	imports: [NgTemplateOutlet, HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-template #placeholder>
			<div class="flex-1 p-4">
				<div
					class="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full"
				></div>
			</div>
		</ng-template>

		<hlm-drawer [showSwipeHandle]="_isMobile()" [swipeDirection]="_swipeDirection()">
			<button id="drawer-nested-trigger" hlmDrawerTrigger hlmBtn variant="secondary">Open Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Drawer</h3>
					<p hlmDrawerDescription>Open another drawer from the same direction.</p>
				</hlm-drawer-header>
				<ng-container [ngTemplateOutlet]="placeholder" />
				<hlm-drawer-footer>
					<hlm-drawer [showSwipeHandle]="_isMobile()" [swipeDirection]="_swipeDirection()">
						<button id="drawer-nested-trigger-2" hlmDrawerTrigger hlmBtn variant="outline">Open Nested Drawer</button>
						<hlm-drawer-content *hlmDrawerPortal="let ctx">
							<hlm-drawer-header>
								<h3 hlmDrawerTitle>Nested Drawer</h3>
								<p hlmDrawerDescription>The parent drawer stays mounted behind this one.</p>
							</hlm-drawer-header>
							<ng-container [ngTemplateOutlet]="placeholder" />
							<hlm-drawer-footer>
								<hlm-drawer [showSwipeHandle]="_isMobile()" [swipeDirection]="_swipeDirection()">
									<button id="drawer-nested-trigger-3" hlmDrawerTrigger hlmBtn variant="outline">
										Open Third Drawer
									</button>
									<hlm-drawer-content *hlmDrawerPortal="let ctx">
										<hlm-drawer-header>
											<h3 hlmDrawerTitle>Third Drawer</h3>
											<p hlmDrawerDescription>Two drawers are stacked behind this one.</p>
										</hlm-drawer-header>
										<ng-container [ngTemplateOutlet]="placeholder" />
										<hlm-drawer-footer>
											<hlm-drawer [showSwipeHandle]="_isMobile()" [swipeDirection]="_swipeDirection()">
												<button id="drawer-nested-trigger-4" hlmDrawerTrigger hlmBtn variant="outline">
													Open Fourth Drawer
												</button>
												<hlm-drawer-content *hlmDrawerPortal="let ctx">
													<hlm-drawer-header>
														<h3 hlmDrawerTitle>Fourth Drawer</h3>
														<p hlmDrawerDescription>This is the frontmost drawer in the stack.</p>
													</hlm-drawer-header>
													<ng-container [ngTemplateOutlet]="placeholder" />
													<hlm-drawer-footer>
														<button hlmDrawerClose hlmBtn variant="outline">Close</button>
													</hlm-drawer-footer>
												</hlm-drawer-content>
											</hlm-drawer>
											<button hlmDrawerClose hlmBtn variant="outline">Close</button>
										</hlm-drawer-footer>
									</hlm-drawer-content>
								</hlm-drawer>
								<button hlmDrawerClose hlmBtn variant="outline">Close</button>
							</hlm-drawer-footer>
						</hlm-drawer-content>
					</hlm-drawer>
					<button hlmDrawerClose hlmBtn variant="outline">Close</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerNestedPreview {
	protected readonly _isMobile = toSignal(
		inject(BreakpointObserver)
			.observe('(max-width: 767px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false },
	);
	protected readonly _swipeDirection = computed(() => (this._isMobile() ? 'down' : 'right'));
}
