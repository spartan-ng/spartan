import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, effect, signal, untracked, type TrackByFunction } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown, lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { BrnTableModule, useBrnColumnManager, type PaginatorState } from '@spartan-ng/brain/table';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { debounceTime, map } from 'rxjs/operators';

export type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

const PAYMENT_DATA: Payment[] = [
	{
		id: 'm5gr84i9',
		amount: 316,
		status: 'success',
		email: 'ken99@yahoo.com',
	},
	{
		id: '3u1reuv4',
		amount: 242,
		status: 'success',
		email: 'Abe45@gmail.com',
	},
	{
		id: 'derv1ws0',
		amount: 837,
		status: 'processing',
		email: 'Monserrat44@gmail.com',
	},
	{
		id: '5kma53ae',
		amount: 874,
		status: 'success',
		email: 'Silas22@gmail.com',
	},
	{
		id: 'bhqecj4p',
		amount: 721,
		status: 'failed',
		email: 'carmella@hotmail.com',
	},
	{
		id: 'p0r8sd2f',
		amount: 123,
		status: 'failed',
		email: 'john.doe@example.com',
	},
	{
		id: '8uyv3n1x',
		amount: 589,
		status: 'processing',
		email: 'emma.smith@gmail.com',
	},
	{
		id: '2zqo6ptr',
		amount: 456,
		status: 'success',
		email: 'jackson78@hotmail.com',
	},
	{
		id: 'l7we9a3m',
		amount: 632,
		status: 'success',
		email: 'grace_22@yahoo.com',
	},
	{
		id: 'o9p2v3qk',
		amount: 987,
		status: 'failed',
		email: 'robert.adams@gmail.com',
	},
	{
		id: 'q1o8r7mz',
		amount: 321,
		status: 'processing',
		email: 'alexander34@gmail.com',
	},
	{
		id: 'i5n3s0tv',
		amount: 555,
		status: 'failed',
		email: 'olivia_morris@hotmail.com',
	},
	{
		id: '3xr7s2nl',
		amount: 789,
		status: 'success',
		email: 'michael_cole@yahoo.com',
	},
	{
		id: 'u9v2p1qy',
		amount: 234,
		status: 'success',
		email: 'lily.jones@gmail.com',
	},
	{
		id: 'b4q0e1cp',
		amount: 876,
		status: 'failed',
		email: 'ryan_14@hotmail.com',
	},
	{
		id: 's1z8m7op',
		amount: 456,
		status: 'success',
		email: 'sophia.green@gmail.com',
	},
	{
		id: 'n5a3v0lt',
		amount: 987,
		status: 'failed',
		email: 'david.miller@yahoo.com',
	},
	{
		id: '2qr7v9sm',
		amount: 654,
		status: 'processing',
		email: 'emma_jones@hotmail.com',
	},
	{
		id: 'y9b2h8qq',
		amount: 789,
		status: 'success',
		email: 'jacob_89@gmail.com',
	},
	{
		id: 'c4a0r1xp',
		amount: 123,
		status: 'failed',
		email: 'samantha.richards@yahoo.com',
	},
];

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
		NgIcon,
		HlmIconDirective,
		HlmInputDirective,

		HlmCheckboxComponent,

		BrnSelectModule,
		HlmSelectModule,
	],
	providers: [provideIcons({ lucideChevronDown, lucideEllipsis, lucideArrowUpDown })],
	host: {
		class: 'w-full',
	},
	template: `
		<div class="flex flex-col justify-between gap-4 sm:flex-row">
			<input
				hlmInput
				class="w-full md:w-80"
				placeholder="Filter emails..."
				[ngModel]="_emailFilter()"
				(ngModelChange)="_rawFilterInput.set($event)"
			/>

			<button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">
				Columns
				<ng-icon hlm name="lucideChevronDown" class="ml-2" size="sm" />
			</button>
			<ng-template #menu>
				<hlm-menu class="w-32">
					@for (column of _brnColumnManager.allColumns; track column.name) {
						<button
							hlmMenuItemCheckbox
							[disabled]="_brnColumnManager.isColumnDisabled(column.name)"
							[checked]="_brnColumnManager.isColumnVisible(column.name)"
							(triggered)="_brnColumnManager.toggleVisibility(column.name)"
						>
							<hlm-menu-item-check />
							<span>{{ column.label }}</span>
						</button>
					}
				</hlm-menu>
			</ng-template>
		</div>

		<brn-table
			hlm
			stickyHeader
			class="border-border mt-4 block h-[335px] overflow-auto rounded-md border"
			[dataSource]="_filteredSortedPaginatedPayments()"
			[displayedColumns]="_allDisplayedColumns()"
			[trackBy]="_trackBy"
		>
			<brn-column-def name="select" class="w-12">
				<hlm-th *brnHeaderDef>
					<hlm-checkbox [checked]="_checkboxState()" (changed)="handleHeaderCheckboxChange()" />
				</hlm-th>
				<hlm-td *brnCellDef="let element">
					<hlm-checkbox [checked]="_isPaymentSelected(element)" (changed)="togglePayment(element)" />
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
					\${{ element.amount | number: '1.2-2' }}
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
			*brnPaginator="let ctx; totalElements: _totalElements(); pageSize: _pageSize(); onStateChange: _onStateChange"
		>
			<span class="${hlmMuted} text-sm">{{ _selected().length }} of {{ _totalElements() }} row(s) selected</span>
			<div class="mt-2 flex sm:mt-0">
				<brn-select class="inline-block" [(ngModel)]="_pageSize">
					<hlm-select-trigger class="w-15 mr-1 inline-flex h-9">
						<hlm-select-value />
					</hlm-select-trigger>
					<hlm-select-content>
						@for (size of _availablePageSizes; track size) {
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
	`,
})
export class DataTablePreviewComponent {
	protected readonly _rawFilterInput = signal('');
	protected readonly _emailFilter = signal('');
	private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

