import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	lucideCheck,
	lucideChevronDown,
	lucideCopy,
	lucideShare,
	lucideTrash,
	lucideTriangleAlert,
	lucideUserRoundX,
	lucideVolumeOff,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-group-dropdown-menu',
	imports: [HlmIconImports, HlmButtonImports, HlmButtonGroupImports, HlmDropdownMenuImports],
	providers: [
		provideIcons({
			lucideChevronDown,
			lucideVolumeOff,
			lucideCheck,
			lucideTriangleAlert,
			lucideUserRoundX,
			lucideShare,
			lucideCopy,
			lucideTrash,
		}),
	],
	template: `
		<div hlmButtonGroup>
			<button hlmBtn variant="outline">Follow</button>
			<button hlmBtn variant="outline" size="icon" [hlmDropdownMenuTrigger]="menu" align="end">
				<ng-icon hlm name="lucideChevronDown" size="sm" />
			</button>
		</div>
		<ng-template #menu>
			<hlm-dropdown-menu class="w-[49] [--radius:1rem]">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideVolumeOff" size="sm" />
						<span>Muted Conversation</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideCheck" size="sm" />
						<span>Mark as Read</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideTriangleAlert" size="sm" />
						<span>Report Conversation</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideUserRoundX" size="sm" />
						<span>Block User</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideShare" size="sm" />
						<span>Share Conversation</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideCopy" size="sm" />
						<span>Copy Conversation</span>
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button
						hlmDropdownMenuItem
						variant="destructive"
						class="hover:bg-destructive/10 dark:hover:bg-destructive/40"
					>
						<ng-icon hlm name="lucideTrash" size="sm" class="!text-destructive" />
						<span>Delete Conversation</span>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ButtonGroupDropdownMenu {}
