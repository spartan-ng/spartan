import { Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideUndo2 } from '@ng-icons/lucide';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-dropdown-with-context',
	imports: [BrnMenuImports, HlmMenuImports, HlmButtonImports, HlmIconImports],
	providers: [provideIcons({ lucideUndo2 })],
	template: `
		<div class="flex w-full items-center justify-center pt-[20%]">
			<button
				hlmBtn
				variant="outline"
				align="center"
				[brnMenuTriggerFor]="menu"
				[brnMenuTriggerData]="{ $implicit: { data: 'Context Window Full' } }"
			>
				Open
			</button>
		</div>
		<ng-template #menu let-ctx>
			<hlm-menu class="w-56">
				<hlm-menu-group>
					<hlm-menu-label>Context</hlm-menu-label>
					<button hlmMenuItem inset>{{ ctx.data }}</button>
				</hlm-menu-group>
				<hlm-menu-group>
					<hlm-menu-label>Appearance</hlm-menu-label>

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

				<hlm-menu-separator />

				<hlm-menu-label>Panel Position</hlm-menu-label>

				<hlm-menu-group>
					@for (size of panelPositions; track size) {
						<button hlmMenuItemRadio [checked]="size === selectedPosition" (triggered)="selectedPosition = size">
							<hlm-menu-item-radio />
							<span>{{ size }}</span>
						</button>
					}
				</hlm-menu-group>

				<hlm-menu-separator />

				<button hlmMenuItem (triggered)="reset()">
					<ng-icon hlm name="lucideUndo2" hlmMenuIcon />
					Reset
				</button>
			</hlm-menu>
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
