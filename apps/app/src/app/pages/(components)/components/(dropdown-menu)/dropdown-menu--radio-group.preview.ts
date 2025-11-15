import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BrnMenuImports, BrnMenuSide } from '@spartan-ng/brain/menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-dropdown-menu-radio-group',
	imports: [HlmMenuImports, HlmButtonImports, BrnMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [brnMenuTriggerFor]="menu">Open</button>

		<ng-template #menu>
			<hlm-menu class="w-56">
				<hlm-menu-group>
					<hlm-menu-label>Panel Position</hlm-menu-label>
					<hlm-menu-separator />
					@let p = position();
					<button hlmMenuItemRadio [checked]="p === 'top'" (triggered)="position.set('top')">
						<hlm-menu-item-radio />
						<span>Top</span>
					</button>
					<button hlmMenuItemRadio [checked]="p === 'bottom'" (triggered)="position.set('bottom')">
						<hlm-menu-item-radio />
						<span>Bottom</span>
					</button>
					<button hlmMenuItemRadio [checked]="p === 'right'" (triggered)="position.set('right')">
						<hlm-menu-item-radio />
						<span>Right</span>
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>
	`,
})
export class DropdownMenuRadioGroup {
	public readonly position = signal<BrnMenuSide>('bottom');
}
