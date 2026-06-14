import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-direction-preview',
	imports: [HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer>
			<div class="flex flex-wrap gap-2">
				<button id="bottom" hlmDrawerTrigger direction="bottom" hlmBtn variant="outline">Bottom</button>
				<button id="top" hlmDrawerTrigger direction="top" hlmBtn variant="outline">Top</button>
				<button id="left" hlmDrawerTrigger direction="left" hlmBtn variant="outline">Left</button>
				<button id="right" hlmDrawerTrigger direction="right" hlmBtn variant="outline">Right</button>
			</div>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Edit profile</h3>
					<p hlmDrawerDescription>Make changes to your profile here. Click save when you're done.</p>
				</hlm-drawer-header>
				<div class="px-4">
					@for (item of _items; track item) {
						<p class="mb-4 leading-normal">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</p>
					}
				</div>
				<hlm-drawer-footer>
					<button hlmBtn>Save changes</button>
					<button hlmBtn variant="outline" hlmDrawerClose>Cancel</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerDirectionPreview {
	protected readonly _items = Array.from({ length: 3 }, (_, i) => i + 1);
}