	private readonly _displayedIndices = signal({ start: 0, end: 0 });
	protected readonly _availablePageSizes = [5, 10, 20, 10000];
	protected readonly _pageSize = signal(this._availablePageSizes[0]);

	private readonly _selectionModel = new SelectionModel<Payment>(true);
	protected readonly _isPaymentSelected = (payment: Payment) => this._selectionModel.isSelected(payment);
	protected readonly _selected = toSignal(this._selectionModel.changed.pipe(map((change) => change.source.selected)), {
		initialValue: [],
	});

	protected readonly _brnColumnManager = useBrnColumnManager({
		status: { visible: true, label: 'Status' },
		email: { visible: true, label: 'Email' },
		amount: { visible: true, label: 'Amount ($)' },
	});
	protected readonly _allDisplayedColumns = computed(() => [
		'select',
		...this._brnColumnManager.displayedColumns(),
		'actions',
	]);

	private readonly _payments = signal(PAYMENT_DATA);
	private readonly _filteredPayments = computed(() => {
		const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
		if (emailFilter && emailFilter.length > 0) {
			return this._payments().filter((u) => u.email.toLowerCase().includes(emailFilter));
		}
		return this._payments();
	});
	private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
	protected readonly _filteredSortedPaginatedPayments = computed(() => {
		const sort = this._emailSort();
		const start = this._displayedIndices().start;
		const end = this._displayedIndices().end + 1;
		const payments = this._filteredPayments();
		if (!sort) {
			return payments.slice(start, end);
		}
		return [...payments]
			.sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.email.localeCompare(p2.email))
			.slice(start, end);
	});
	protected readonly _allFilteredPaginatedPaymentsSelected = computed(() =>
		this._filteredSortedPaginatedPayments().every((payment) => this._selected().includes(payment)),
	);
	protected readonly _checkboxState = computed(() => {
		const noneSelected = this._selected().length === 0;
		const allSelectedOrIndeterminate = this._allFilteredPaginatedPaymentsSelected() ? true : 'indeterminate';
		return noneSelected ? false : allSelectedOrIndeterminate;
	});

	protected readonly _trackBy: TrackByFunction<Payment> = (_: number, p: Payment) => p.id;
	protected readonly _totalElements = computed(() => this._filteredPayments().length);
	protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
		this._displayedIndices.set({ start: startIndex, end: endIndex });

	constructor() {
		// needed to sync the debounced filter to the name filter, but being able to override the
		// filter when loading new users without debounce
		effect(() => {
			const debouncedFilter = this._debouncedFilter();
			untracked(() => this._emailFilter.set(debouncedFilter ?? ''));
		});
	}

	protected togglePayment(payment: Payment) {
		this._selectionModel.toggle(payment);
	}

	protected handleHeaderCheckboxChange() {
		const previousCbState = this._checkboxState();
		if (previousCbState === 'indeterminate' || !previousCbState) {
			this._selectionModel.select(...this._filteredSortedPaginatedPayments());
		} else {
			this._selectionModel.deselect(...this._filteredSortedPaginatedPayments());
		}
	}

	protected handleEmailSortChange() {
		const sort = this._emailSort();
		if (sort === 'ASC') {
			this._emailSort.set('DESC');
		} else if (sort === 'DESC') {
			this._emailSort.set(null);
		} else {
			this._emailSort.set('ASC');
		}
	}
}

