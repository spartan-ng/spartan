import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-preview',
	imports: [HlmDrawerImports, HlmButtonImports],
	template: `
		<button hlmBtn variant="outline" (click)="_open.set(true)">Open Drawer</button>

		<hlm-drawer [isOpen]="_open()" (dismissed)="_open.set(false)">
			<div hlmDrawerHeader>
				<h2 hlmDrawerTitle>Edit Profile</h2>
				<p hlmDrawerDescription>Make changes to your profile here. Click save when you're done.</p>
			</div>

			<div class="p-4">
				<p class="text-muted-foreground text-sm">Swipe the drawer down to close, or tap the backdrop.</p>
			</div>

			<div hlmDrawerFooter>
				<button hlmBtn (click)="_open.set(false)">Save Changes</button>
				<button hlmBtn variant="ghost" (click)="_open.set(false)">Cancel</button>
			</div>
		</hlm-drawer>
	`,
})
export class DrawerPreview {
	protected readonly _open = signal(false);
}

export const defaultImports = `
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
`;

export const defaultSkeleton = `
<button hlmBtn variant="outline" (click)="open.set(true)">Open Drawer</button>

<hlm-drawer [isOpen]="open()" (dismissed)="open.set(false)">
  <div hlmDrawerHeader>
    <h2 hlmDrawerTitle>Edit Profile</h2>
    <p hlmDrawerDescription>Make changes to your profile here.</p>
  </div>

  <!-- body content -->

  <div hlmDrawerFooter>
    <button hlmBtn (click)="open.set(false)">Save Changes</button>
  </div>
</hlm-drawer>
`;
