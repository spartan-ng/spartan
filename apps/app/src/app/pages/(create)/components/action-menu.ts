import { Component, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideMoon,
	lucideRedo2,
	lucideRotateCcw,
	lucideSearch,
	lucideShuffle,
	lucideTerminal,
	lucideUndo2,
	lucideUpload,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { DesignSystemService } from '../lib/design-system.service';

@Component({
	selector: 'spartan-action-menu',
	imports: [HlmButton, HlmCommandImports, NgIcon],
	providers: [
		provideIcons({
			lucideSearch,
			lucideRotateCcw,
			lucideShuffle,
			lucideMoon,
			lucideUndo2,
			lucideRedo2,
			lucideUpload,
			lucideTerminal,
		}),
	],
	template: `
		<hlm-command-dialog [state]="open()" (stateChange)="openChange.emit($event)" dialogContentClass="sm:max-w-lg">
			<hlm-command class="w-full">
				<hlm-command-input placeholder="Type a command..." />
				<hlm-command-list class="max-h-64">
					<hlm-command-group>
						<button hlm-command-item (selected)="_randomize()" [value]="'Randomize'">
							<ng-icon name="lucideShuffle" class="mr-2" size="16" />
							<span>Randomize (R)</span>
						</button>
						<button hlm-command-item (selected)="_reset()" [value]="'Reset'">
							<ng-icon name="lucideRotateCcw" class="mr-2" size="16" />
							<span>Reset to Defaults (Shift+R)</span>
						</button>
						<button hlm-command-item (selected)="_toggleDark()" [value]="'Dark Mode'">
							<ng-icon name="lucideMoon" class="mr-2" size="16" />
							<span>Toggle Dark Mode (D)</span>
						</button>
						<button hlm-command-item (selected)="_undo()" [value]="'Undo'">
							<ng-icon name="lucideUndo2" class="mr-2" size="16" />
							<span>Undo (Ctrl+Z)</span>
						</button>
						<button hlm-command-item (selected)="_redo()" [value]="'Redo'">
							<ng-icon name="lucideRedo2" class="mr-2" size="16" />
							<span>Redo (Ctrl+Shift+Z)</span>
						</button>
					</hlm-command-group>
				</hlm-command-list>
				<div *hlmCommandEmptyState hlmCommandEmpty>No results found.</div>
			</hlm-command>
		</hlm-command-dialog>
	`,
})
export class ActionMenu {
	protected readonly _ds = inject(DesignSystemService);

	public readonly open = input(false);
	public readonly openChange = output<boolean>();

	protected _randomize(): void {
		this._ds.randomize();
		this.openChange.emit(false);
	}

	protected _reset(): void {
		this._ds.reset();
		this.openChange.emit(false);
	}

	protected _toggleDark(): void {
		this._ds.darkMode.set(!this._ds.darkMode());
		this.openChange.emit(false);
	}

	protected _undo(): void {
		this._ds.undo();
		this.openChange.emit(false);
	}

	protected _redo(): void {
		this._ds.redo();
		this.openChange.emit(false);
	}
}
