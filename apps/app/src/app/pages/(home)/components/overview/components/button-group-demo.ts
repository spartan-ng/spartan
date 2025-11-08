import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArchive,
	lucideArrowLeft,
	lucideCalendarPlus,
	lucideChevronRight,
	lucideClock,
	lucideEllipsis,
	lucideListFilterPlus,
	lucideMailCheck,
	lucideTag,
	lucideTrash,
} from '@ng-icons/lucide';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-button-group-demo',
	imports: [HlmButtonGroupImports, BrnMenuTrigger, HlmMenuImports, HlmButton, NgIcon, HlmIcon],
	providers: [
		provideIcons({
			lucideArrowLeft,
			lucideEllipsis,
			lucideMailCheck,
			lucideArchive,
			lucideClock,
			lucideCalendarPlus,
			lucideTag,
			lucideChevronRight,
			lucideTrash,
			lucideListFilterPlus,
		}),
	],
	template: `
		<div hlmButtonGroup>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="icon-sm" aria-label="Go Back">
					<ng-icon name="lucideArrowLeft" />
				</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="sm">Archive</button>
				<button hlmBtn variant="outline" size="sm">Report</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline" size="sm">Snooze</button>
				<button hlmBtn variant="outline" size="sm" align="end" [brnMenuTriggerFor]="menu">
					<ng-icon name="lucideEllipsis" />
				</button>
			</div>
		</div>
		<ng-template #menu>
			<hlm-menu class="w-56">
				<hlm-menu-group>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideMailCheck" size="sm" />
						<span>Mark as Read</span>
					</button>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideArchive" size="sm" />
						<span>Archive</span>
					</button>
				</hlm-menu-group>
				<hlm-menu-separator />
				<hlm-menu-group>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideClock" size="sm" />
						<span>Snooze</span>
					</button>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideCalendarPlus" size="sm" />
						<span>Add to Calendar</span>
					</button>
					<button hlmMenuItem>
						<ng-icon hlm name="lucideListFilterPlus" size="sm" />
						<span>Add to List</span>
					</button>
					<button hlmMenuItem class="flex justify-between" [brnMenuTriggerFor]="submenu">
						<div class="flex items-center gap-2">
							<ng-icon hlm name="lucideTag" size="sm" />
							<span>Label as...</span>
						</div>
						<ng-icon hlm name="lucideChevronRight" size="sm" />
					</button>
				</hlm-menu-group>
				<hlm-menu-separator />
				<hlm-menu-group>
					<button hlmMenuItem variant="destructive" class="hover:bg-destructive/10 dark:hover:bg-destructive/40">
						<ng-icon hlm name="lucideTrash" size="sm" class="!text-destructive" />
						<span>Delete</span>
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>

		<ng-template #submenu>
			<hlm-sub-menu class="w-40">
				<button hlmMenuItemRadio [checked]="label() === 'personal'" (click)="label.set('personal')">
					<hlm-menu-item-radio />
					<span>Personal</span>
				</button>
				<button hlmMenuItemRadio [checked]="label() === 'work'" (click)="label.set('work')">
					<hlm-menu-item-radio />
					<span>Work</span>
				</button>
				<button hlmMenuItemRadio [checked]="label() === 'other'" (click)="label.set('other')">
					<hlm-menu-item-radio />
					<span>Other</span>
				</button>
			</hlm-sub-menu>
		</ng-template>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupDemo {
	public readonly label = signal('personal');
}
