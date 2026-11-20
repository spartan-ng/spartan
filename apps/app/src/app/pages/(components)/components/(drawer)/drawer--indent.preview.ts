import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnDrawerImports } from '@spartan-ng/brain/drawer';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-indent-preview',
	imports: [BrnDrawerImports, HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'block w-full' },
	template: `
		<div brnDrawerProvider class="relative isolate h-80 w-full overflow-hidden rounded-xl border">
			<div brnDrawerIndentBackground class="absolute inset-0 -z-10 bg-black"></div>
			<div
				brnDrawerIndent
				class="bg-background flex h-full origin-top flex-col items-center justify-center gap-4 transition-[transform,border-radius] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] data-active:scale-[calc(0.94+0.06*var(--drawer-swipe-progress))] data-active:rounded-xl"
			>
				<p class="text-muted-foreground text-sm">The app content steps back while the drawer is open.</p>
				<hlm-drawer>
					<button id="drawer-indent-trigger" hlmDrawerTrigger hlmBtn variant="outline">Open Drawer</button>
					<hlm-drawer-content *hlmDrawerPortal="let ctx">
						<hlm-drawer-header>
							<h3 hlmDrawerTitle>Indent</h3>
							<p hlmDrawerDescription>Swipe down and the page behind follows the drawer back.</p>
						</hlm-drawer-header>
						<div class="flex-1 p-4">
							<div class="bg-muted h-40 w-full rounded-2xl"></div>
						</div>
						<hlm-drawer-footer>
							<button hlmDrawerClose hlmBtn>Close</button>
						</hlm-drawer-footer>
					</hlm-drawer-content>
				</hlm-drawer>
			</div>
		</div>
	`,
})
export class DrawerIndentPreview {}
