import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';

@Component({
	selector: 'spartan-table-footer',
	imports: [HlmTableImports, SlicePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full',
	},
	template: `
		<div hlmTableContainer>
			<table hlmTable>
				<caption hlmTableCaption>A list of your recent invoices.</caption>
				<thead hlmTableHeader>
					<tr hlmTableRow>
						<th hlmTableHead class="w-[100px]">Invoice</th>
						<th hlmTableHead>Status</th>
						<th hlmTableHead>Method</th>
						<th hlmTableHead class="text-right">Amount</th>
					</tr>
				</thead>
				<tbody hlmTableBody>
					@for (invoice of _invoices | slice: 0 : 3; track invoice.invoice) {
						<tr hlmTableRow>
							<td hlmTableCell class="font-medium">{{ invoice.invoice }}</td>
							<td hlmTableCell>{{ invoice.paymentStatus }}</td>
							<td hlmTableCell>{{ invoice.paymentMethod }}</td>
							<td hlmTableCell class="text-right">{{ invoice.totalAmount }}</td>
						</tr>
					}
				</tbody>
				<tfoot hlmTableFooter>
					<tr hlmTableRow>
						<td hlmTableCell [attr.colSpan]="3">Total</td>
						<td hlmTableCell class="text-right">$2,500.00</td>
					</tr>
				</tfoot>
			</table>
		</div>
	`,
})
export class TableFooter {
	protected _invoices = [
		{
			invoice: 'INV001',
			paymentStatus: 'Paid',
			totalAmount: '$250.00',
			paymentMethod: 'Credit Card',
		},
		{
			invoice: 'INV002',
			paymentStatus: 'Pending',
			totalAmount: '$150.00',
			paymentMethod: 'PayPal',
		},
		{
			invoice: 'INV003',
			paymentStatus: 'Unpaid',
			totalAmount: '$350.00',
			paymentMethod: 'Bank Transfer',
		},
		{
			invoice: 'INV004',
			paymentStatus: 'Paid',
			totalAmount: '$450.00',
			paymentMethod: 'Credit Card',
		},
		{
			invoice: 'INV005',
			paymentStatus: 'Paid',
			totalAmount: '$550.00',
			paymentMethod: 'PayPal',
		},
		{
			invoice: 'INV006',
			paymentStatus: 'Pending',
			totalAmount: '$200.00',
			paymentMethod: 'Bank Transfer',
		},
		{
			invoice: 'INV007',
			paymentStatus: 'Unpaid',
			totalAmount: '$300.00',
			paymentMethod: 'Credit Card',
		},
	];
}
