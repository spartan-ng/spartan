import { Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideUndo2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-dropdown-with-context',
	imports: [HlmDropdownMenuImports, HlmButtonImports, HlmIconImports],
	providers: [provideIcons({ lucideUndo2 })],
	template: `
		<div class="flex w-full items-center justify-center pt-[20%]">
			<button
				hlmBtn
				variant="outline"
				align="center"
				[hlmDropdownMenuTrigger]="menu"
				[hlmDropdownMenuTriggerData]="{ $implicit: { data: 'Context Window Full' } }"
			>
				Open
			</button>
		</div>
		<ng-template #menu let-ctx>
			<hlm-dropdown-menu class="w-56">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Context</hlm-dropdown-menu-label>
					<button hlmDropdownMenuItem inset>{{ ctx.data }}</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Appearance</hlm-dropdown-menu-label>

					<button hlmDropdownMenuCheckbox [checked]="statusBar()" (triggered)="statusBar.set(!statusBar())">
						<hlm-dropdown-menu-checkbox-indicator />
						<span>Status Bar</span>
					</button>

					<button
						hlmDropdownMenuCheckbox
						disabled
						[checked]="activityBar()"
						(triggered)="activityBar.set(!activityBar())"
					>
						<hlm-dropdown-menu-checkbox-indicator />
						<span>Activity Bar</span>
					</button>

					<button hlmDropdownMenuCheckbox [checked]="panel()" (triggered)="panel.set(!panel())">
						<hlm-dropdown-menu-checkbox-indicator />
						<span>Panel</span>
					</button>
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<hlm-dropdown-menu-label>Panel Position</hlm-dropdown-menu-label>

				<hlm-dropdown-menu-group>
					@for (size of panelPositions; track size) {
						<button hlmDropdownMenuRadio [checked]="size === selectedPosition" (triggered)="selectedPosition = size">
							<hlm-dropdown-menu-radio-indicator />
							<span>{{ size }}</span>
						</button>
					}
				</hlm-dropdown-menu-group>

				<hlm-dropdown-menu-separator />

				<button hlmDropdownMenuItem (triggered)="reset()">
					<ng-icon hlm name="lucideUndo2" size="sm" />
					Reset
				</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownWithContextPreview {
	public readonly statusBar = signal(true);
	public readonly activityBar = signal(false);
	public readonly panel = signal(false);

	public panelPositions = ['Top', 'Bottom', 'Right', 'Left'] as const;
	public selectedPosition: (typeof this.panelPositions)[number] | undefined = 'Bottom';

	reset() {
		this.statusBar.set(false);
		this.panel.set(false);
		this.activityBar.set(false);
		this.selectedPosition = 'Bottom';
	}
}
