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
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-button-group-dropdown-menu',
	imports: [HlmIconImports, HlmButtonImports, HlmButtonGroupImports, BrnMenuImports, HlmMenuImports],
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
			<button hlmBtn variant="outline" size="icon" [brnMenuTriggerFor]="menu" align="end">
				<ng-icon hlm name="lucideChevronDown" size="sm" />
			</button>
		</div>
		<ng-template #menu>
			<hlm-menu class="w-[49] [--radius:1rem]">
				<hlm-menu-group>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideVolumeOff" size="sm" />
						<span>Muted Conversation</span>
					</button>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideCheck" size="sm" />
						<span>Mark as Read</span>
					</button>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideTriangleAlert" size="sm" />
						<span>Report Conversation</span>
					</button>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideUserRoundX" size="sm" />
						<span>Block User</span>
					</button>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideShare" size="sm" />
						<span>Share Conversation</span>
					</button>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideCopy" size="sm" />
						<span>Copy Conversation</span>
					</button>
				</hlm-menu-group>
				<hlm-menu-separator />
				<hlm-menu-group>
					<button hlmMenuItem variant="destructive" class="hover:bg-destructive/10 dark:hover:bg-destructive/40">
						<ng-icon hlm name="lucideTrash" size="sm" class="!text-destructive" />
						<span>Delete Conversation</span>
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>
	`,
})
export class ButtonGroupDropdownMenu {}
