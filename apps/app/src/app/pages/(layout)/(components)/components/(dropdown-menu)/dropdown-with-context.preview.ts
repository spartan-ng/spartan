import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUndo2 } from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import {
	HlmMenuComponent,
	HlmMenuGroupComponent,
	HlmMenuItemCheckComponent,
	HlmMenuItemCheckboxDirective,
	HlmMenuItemDirective,
	HlmMenuItemIconDirective,
	HlmMenuItemRadioComponent,
	HlmMenuItemRadioDirective,
	HlmMenuLabelComponent,
	HlmMenuSeparatorComponent,
} from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-dropdown-with-context',
	imports: [
		BrnMenuTriggerDirective,
		HlmMenuComponent,
		HlmMenuItemDirective,
		HlmMenuLabelComponent,
		HlmMenuSeparatorComponent,
		HlmMenuItemIconDirective,
		HlmMenuItemCheckComponent,
		HlmMenuItemRadioComponent,
		HlmMenuGroupComponent,
		HlmMenuItemRadioDirective,
		HlmMenuItemCheckboxDirective,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
	],
	providers: [provideIcons({ lucideUndo2 })],
	template: `
		<div class="flex w-full items-center justify-center pt-[20%]">
			<button
				hlmBtn
				variant="outline"
				align="center"
				[brnMenuTriggerFor]="menu"
				[brnMenuTriggerData]="{ $implicit: { data: 'SomeContext' } }"
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

					<button hlmMenuItemCheckbox [checked]="isPanel" (triggered)="isPanel = !isPanel">
						<hlm-menu-item-check />
						<span>Panel</span>
					</button>

					<button hlmMenuItemCheckbox disabled [checked]="isActivityBar" (triggered)="isActivityBar = !isActivityBar">
						<hlm-menu-item-check />
						<span>Activity Bar</span>
					</button>

					<button hlmMenuItemCheckbox [checked]="isStatusBar" (triggered)="isStatusBar = !isStatusBar">
						<hlm-menu-item-check />
						<span>Status Bar</span>
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
export class DropdownWithContextPreviewComponent {
	public isStatusBar = false;
	public isPanel = false;
	public isActivityBar = false;

	public panelPositions = ['Top', 'Bottom', 'Right', 'Left'] as const;
	public selectedPosition: (typeof this.panelPositions)[number] | undefined = 'Bottom';

	reset() {
		this.isStatusBar = false;
		this.isPanel = false;
		this.isActivityBar = false;
		this.selectedPosition = 'Bottom';
	}
}
