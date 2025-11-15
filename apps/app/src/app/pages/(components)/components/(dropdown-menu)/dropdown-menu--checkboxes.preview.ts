import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-dropdown-menu-checkboxes',
	imports: [HlmMenuImports, HlmButtonImports, BrnMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [brnMenuTriggerFor]="menu">Open</button>

		<ng-template #menu>
			<hlm-menu class="w-56">
				<hlm-menu-group>
					<hlm-menu-label>Appearance</hlm-menu-label>

					<hlm-menu-separator />

					<button hlmMenuItemCheckbox [checked]="statusBar()" (triggered)="statusBar.set(!statusBar())">
						<hlm-menu-item-check />
						<span>Status Bar</span>
					</button>

					<button hlmMenuItemCheckbox disabled [checked]="activityBar()" (triggered)="activityBar.set(!activityBar())">
						<hlm-menu-item-check />
						<span>Activity Bar</span>
					</button>

					<button hlmMenuItemCheckbox [checked]="panel()" (triggered)="panel.set(!panel())">
						<hlm-menu-item-check />
						<span>Panel</span>
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>
	`,
})
export class DropdownMenuCheckboxes {
	public readonly statusBar = signal(true);
	public readonly activityBar = signal(false);
	public readonly panel = signal(false);
}
