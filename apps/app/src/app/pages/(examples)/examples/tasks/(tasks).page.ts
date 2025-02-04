import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown, lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';
import { TableActionsComponent } from '@spartan-ng/app/app/pages/(examples)/examples/tasks/components/table-actions.component';
import { Payment, TasksService } from '@spartan-ng/app/app/pages/(examples)/examples/tasks/services/tasks.service';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { BrnTableModule, PaginatorState } from '@spartan-ng/brain/table';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';

// TODO: remove links:
// https://ui.shadcn.com/examples/tasks
// https://spartan.ng/components/select
@Component({
	selector: 'spartan-data-table-preview',
	standalone: true,
	imports: [
		FormsModule,

		BrnMenuTriggerDirective,
		HlmMenuModule,

		BrnTableModule,
		HlmTableModule,

		HlmButtonModule,

		DecimalPipe,
		TitleCasePipe,
		HlmIconDirective,

		HlmCheckboxComponent,

		BrnSelectModule,
		HlmSelectModule,
		TableActionsComponent,
		NgIcon,
	],
	providers: [provideIcons({ lucideChevronDown, lucideEllipsis, lucideArrowUpDown })],
	host: {
		class: 'w-full',
	},
	template: `
		<div class="h-full flex-1 flex-col space-y-8 p-8 py-6">
			<div class="wip-header">
				<h2 class="text-2xl font-bold tracking-tight">Welcome back!</h2>
				<p class="text-muted-foreground">Here's a list of your tasks for this month!</p>
			</div>

			<table-actions />

			<div class="wip-table">
				<brn-table
					hlm
					stickyHeader
					class="border-border mt-4 block h-[335px] overflow-auto rounded-md border"
					[dataSource]="tableSource()"
					[displayedColumns]="allDisplayedColumns()"
					[trackBy]="trackBy"
				>
					<brn-column-def name="select" class="w-12">
						<hlm-th *brnHeaderDef>
							<hlm-checkbox [checked]="checkboxState()" (changed)="handleHeaderCheckboxChange()" />
						</hlm-th>
						<hlm-td *brnCellDef="let element">
							<hlm-checkbox [checked]="isPaymentSelected(element)" (changed)="togglePayment(element)" />
						</hlm-td>
					</brn-column-def>
					<brn-column-def name="status" class="w-32 sm:w-40">
						<hlm-th truncate *brnHeaderDef>Status</hlm-th>
						<hlm-td truncate *brnCellDef="let element">
							{{ element.status | titlecase }}
						</hlm-td>
					</brn-column-def>
					<brn-column-def name="email" class="w-60 lg:flex-1">
						<hlm-th *brnHeaderDef>
							<button hlmBtn size="sm" variant="ghost" (click)="handleEmailSortChange()">
								Email
								<ng-icon hlm class="ml-3" size="sm" name="lucideArrowUpDown" />
							</button>
						</hlm-th>
						<hlm-td truncate *brnCellDef="let element">
							{{ element.email }}
						</hlm-td>
					</brn-column-def>
					<brn-column-def name="amount" class="w-20 justify-end">
						<hlm-th *brnHeaderDef>Amount</hlm-th>
						<hlm-td class="font-medium tabular-nums" *brnCellDef="let element">
							$ {{ element.amount | number: '1.2-2' }}
						</hlm-td>
					</brn-column-def>
					<brn-column-def name="actions" class="w-16">
						<hlm-th *brnHeaderDef></hlm-th>
						<hlm-td *brnCellDef="let element">
							<button hlmBtn variant="ghost" class="h-6 w-6 p-0.5" align="end" [brnMenuTriggerFor]="menu">
								<ng-icon hlm size="sm" name="lucideEllipsis" />
							</button>

							<ng-template #menu>
								<hlm-menu>
									<hlm-menu-label>Actions</hlm-menu-label>
									<hlm-menu-separator />
									<hlm-menu-group>
										<button hlmMenuItem>Copy payment ID</button>
									</hlm-menu-group>
									<hlm-menu-separator />
									<hlm-menu-group>
										<button hlmMenuItem>View customer</button>
										<button hlmMenuItem>View payment details</button>
									</hlm-menu-group>
								</hlm-menu>
							</ng-template>
						</hlm-td>
					</brn-column-def>
					<div class="text-muted-foreground flex items-center justify-center p-20" brnNoDataRow>No data</div>
				</brn-table>
				<div
					class="mt-4 flex flex-col justify-between sm:flex-row sm:items-center"
					*brnPaginator="let ctx; totalElements: totalElements(); pageSize: pageSize(); onStateChange: _onStateChange"
				>
					<span class="text-muted-foreground text-sm">
						{{ selected().length }} of {{ totalElements() }} row(s) selected
					</span>
					<div class="mt-2 flex sm:mt-0">
						<brn-select class="inline-block" placeholder="{{ availablePageSizes[0] }}" [(ngModel)]="pageSize">
							<hlm-select-trigger class="w-15 mr-1 inline-flex h-9">
								<hlm-select-value />
							</hlm-select-trigger>
							<hlm-select-content>
								@for (size of availablePageSizes; track size) {
									<hlm-option [value]="size">
										{{ size === 10000 ? 'All' : size }}
									</hlm-option>
								}
							</hlm-select-content>
						</brn-select>

						<div class="flex space-x-1">
							<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.decrementable()" (click)="ctx.decrement()">
								Previous
							</button>
							<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.incrementable()" (click)="ctx.increment()">
								Next
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
export default class TasksExamplePageComponent {
	private readonly _tasksService = inject(TasksService);

	protected readonly trackBy: TrackByFunction<Payment> = (_: number, p: Payment) => p.id;
	protected readonly totalElements = computed(() => this._tasksService._filteredPayments().length);
	protected readonly availablePageSizes = [5, 10, 20, 10000];
	protected readonly pageSize = signal(this.availablePageSizes[0]);

	protected readonly allDisplayedColumns = this._tasksService.getAllDisplayedColumns();
	protected readonly selected = this._tasksService.getSelected();
	protected readonly checkboxState = this._tasksService.getCheckboxState();
	protected readonly tableSource = this._tasksService.getFilteredSortedPaginatedTasks();

	protected readonly isPaymentSelected = (payment: Payment) => this._tasksService.isPaymentSelected(payment);

	handleEmailSortChange() {
		this._tasksService.handleEmailSortChange();
	}

	togglePayment(payment: Payment) {
		this._tasksService.togglePayment(payment);
	}

	handleHeaderCheckboxChange() {
		this._tasksService.handleHeaderCheckboxChange();
	}

	protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
		this._tasksService.setDisplayedIndices(startIndex, endIndex);
}