export const defaultCode = `
import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, TrackByFunction, computed, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { lucideArrowUpDown, lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmIconDirective, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/brain/table';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { debounceTime, map } from 'rxjs';

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const PAYMENT_DATA: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com',
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com',
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com',
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com',
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com',
  },
  {
    id: 'p0r8sd2f',
    amount: 123,
    status: 'failed',
    email: 'john.doe@example.com',
  },
  {
    id: '8uyv3n1x',
    amount: 589,
    status: 'processing',
    email: 'emma.smith@gmail.com',
  },
  {
    id: '2zqo6ptr',
    amount: 456,
    status: 'success',
    email: 'jackson78@hotmail.com',
  },
  {
    id: 'l7we9a3m',
    amount: 632,
    status: 'success',
    email: 'grace_22@yahoo.com',
  },
  {
    id: 'o9p2v3qk',
    amount: 987,
    status: 'failed',
    email: 'robert.adams@gmail.com',
  },
  {
    id: 'q1o8r7mz',
    amount: 321,
    status: 'processing',
    email: 'alexander34@gmail.com',
  },
  {
    id: 'i5n3s0tv',
    amount: 555,
    status: 'failed',
    email: 'olivia_morris@hotmail.com',
  },
  {
    id: '3xr7s2nl',
    amount: 789,
    status: 'success',
    email: 'michael_cole@yahoo.com',
  },
  {
    id: 'u9v2p1qy',
    amount: 234,
    status: 'success',
    email: 'lily.jones@gmail.com',
  },
  {
    id: 'b4q0e1cp',
    amount: 876,
    status: 'failed',
    email: 'ryan_14@hotmail.com',
  },
  {
    id: 's1z8m7op',
    amount: 456,
    status: 'success',
    email: 'sophia.green@gmail.com',
  },
  {
    id: 'n5a3v0lt',
    amount: 987,
    status: 'failed',
    email: 'david.miller@yahoo.com',
  },
  {
    id: '2qr7v9sm',
    amount: 654,
    status: 'processing',
    email: 'emma_jones@hotmail.com',
  },
  {
    id: 'y9b2h8qq',
    amount: 789,
    status: 'success',
    email: 'jacob_89@gmail.com',
  },
  {
    id: 'c4a0r1xp',
    amount: 123,
    status: 'failed',
    email: 'samantha.richards@yahoo.com',
  },
];

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
    HlmInputDirective,

    HlmCheckboxComponent,

    BrnSelectModule,
	  HlmSelectModule,
  ],
  providers: [provideIcons({ lucideChevronDown, lucideEllipsis, lucideArrowUpDown })],
  host: {
    class: 'w-full',
  },
  template: \`
    <div class="flex flex-col justify-between gap-4 sm:flex-row">
      <input
        hlmInput
        class="w-full md:w-80"
        placeholder="Filter emails..."
        [ngModel]="_emailFilter()"
        (ngModelChange)="_rawFilterInput.set($event)"
      />

      <button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">
        Columns
        <ng-icon hlm name="lucideChevronDown" class="ml-2" size="sm" />
      </button>
      <ng-template #menu>
        <hlm-menu class="w-32">
          @for (column of _brnColumnManager.allColumns; track column.name) {
            <button
              hlmMenuItemCheckbox
              [disabled]="_brnColumnManager.isColumnDisabled(column.name)"
              [checked]="_brnColumnManager.isColumnVisible(column.name)"
              (triggered)="_brnColumnManager.toggleVisibility(column.name)"
            >
              <hlm-menu-item-check />
              <span>{{ column.label }}</span>
            </button>
          }
        </hlm-menu>
      </ng-template>
    </div>

    <brn-table
      hlm
      stickyHeader
      class="border-border mt-4 block h-[335px] overflow-auto rounded-md border"
      [dataSource]="_filteredSortedPaginatedPayments()"
      [displayedColumns]="_allDisplayedColumns()"
      [trackBy]="_trackBy"
    >
      <brn-column-def name="select" class="w-12">
        <hlm-th *brnHeaderDef>
          <hlm-checkbox [checked]="_checkboxState()" (changed)="handleHeaderCheckboxChange()" />
        </hlm-th>
        <hlm-td *brnCellDef="let element">
          <hlm-checkbox [checked]="_isPaymentSelected(element)" (changed)="togglePayment(element)" />
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
      <brn-column-def name="amount" class="justify-end w-20">
        <hlm-th *brnHeaderDef>Amount</hlm-th>
        <hlm-td class="font-medium tabular-nums" *brnCellDef="let element">
          $ {{ element.amount | number: '1.2-2'}}
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
      <div class="flex items-center justify-center p-20 text-muted-foreground" brnNoDataRow>No data</div>
    </brn-table>
    <div
      class="flex flex-col justify-between mt-4 sm:flex-row sm:items-center"
      *brnPaginator="let ctx; totalElements: _totalElements(); pageSize: _pageSize(); onStateChange: _onStateChange"
    >
      <span class="${hlmMuted} text-sm">{{ _selected().length }} of {{ _totalElements() }} row(s) selected</span>
      <div class="flex mt-2 sm:mt-0">
        <brn-select class="inline-block" placeholder="{{ _availablePageSizes[0] }}" [(ngModel)]="_pageSize">
          <hlm-select-trigger class="inline-flex mr-1 w-15 h-9">
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content>
            @for (size of _availablePageSizes; track size) {
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
  \`,
})
export class DataTablePreviewComponent {
  protected readonly _rawFilterInput = signal('');
  protected readonly _emailFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<Payment>(true);
  protected readonly _isPaymentSelected = (payment: Payment) => this._selectionModel.isSelected(payment);
  protected readonly _selected = toSignal(this._selectionModel.changed.pipe(map((change) => change.source.selected)), {
    initialValue: [],
  });

  protected readonly _brnColumnManager = useBrnColumnManager({
    status: { visible: true, label: 'Status' },
    email: { visible: true, label: 'Email' },
    amount: { visible: true, label: 'Amount ($)' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _payments = signal(PAYMENT_DATA);
  private readonly _filteredPayments = computed(() => {
    const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (emailFilter && emailFilter.length > 0) {
      return this._payments().filter((u) => u.email.toLowerCase().includes(emailFilter));
    }
    return this._payments();
  });
  private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedPayments = computed(() => {
    const sort = this._emailSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const payments = this._filteredPayments();
    if (!sort) {
      return payments.slice(start, end);
    }
    return [...payments]
      .sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.email.localeCompare(p2.email))
      .slice(start, end);
  });
  protected readonly _allFilteredPaginatedPaymentsSelected = computed(() =>
    this._filteredSortedPaginatedPayments().every((payment) => this._selected().includes(payment)),
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedPaymentsSelected() ? true : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<Payment> = (_: number, p: Payment) => p.id;
  protected readonly _totalElements = computed(() => this._filteredPayments().length);
  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor() {
    // needed to sync the debounced filter to the name filter, but being able to override the
    // filter when loading new users without debounce
		effect(() => {
			const debouncedFilter = this._debouncedFilter();
			untracked(() => this._emailFilter.set(debouncedFilter ?? ''));
		});
  }

  protected togglePayment(payment: Payment) {
    this._selectionModel.toggle(payment);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedPayments());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedPayments());
    }
  }

  protected handleEmailSortChange() {
    const sort = this._emailSort();
    if (sort === 'ASC') {
      this._emailSort.set('DESC');
    } else if (sort === 'DESC') {
      this._emailSort.set(null);
    } else {
      this._emailSort.set('ASC');
    }
  }
}
`;
