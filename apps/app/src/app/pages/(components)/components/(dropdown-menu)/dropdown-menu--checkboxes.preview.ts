import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-menu-checkboxes',
	imports: [HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-56">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Appearance</hlm-dropdown-menu-label>

					<hlm-dropdown-menu-separator />

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
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownMenuCheckboxes {
	public readonly statusBar = signal(true);
	public readonly activityBar = signal(false);
	public readonly panel = signal(false);
}
