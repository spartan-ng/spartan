import { CdkRowDef, CdkTable, type CdkTableDataSourceInput, CdkTableModule } from '@angular/cdk/table';
import {
	type AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	EventEmitter,
	Input,
	Output,
	type QueryList,
	type TrackByFunction,
	ViewChild,
	ViewEncapsulation,
	booleanAttribute,
} from '@angular/core';
import { type TableClassesSettable, provideTableClassesSettableExisting } from '@spartan-ng/brain/core';
import { BrnColumnDefComponent } from './brn-column-def.component';

export type BrnTableDataSourceInput<T> = CdkTableDataSourceInput<T>;

@Component({
	selector: 'brn-table',
	standalone: true,
	imports: [CdkTableModule],
	providers: [provideTableClassesSettableExisting(<T>() => BrnTableComponent<T>)],
	template: `
		<cdk-table
			#cdkTable
			[class]="tableClasses"
			[dataSource]="dataSource"
			[fixedLayout]="fixedLayout"
			[multiTemplateDataRows]="multiTemplateDataRows"
			(contentChanged)="contentChanged.emit()"
		>
			<ng-content />

			<cdk-header-row [class]="headerRowClasses" *cdkHeaderRowDef="displayedColumns; sticky: stickyHeader" />
			@if (!customTemplateDataRows) {
				<cdk-row
					[tabindex]="!!onRowClick ? 0 : -1"
					[attr.role]="!!onRowClick ? 'button' : 'row'"
					[class.row-interactive]="!!onRowClick"
					(keydown.enter)="!!onRowClick && onRowClick(row)"
					(click)="!!onRowClick && onRowClick(row)"
					[class]="bodyRowClasses"
					*cdkRowDef="let row; columns: displayedColumns"
				/>
			}

			<ng-template cdkNoDataRow>
				<ng-content select="[brnNoDataRow]" />
			</ng-template>
		</cdk-table>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnTableComponent<T> implements TableClassesSettable, AfterContentInit {
	@ViewChild('cdkTable', { read: CdkTable, static: true })
	private readonly _cdkTable?: CdkTable<T>;
	// Cdk Table Inputs / Outputs
	@Input()
	public dataSource: BrnTableDataSourceInput<T> = [];
	@Input({ transform: booleanAttribute })
	public fixedLayout = false;
	@Input({ transform: booleanAttribute })
	public multiTemplateDataRows = false;
	@Input()
	public displayedColumns: string[] = [];

	private _trackBy?: TrackByFunction<T>;
	public get trackBy(): TrackByFunction<T> | undefined {
		return this._trackBy;
	}

	@Input()
	public set trackBy(value: TrackByFunction<T>) {
		this._trackBy = value;
		if (this._cdkTable) {
			this._cdkTable.trackBy = this._trackBy;
		}
	}

	@Output()
	public readonly contentChanged: EventEmitter<void> = new EventEmitter<void>();

	// Brn Inputs / Outputs
	@Input({ transform: booleanAttribute })
	public customTemplateDataRows = false;
	@Input()
	public onRowClick: ((element: T) => void) | undefined;

	@Input({ transform: booleanAttribute })
	public stickyHeader = false;
	@Input()
	public tableClasses = '';
	@Input()
	public headerRowClasses = '';
	@Input()
	public bodyRowClasses = '';

	@ContentChildren(BrnColumnDefComponent) public columnDefComponents!: QueryList<BrnColumnDefComponent>;
	@ContentChildren(CdkRowDef) public rowDefs!: QueryList<CdkRowDef<T>>;

	// after the <ng-content> has been initialized, the column definitions are available.
	// All that's left is to add them to the table ourselves:
	public ngAfterContentInit(): void {
		this.columnDefComponents.forEach((component) => {
			if (!this._cdkTable) return;
			if (component.cell) {
				this._cdkTable.addColumnDef(component.columnDef);
			}
		});
		this.rowDefs.forEach((rowDef) => {
			if (!this._cdkTable) return;
			this._cdkTable.addRowDef(rowDef);
		});
	}

	public setTableClasses({
		table,
		headerRow,
		bodyRow,
	}: Partial<{ table: string; headerRow: string; bodyRow: string }>): void {
		if (table) {
			this.tableClasses = table;
		}
		if (headerRow) {
			this.headerRowClasses = headerRow;
		}
		if (bodyRow) {
			this.bodyRowClasses = bodyRow;
		}
	}
}
