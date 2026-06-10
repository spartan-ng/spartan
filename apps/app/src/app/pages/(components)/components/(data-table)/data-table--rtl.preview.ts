import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmTableImports } from '@spartan-ng/helm/table';

type Payment = {
	email: string;
	status: 'success' | 'processing' | 'failed';
	amount: string;
};

@Component({
	selector: 'spartan-data-table-rtl',
	imports: [HlmTableImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full',
	},
	template: `
		<div hlmTableContainer>
			<table hlmTable [dir]="_dir()">
				<caption hlmTableCaption>{{ _t()['caption'] }}</caption>
				<thead hlmTableHeader>
					<tr hlmTableRow>
						<th hlmTableHead>{{ _t()['customer'] }}</th>
						<th hlmTableHead>{{ _t()['status'] }}</th>
						<th hlmTableHead class="text-end">{{ _t()['amount'] }}</th>
					</tr>
				</thead>
				<tbody hlmTableBody>
					@for (payment of _payments; track payment.email) {
						<tr hlmTableRow>
							<td hlmTableCell class="font-medium">{{ payment.email }}</td>
							<td hlmTableCell>{{ _t()[payment.status] }}</td>
							<td hlmTableCell class="text-end">{{ payment.amount }}</td>
						</tr>
					}
				</tbody>
				<tfoot hlmTableFooter>
					<tr hlmTableRow>
						<td hlmTableCell [attr.colSpan]="2">{{ _t()['total'] }}</td>
						<td hlmTableCell class="text-end">$1,250.00</td>
					</tr>
				</tfoot>
			</table>
		</div>
	`,
})
export class DataTableRtl {
	protected readonly _payments: Payment[] = [
		{ email: 'ken99@example.com', status: 'success', amount: '$316.00' },
		{ email: 'abe45@example.com', status: 'processing', amount: '$242.00' },
		{ email: 'monserrat44@example.com', status: 'failed', amount: '$837.00' },
		{ email: 'carmella@example.com', status: 'success', amount: '$721.00' },
	];

	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				caption: 'A list of your recent payments.',
				customer: 'Customer',
				status: 'Status',
				amount: 'Amount',
				success: 'Success',
				processing: 'Processing',
				failed: 'Failed',
				total: 'Total',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				caption: 'قائمة بمدفوعاتك الأخيرة.',
				customer: 'العميل',
				status: 'الحالة',
				amount: 'المبلغ',
				success: 'ناجح',
				processing: 'قيد المعالجة',
				failed: 'فشل',
				total: 'المجموع',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				caption: 'רשימת התשלומים האחרונים שלך.',
				customer: 'לקוח',
				status: 'סטטוס',
				amount: 'סכום',
				success: 'הצליח',
				processing: 'בעיבוד',
				failed: 'נכשל',
				total: 'סה"כ',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
