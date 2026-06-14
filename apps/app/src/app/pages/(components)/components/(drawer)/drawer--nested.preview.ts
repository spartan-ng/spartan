import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-nested-preview',
	imports: [HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer>
			<button hlmDrawerTrigger hlmBtn variant="outline">Open Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Profile Settings</h3>
					<p hlmDrawerDescription>Manage your account settings.</p>
				</hlm-drawer-header>
				<div class="px-4">
					<p class="mb-4 leading-normal">This is the first drawer. You can open another drawer on top of this one.</p>
					<hlm-drawer>
						<button hlmDrawerTrigger hlmBtn variant="outline">Open Nested</button>
						<hlm-drawer-content *hlmDrawerPortal="let nestedCtx">
							<hlm-drawer-header>
								<h3 hlmDrawerTitle>Nested Drawer</h3>
								<p hlmDrawerDescription>This drawer is nested inside the first one.</p>
							</hlm-drawer-header>
							<div class="px-4">
								<p class="mb-4 leading-normal">Nested drawers allow you to layer content without losing context.</p>
							</div>
							<hlm-drawer-footer>
								<button hlmDrawerClose hlmBtn variant="outline">Close</button>
							</hlm-drawer-footer>
						</hlm-drawer-content>
					</hlm-drawer>
				</div>
				<hlm-drawer-footer>
					<button hlmDrawerClose hlmBtn variant="outline">Close</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerNestedPreview {}
