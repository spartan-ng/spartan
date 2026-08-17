import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown, lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { hlmMuted } from '@spartan-ng/helm/typography';
import {
	type Column,
	columnFilteringFeature,
	type ColumnFiltersState,
	columnVisibilityFeature,
	type ColumnVisibilityState,
	createColumnHelper,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_includesString,
	FlexRender,
	injectTable,
	type Row,
	rowPaginationFeature,
	rowSelectionFeature,
	type RowSelectionState,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_text,
	type SortingState,
	type Table,
	tableFeatures,
} from '@tanstack/angular-table';

type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

const TRANSLATIONS: Translations = {
	en: {
		dir: 'ltr',
		locale: 'en-US',
		values: {
			filter: 'Filter emails...',
			columns: 'Columns',
			status: 'Status',
			email: 'Email',
			amount: 'Amount',
			pending: 'Pending',
			processing: 'Processing',
			success: 'Success',
			failed: 'Failed',
			actions: 'Actions',
			openMenu: 'Open menu',
			copyId: 'Copy payment ID',
			viewCustomer: 'View customer',
			viewPayment: 'View payment details',
			noResults: 'No results.',
			selected: '{selected} of {total} row(s) selected',
			previous: 'Previous',
			next: 'Next',
			selectAll: 'Select all',
			selectRow: 'Select row',
		},
	},
	ar: {
		dir: 'rtl',
		locale: 'ar-EG',
		values: {
			filter: 'تصفية البريد الإلكتروني...',
			columns: 'الأعمدة',
			status: 'الحالة',
			email: 'البريد الإلكتروني',
			amount: 'المبلغ',
			pending: 'قيد الانتظار',
			processing: 'قيد المعالجة',
			success: 'ناجحة',
			failed: 'فاشلة',
			actions: 'الإجراءات',
			openMenu: 'افتح القائمة',
			copyId: 'نسخ معرف الدفعة',
			viewCustomer: 'عرض العميل',
			viewPayment: 'عرض تفاصيل الدفعة',
			noResults: 'لا توجد نتائج.',
			selected: 'تم تحديد {selected} من أصل {total} صفوف',
			previous: 'السابق',
			next: 'التالي',
			selectAll: 'تحديد الكل',
			selectRow: 'تحديد الصف',
		},
	},
	he: {
		dir: 'rtl',
		locale: 'he-IL',
		values: {
			filter: 'סינון אימיילים...',
			columns: 'עמודות',
			status: 'סטטוס',
			email: 'אימייל',
			amount: 'סכום',
			pending: 'ממתין',
			processing: 'בעיבוד',
			success: 'הצליח',
			failed: 'נכשל',
			actions: 'פעולות',
			openMenu: 'פתח תפריט',
			copyId: 'העתק מזהה תשלום',
			viewCustomer: 'הצג לקוח',
			viewPayment: 'הצג פרטי תשלום',
			noResults: 'אין תוצאות.',
			selected: 'נבחרו {selected} מתוך {total} שורות',
			previous: 'הקודם',
			next: 'הבא',
			selectAll: 'בחר הכל',
			selectRow: 'בחר שורה',
		},
	},
};

const features = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortedRowModel: createSortedRowModel(),
	filterFns: { includesString: filterFn_includesString },
	sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

type RtlDataTableFeatures = typeof features;

const columnHelper = createColumnHelper<RtlDataTableFeatures, Payment>();

@Component({
	imports: [HlmCheckboxImports],
	host: {
		class: 'flex',
		'[attr.aria-label]': '_t()["selectAll"]',
	},
	template: `
		<hlm-checkbox
			[checked]="table().getIsAllRowsSelected()"
			[indeterminate]="table().getIsSomeRowsSelected() && !table().getIsAllPageRowsSelected()"
			(checkedChange)="table().toggleAllPageRowsSelected($event)"
		/>
	`,
})
export class RtlTableHeadSelection {
	public readonly table = input.required<Table<RtlDataTableFeatures, Payment>>();

	private readonly _language = inject(TranslateService).language;
	protected readonly _t = computed(() => TRANSLATIONS[this._language()].values);
}

