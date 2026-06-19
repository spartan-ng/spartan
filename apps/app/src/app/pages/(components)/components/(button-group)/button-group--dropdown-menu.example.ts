import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
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

@Component({
	selector: 'spartan-button-group-dropdown-menu',
	imports: [HlmButtonImports, HlmButtonGroupImports, HlmDropdownMenuImports, NgIcon],
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
				<ng-icon name="lucideChevronDown" />
			</button>
		</div>
		<ng-template #menu>
			<hlm-dropdown-menu class="w-[49] [--radius:1rem]">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideVolumeOff" />
						<span>Muted Conversation</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideCheck" />
						<span>Mark as Read</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideTriangleAlert" />
						<span>Report Conversation</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideUserRoundX" />
						<span>Block User</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideShare" />
						<span>Share Conversation</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideCopy" />
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
						<ng-icon name="lucideTrash" class="!text-destructive" />
						<span>Delete Conversation</span>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ButtonGroupDropdownMenu {}
