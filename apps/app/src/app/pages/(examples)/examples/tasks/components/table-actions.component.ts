import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGlobe, lucideMicVocal } from '@ng-icons/lucide';
import { TasksService } from '@spartan-ng/app/app/pages/(examples)/examples/tasks/services/tasks.service';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmMenuImports } from '@spartan-ng/ui-menu-helm';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'table-actions',
	standalone: true,
	host: {
		class: 'block',
	},
	imports: [
		HlmButtonDirective,
		FormsModule,
		HlmInputDirective,
		BrnMenuTriggerDirective,
		HlmMenuImports,
		NgIcon,
		HlmIconDirective,
	],
	providers: [provideIcons({ lucideMicVocal, lucideGlobe })],
	template: `
		<div class="wip-table-search flex flex-col justify-between gap-4 sm:flex-row">
			<div class="wip-table-search flex flex-col justify-between gap-4 sm:flex-row">
				<input
					hlmInput
					class="w-full md:w-80"
					placeholder="Filter emails..."
					[ngModel]="emailFilter()"
					(ngModelChange)="rawFilterInput.set($event)"
				/>

				<button [brnMenuTriggerFor]="status">Status</button>

				<ng-template #status>
					<hlm-menu variant="menubar" class="w-48">
						<hlm-menu-group>
							<button inset hlmMenuItem>Show Playing Next</button>
							<button hlmMenuItemCheckbox checked>
								<hlm-menu-item-check />
								Show Lyrics
							</button>
							<hlm-menu-separator />

							<button inset hlmMenuItem disabled>Show Status Bar</button>
							<hlm-menu-separator />

							<button inset hlmMenuItem>Hide Sidebar</button>
							<button inset hlmMenuItem disabled>Enter Full Screen</button>
						</hlm-menu-group>
					</hlm-menu>
				</ng-template>
			</div>

			<button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">
				Columns
				<ng-icon hlm name="lucideChevronDown" class="ml-2" size="sm" />
			</button>
			<ng-template #menu>
				<hlm-menu class="w-32">
					@for (column of columnManager.allColumns; track column.name) {
						<button
							hlmMenuItemCheckbox
							[disabled]="columnManager.isColumnDisabled(column.name)"
							[checked]="columnManager.isColumnVisible(column.name)"
							(triggered)="columnManager.toggleVisibility(column.name)"
						>
							<hlm-menu-item-check />
							<span>{{ column.label }}</span>
						</button>
					}
				</hlm-menu>
			</ng-template>
		</div>
	`,
})
export class TableActionsComponent {
	private readonly _tasksService = inject(TasksService);

	protected readonly columnManager = this._tasksService.getColumnManager();
	protected readonly emailFilter = this._tasksService.getEmailFilter();
	protected readonly rawFilterInput = this._tasksService.getRawFilterInput()
}
