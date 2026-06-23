import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideMenu,
	lucideMoon,
	lucideRedo2,
	lucideRotateCw as lucideReset,
	lucideRotateCcw,
	lucideRotateCw,
	lucideShuffle,
	lucideSun,
	lucideUndo2,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { DesignSystemService } from '../lib/design-system.service';

@Component({
	selector: 'spartan-main-menu',
	imports: [HlmButton, HlmPopoverImports, NgIcon],
	providers: [
		provideIcons({
			lucideMenu,
			lucideRotateCcw,
			lucideRotateCw,
			lucideShuffle,
			lucideMoon,
			lucideSun,
			lucideUndo2,
			lucideRedo2,
			lucideReset,
		}),
	],
	template: `
		<hlm-popover sideOffset="5" align="end">
			<button hlmPopoverTrigger hlmBtn variant="ghost" size="icon-xs" title="Menu">
				<ng-icon name="lucideMenu" size="16" />
			</button>
			<div *hlmPopoverPortal="let ctx" hlmPopoverContent class="w-56 p-1">
				<div class="space-y-0.5">
					<button hlmBtn variant="ghost" size="sm" class="w-full justify-start gap-2" (click)="_undo(ctx)">
						<ng-icon name="lucideUndo2" size="14" />
						<span class="flex-1 text-left">Undo</span>
						<kbd class="text-muted-foreground ml-auto text-xs">Ctrl+Z</kbd>
					</button>
					<button hlmBtn variant="ghost" size="sm" class="w-full justify-start gap-2" (click)="_redo(ctx)">
						<ng-icon name="lucideRedo2" size="14" />
						<span class="flex-1 text-left">Redo</span>
						<kbd class="text-muted-foreground ml-auto text-xs">Ctrl+Shift+Z</kbd>
					</button>
					<div hlmPopoverSeparator></div>
					<button hlmBtn variant="ghost" size="sm" class="w-full justify-start gap-2" (click)="_shuffle(ctx)">
						<ng-icon name="lucideShuffle" size="14" />
						<span class="flex-1 text-left">Shuffle</span>
						<kbd class="text-muted-foreground ml-auto text-xs">R</kbd>
					</button>
					<button hlmBtn variant="ghost" size="sm" class="w-full justify-start gap-2" (click)="_reset(ctx)">
						<ng-icon name="lucideRotateCcw" size="14" />
						<span class="flex-1 text-left">Reset</span>
						<kbd class="text-muted-foreground ml-auto text-xs">Shift+R</kbd>
					</button>
					<div hlmPopoverSeparator></div>
					<button hlmBtn variant="ghost" size="sm" class="w-full justify-start gap-2" (click)="_toggleDark(ctx)">
						<ng-icon [name]="_ds.darkMode() ? 'lucideSun' : 'lucideMoon'" size="14" />
						<span class="flex-1 text-left">{{ _ds.darkMode() ? 'Light' : 'Dark' }}</span>
						<kbd class="text-muted-foreground ml-auto text-xs">D</kbd>
					</button>
				</div>
			</div>
		</hlm-popover>
	`,
})
export class MainMenu {
	protected readonly _ds = inject(DesignSystemService);

	protected _undo(ctx: { close: () => void }): void {
		this._ds.undo();
		ctx.close();
	}

	protected _redo(ctx: { close: () => void }): void {
		this._ds.redo();
		ctx.close();
	}

	protected _shuffle(ctx: { close: () => void }): void {
		this._ds.randomize();
		ctx.close();
	}

	protected _reset(ctx: { close: () => void }): void {
		this._ds.reset();
		ctx.close();
	}

	protected _toggleDark(ctx: { close: () => void }): void {
		this._ds.darkMode.set(!this._ds.darkMode());
		ctx.close();
	}
}
