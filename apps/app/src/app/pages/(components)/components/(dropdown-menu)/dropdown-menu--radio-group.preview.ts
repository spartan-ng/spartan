import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MenuSide } from '@spartan-ng/brain/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-menu-radio-group',
	imports: [HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-56">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Panel Position</hlm-dropdown-menu-label>
					<hlm-dropdown-menu-separator />
					@let p = position();
					<button hlmDropdownMenuRadio [checked]="p === 'top'" (triggered)="position.set('top')">
						<hlm-dropdown-menu-radio-indicator />
						<span>Top</span>
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'bottom'" (triggered)="position.set('bottom')">
						<hlm-dropdown-menu-radio-indicator />
						<span>Bottom</span>
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'right'" (triggered)="position.set('right')">
						<hlm-dropdown-menu-radio-indicator />
						<span>Right</span>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownMenuRadioGroup {
	public readonly position = signal<MenuSide>('bottom');
}
