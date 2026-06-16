import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-checkboxes',
	imports: [HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-40">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Appearance</hlm-dropdown-menu-label>

					<button hlmDropdownMenuCheckbox [checked]="statusBar()" (triggered)="statusBar.set(!statusBar())">
						Status Bar
						<hlm-dropdown-menu-checkbox-indicator />
					</button>

					<button
						hlmDropdownMenuCheckbox
						disabled
						[checked]="activityBar()"
						(triggered)="activityBar.set(!activityBar())"
					>
						Activity Bar
						<hlm-dropdown-menu-checkbox-indicator />
					</button>

					<button hlmDropdownMenuCheckbox [checked]="panel()" (triggered)="panel.set(!panel())">
						Panel
						<hlm-dropdown-menu-checkbox-indicator />
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownCheckboxes {
	public readonly statusBar = signal(true);
	public readonly activityBar = signal(false);
	public readonly panel = signal(false);
}
