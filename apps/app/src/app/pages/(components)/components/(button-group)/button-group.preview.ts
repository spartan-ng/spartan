import { Component, signal } from '@angular/core';
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
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-button-group-preview',
	imports: [HlmButtonImports, HlmButtonGroupImports, HlmDropdownMenuImports, NgIcon],
	providers: [
		provideIcons({
			lucideArrowLeft,
			lucideEllipsis,
			lucideMailCheck,
			lucideArchive,
			lucideClock,
			lucideCalendarPlus,
			lucideListFilterPlus,
			lucideTag,
			lucideTrash,
			lucideChevronRight,
		}),
	],
	template: `
		<div hlmButtonGroup>
			<div hlmButtonGroup class="hidden sm:flex">
				<button hlmBtn variant="outline" size="icon" aria-label="Go Back">
					<ng-icon name="lucideArrowLeft" />
				</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline">Archive</button>
				<button hlmBtn variant="outline">Report</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline">Snooze</button>
				<button hlmBtn variant="outline" aria-label="More Options" [hlmDropdownMenuTrigger]="menu" align="end">
					<ng-icon name="lucideEllipsis" />
				</button>
			</div>
		</div>
		<ng-template #menu>
			<hlm-dropdown-menu class="w-52">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideMailCheck" />
						<span>Mark as Read</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideArchive" />
						<span>Archive</span>
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideClock" />
						<span>Snooze</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideCalendarPlus" />
						<span>Add to Calendar</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideListFilterPlus" />
						<span>Add to List</span>
					</button>
					<button
						hlmDropdownMenuItem
						class="flex justify-between"
						align="start"
						side="right"
						[hlmDropdownMenuTrigger]="submenu"
					>
						<div class="flex items-center gap-2">
							<ng-icon name="lucideTag" />
							<span>Label as...</span>
						</div>
						<ng-icon name="lucideChevronRight" />
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button
						hlmDropdownMenuItem
						variant="destructive"
						class="hover:bg-destructive/10 dark:hover:bg-destructive/40"
					>
						<ng-icon name="lucideTrash" />
						<span>Delete</span>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
		<ng-template #submenu>
			<hlm-dropdown-menu-sub class="w-40">
				<button hlmDropdownMenuRadio [checked]="label() === 'personal'" (click)="label.set('personal')">
					<hlm-dropdown-menu-radio-indicator />
					<span>Personal</span>
				</button>
				<button hlmDropdownMenuRadio [checked]="label() === 'work'" (click)="label.set('work')">
					<hlm-dropdown-menu-radio-indicator />
					<span>Work</span>
				</button>
				<button hlmDropdownMenuRadio [checked]="label() === 'other'" (click)="label.set('other')">
					<hlm-dropdown-menu-radio-indicator />
					<span>Other</span>
				</button>
			</hlm-dropdown-menu-sub>
		</ng-template>
	`,
})
export class ButtonGroupPreview {
	public readonly label = signal('personal');
}

export const defaultImports = `
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
`;

export const defaultSkeleton = `
<div hlmButtonGroup>
  <button hlmBtn variant="outline">Button 1</button>
  <button hlmBtn variant="outline">Button 2</button>
</div>
`;

export const accessibilityCode = `
<div hlmButtonGroup aria-label="Button group">
	<button hlmBtn variant="outline">Button 1</button>
	<button hlmBtn variant="outline">Button 2</button>
</div>
`;
