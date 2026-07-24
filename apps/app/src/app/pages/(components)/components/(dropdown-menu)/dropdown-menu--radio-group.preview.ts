import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MenuSide } from '@spartan-ng/brain/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dropdown-radio-group',
	imports: [HlmDropdownMenuImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-32">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Panel Position</hlm-dropdown-menu-label>
					@let p = position();
					<button hlmDropdownMenuRadio [checked]="p === 'top'" (triggered)="position.set('top')">
						Top
						<hlm-dropdown-menu-radio-indicator />
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'bottom'" (triggered)="position.set('bottom')">
						Bottom
						<hlm-dropdown-menu-radio-indicator />
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'right'" (triggered)="position.set('right')">
						Right
						<hlm-dropdown-menu-radio-indicator />
					</button>
					<button hlmDropdownMenuRadio [checked]="p === 'left'" (triggered)="position.set('left')">
						Left
						<hlm-dropdown-menu-radio-indicator />
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DropdownRadioGroup {
	public readonly position = signal<MenuSide>('bottom');
}
