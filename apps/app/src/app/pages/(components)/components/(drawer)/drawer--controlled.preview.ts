import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawer, HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
	selector: 'spartan-drawer-controlled-preview',
	imports: [HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-col items-center gap-4">
			<button id="drawer-controlled-open" hlmBtn variant="outline" (click)="openDrawer()">Open Controlled</button>
			<p class="text-muted-foreground text-sm">Last result: {{ result() ?? 'none' }}</p>
		</div>

		<hlm-drawer (closed)="onClosed($event)">
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Save changes?</h3>
					<p hlmDrawerDescription>This drawer is opened and closed from code, without a trigger.</p>
				</hlm-drawer-header>
				<hlm-drawer-footer>
					<button hlmBtn (click)="closeDrawer('saved')">Save</button>
					<button hlmBtn variant="outline" (click)="closeDrawer('discarded')">Discard</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerControlledPreview {
	private readonly _drawer = viewChild.required(HlmDrawer);

	public readonly result = signal<string | null>(null);

	public openDrawer(): void {
		this._drawer().open();
	}

	public closeDrawer(result: string): void {
		this._drawer().close(result);
	}

	public onClosed(result: unknown): void {
		// Escape, an outside click or a swipe close the drawer without a result.
		this.result.set(typeof result === 'string' ? result : 'dismissed');
	}
}