@Component({
	imports: [HlmCheckboxImports],
	host: {
		class: 'flex',
		'[attr.aria-label]': '_t()["selectRow"]',
	},
	template: `
		<hlm-checkbox [checked]="row().getIsSelected()" (checkedChange)="row().toggleSelected($event)" />
	`,
})
export class RtlTableRowSelection {
	public readonly row = input.required<Row<RtlDataTableFeatures, Payment>>();

	private readonly _language = inject(TranslateService).language;
	protected readonly _t = computed(() => TRANSLATIONS[this._language()].values);
}

@Component({
	imports: [HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideArrowUpDown })],
	template: `
		<button hlmBtn size="sm" variant="ghost" (click)="sortClick()">
			{{ _t()['email'] }}
			<ng-icon name="lucideArrowUpDown" />
		</button>
	`,
})
export class RtlTableHeadSortButton {
	public readonly column = input.required<Column<RtlDataTableFeatures, Payment, unknown>>();

	private readonly _language = inject(TranslateService).language;
	protected readonly _t = computed(() => TRANSLATIONS[this._language()].values);

	protected sortClick() {
		this.column().toggleSorting(this.column().getIsSorted() === 'asc');
	}
}

@Component({
	imports: [HlmButtonImports, NgIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<button hlmBtn size="icon-sm" variant="ghost" [hlmDropdownMenuTrigger]="menu">
			<span class="sr-only">{{ _t()['openMenu'] }}</span>
			<ng-icon name="lucideEllipsis" />
		</button>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-label>{{ _t()['actions'] }}</hlm-dropdown-menu-label>
				<button hlmDropdownMenuItem (click)="copyPaymentId()">{{ _t()['copyId'] }}</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>{{ _t()['viewCustomer'] }}</button>
				<button hlmDropdownMenuItem>{{ _t()['viewPayment'] }}</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class RtlActionDropdown {
	public readonly row = input.required<Row<RtlDataTableFeatures, Payment>>();

	private readonly _language = inject(TranslateService).language;
	protected readonly _t = computed(() => TRANSLATIONS[this._language()].values);

	copyPaymentId() {
		navigator.clipboard.writeText(this.row().original.id);
	}
}

@Component({
	selector: 'spartan-data-table-rtl',
	imports: [FlexRender, HlmButtonImports, HlmDropdownMenuImports, HlmInputImports, HlmTableImports, NgIcon],
	providers: [provideIcons({ lucideChevronDown }), Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full',
		'[dir]': '_dir()',
	},
	template: `
		<div class="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
			<input hlmInput class="w-full md:w-80" [placeholder]="_t()['filter']" (input)="_filterChanged($event)" />

			<button hlmBtn variant="outline" align="end" [hlmDropdownMenuTrigger]="menu">
				{{ _t()['columns'] }}
				<ng-icon name="lucideChevronDown" class="ms-2" />
			</button>
			<ng-template #menu>
				<hlm-dropdown-menu class="w-32">
					@for (column of _hidableColumns; track column.id) {
						<button hlmDropdownMenuCheckbox [checked]="column.getIsVisible()" (triggered)="column.toggleVisibility()">
							<hlm-dropdown-menu-checkbox-indicator />
							{{ _t()[column.id] }}
						</button>
					}
				</hlm-dropdown-menu>
			</ng-template>
		</div>
		<div class="overflow-hidden rounded-md border">
			<div hlmTableContainer>
				<table hlmTable>
					<thead hlmTHead>
						@for (headerGroup of _table.getHeaderGroups(); track headerGroup.id) {
							<tr hlmTr>
								@for (header of headerGroup.headers; track header.id) {
									<th hlmTh [attr.colSpan]="header.colSpan">
										@if (!header.isPlaceholder) {
											<ng-container
												*flexRender="header.column.columnDef.header; props: header.getContext(); let headerText"
											>
												<div [innerHTML]="headerText"></div>
											</ng-container>
										}
									</th>
								}
							</tr>
						}
					</thead>
					<tbody hlmTBody>
						@for (row of _table.getRowModel().rows; track row.id) {
							<tr hlmTr [attr.key]="row.id" [attr.data-state]="row.getIsSelected() && 'selected'">
								@for (cell of row.getVisibleCells(); track $index) {
									<td hlmTd>
										<ng-container *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let cell">
											<div [innerHTML]="cell"></div>
										</ng-container>
									</td>
								}
							</tr>
						} @empty {
							<tr hlmTr>
								<td hlmTd class="h-24 text-center" [attr.colspan]="_columns.length">{{ _t()['noResults'] }}</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
		</div>

		<div class="flex flex-col justify-between py-4 sm:flex-row sm:items-center">
			<div class="${hlmMuted}">
				{{ _selectedLabel(_table.getSelectedRowModel().rows.length, _table.getRowCount()) }}
			</div>
			<div class="mt-2 flex gap-2 sm:mt-0">
				<button
					size="sm"
					variant="outline"
					hlmBtn
					[disabled]="!_table.getCanPreviousPage()"
					(click)="_table.previousPage()"
				>
					{{ _t()['previous'] }}
				</button>
				<button size="sm" variant="outline" hlmBtn [disabled]="!_table.getCanNextPage()" (click)="_table.nextPage()">
					{{ _t()['next'] }}
				</button>
			</div>
		</div>
	`,
})
export class DataTableRtl {
	private readonly _language = inject(TranslateService).language;
	private readonly _translation = computed(() => TRANSLATIONS[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
	private readonly _locale = computed(() => this._translation().locale ?? 'en-US');

	protected readonly _columns = columnHelper.columns([
		columnHelper.display({
			id: 'select',
			header: () => RtlTableHeadSelection,
			cell: () => RtlTableRowSelection,
			enableHiding: false,
		}),
		columnHelper.accessor('status', {
			id: 'status',
			header: () => this._t()['status'],
			cell: (info) => `<span>${this._t()[info.getValue<string>()]}</span>`,
		}),
		columnHelper.accessor('email', {
			id: 'email',
			header: () => RtlTableHeadSortButton,
			cell: (info) => `<span class="lowercase" dir="ltr">${info.getValue<string>()}</span>`,
		}),
		columnHelper.accessor('amount', {
			id: 'amount',
			header: () => `<div class="text-end">${this._t()['amount']}</div>`,
			cell: (info) => {
				const amount = parseFloat(info.getValue<string>());
				const formatted = new Intl.NumberFormat(this._locale(), {
					style: 'currency',
					currency: 'USD',
				}).format(amount);

				return `<div class="text-end font-medium">${formatted}</div>`;
			},
		}),
		columnHelper.display({
			id: 'actions',
			cell: () => RtlActionDropdown,
			enableHiding: false,
		}),
	]);

	private readonly _columnFilters = signal<ColumnFiltersState>([]);
	private readonly _sorting = signal<SortingState>([]);
	private readonly _rowSelection = signal<RowSelectionState>({});
	private readonly _columnVisibility = signal<ColumnVisibilityState>({});

	protected readonly _table = injectTable(() => ({
		features,
		columns: this._columns,
		data: PAYMENT_DATA,
		onSortingChange: (updater) => {
			updater instanceof Function ? this._sorting.update(updater) : this._sorting.set(updater);
		},
		onColumnFiltersChange: (updater) => {
			updater instanceof Function ? this._columnFilters.update(updater) : this._columnFilters.set(updater);
		},
		onColumnVisibilityChange: (updater) => {
			updater instanceof Function ? this._columnVisibility.update(updater) : this._columnVisibility.set(updater);
		},
		onRowSelectionChange: (updater) => {
			updater instanceof Function ? this._rowSelection.update(updater) : this._rowSelection.set(updater);
		},
		state: {
			sorting: this._sorting(),
			columnFilters: this._columnFilters(),
			columnVisibility: this._columnVisibility(),
			rowSelection: this._rowSelection(),
		},
	}));

	protected readonly _hidableColumns = this._table.getAllColumns().filter((column) => column.getCanHide());

	private readonly _directionality = inject(Directionality);

	constructor() {
		effect(() => {
			const dir = this._dir();
			untracked(() => this._directionality.valueSignal.set(dir));
		});
	}

	protected _filterChanged(event: Event) {
		this._table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
	}

	protected _selectedLabel(selected: number, total: number) {
		const template = this._t()['selected'];
		return template.replace('{selected}', `${selected}`).replace('{total}', `${total}`);
	}
}

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
];
