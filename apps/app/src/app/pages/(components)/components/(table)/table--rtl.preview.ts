import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmTableImports } from '@spartan-ng/helm/table';

type Invoice = {
	invoice: string;
	paymentStatus: 'paid' | 'pending' | 'unpaid';
	totalAmount: string;
	paymentMethod: 'creditCard' | 'paypal' | 'bankTransfer';
};

@Component({
	selector: 'spartan-table-rtl',
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
						<th hlmTableHead class="w-[100px]">{{ _t()['invoice'] }}</th>
						<th hlmTableHead>{{ _t()['status'] }}</th>
						<th hlmTableHead>{{ _t()['method'] }}</th>
						<th hlmTableHead class="text-end">{{ _t()['amount'] }}</th>
					</tr>
				</thead>
				<tbody hlmTableBody>
					@for (invoice of _invoices; track invoice.invoice) {
						<tr hlmTableRow>
							<td hlmTableCell class="font-medium">{{ invoice.invoice }}</td>
							<td hlmTableCell>{{ _t()[invoice.paymentStatus] }}</td>
							<td hlmTableCell>{{ _t()[invoice.paymentMethod] }}</td>
							<td hlmTableCell class="text-end">{{ invoice.totalAmount }}</td>
						</tr>
					}
				</tbody>
				<tfoot hlmTableFooter>
					<tr hlmTableRow>
						<td hlmTableCell [attr.colSpan]="3">{{ _t()['total'] }}</td>
						<td hlmTableCell class="text-end">$2,500.00</td>
					</tr>
				</tfoot>
			</table>
		</div>
	`,
})
export class TableRtl {
	protected _invoices: Invoice[] = [
		{
			invoice: 'INV001',
			paymentStatus: 'paid',
			totalAmount: '$250.00',
			paymentMethod: 'creditCard',
		},
		{
			invoice: 'INV002',
			paymentStatus: 'pending',
			totalAmount: '$150.00',
			paymentMethod: 'paypal',
		},
		{
			invoice: 'INV003',
			paymentStatus: 'unpaid',
			totalAmount: '$350.00',
			paymentMethod: 'bankTransfer',
		},
		{
			invoice: 'INV004',
			paymentStatus: 'paid',
			totalAmount: '$450.00',
			paymentMethod: 'creditCard',
		},
		{
			invoice: 'INV005',
			paymentStatus: 'paid',
			totalAmount: '$550.00',
			paymentMethod: 'paypal',
		},
		{
			invoice: 'INV006',
			paymentStatus: 'pending',
			totalAmount: '$200.00',
			paymentMethod: 'bankTransfer',
		},
		{
			invoice: 'INV007',
			paymentStatus: 'unpaid',
			totalAmount: '$300.00',
			paymentMethod: 'creditCard',
		},
	];

	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				caption: 'A list of your recent invoices.',
				invoice: 'Invoice',
				status: 'Status',
				method: 'Method',
				amount: 'Amount',
				paid: 'Paid',
				pending: 'Pending',
				unpaid: 'Unpaid',
				creditCard: 'Credit Card',
				paypal: 'PayPal',
				bankTransfer: 'Bank Transfer',
				total: 'Total',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				caption: 'قائمة بفواتيرك الأخيرة.',
				invoice: 'الفاتورة',
				status: 'الحالة',
				method: 'الطريقة',
				amount: 'المبلغ',
				paid: 'مدفوع',
				pending: 'قيد الانتظار',
				unpaid: 'غير مدفوع',
				creditCard: 'بطاقة ائتمانية',
				paypal: 'PayPal',
				bankTransfer: 'تحويل بنكي',
				total: 'المجموع',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				caption: 'רשימת החשבוניות האחרונות שלך.',
				invoice: 'חשבונית',
				status: 'סטטוס',
				method: 'שיטה',
				amount: 'סכום',
				paid: 'שולם',
				pending: 'ממתין',
				unpaid: 'לא שולם',
				creditCard: 'כרטיס אשראי',
				paypal: 'PayPal',
				bankTransfer: 'העברה בנקאית',
				total: 'סה"כ',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
