import { Component } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';

@Component({
	selector: 'spartan-table-preview',
	imports: [HlmTableImports],
	host: {
		class: 'w-full',
	},
	template: `
		<div hlmTableContainer>
			<table hlmTable>
				<caption hlmCaption>A list of your recent invoices.</caption>
				<thead hlmTHead>
					<tr hlmTr>
						<th hlmTh class="w-[100px]">Invoice</th>
						<th hlmTh>Status</th>
						<th hlmTh>Method</th>
						<th hlmTh class="text-right">Amount</th>
					</tr>
				</thead>
				<tbody hlmTBody>
					@for (invoice of _invoices; track invoice.invoice) {
						<tr hlmTr>
							<td hlmTd class="font-medium">{{ invoice.invoice }}</td>
							<td hlmTd>{{ invoice.paymentStatus }}</td>
							<td hlmTd>{{ invoice.paymentMethod }}</td>
							<td hlmTd class="text-right">{{ invoice.totalAmount }}</td>
						</tr>
					}
				</tbody>
				<tfoot hlmTFoot>
					<tr hlmTr>
						<td hlmTd [attr.colSpan]="3">Total</td>
						<td hlmTd class="text-right">$2,500.00</td>
					</tr>
				</tfoot>
			</table>
		</div>
	`,
})
export class TablePreview {
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

export const defaultImports = `
import { HlmTableImports } from '@spartan-ng/helm/table';
`;

export const defaultSkeleton = `
<div hlmTableContainer>
  <table hlmTable>
    <caption hlmCaption>
      A list of your recent invoices.
    </caption>
    <thead hlmTHead>
      <tr hlmTr>
        <th hlmTh class="w-[100px]">Invoice</th>
        <th hlmTh>Status</th>
        <th hlmTh>Method</th>
        <th hlmTh class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody hlmTBody>
      @for (invoice of _invoices; track invoice.invoice) {
      <tr hlmTr>
        <td hlmTd class="font-medium">{{ invoice.invoice }}</td>
        <td hlmTd>{{ invoice.paymentStatus }}</td>
        <td hlmTd>{{ invoice.paymentMethod }}</td>
        <td hlmTd class="text-right">{{ invoice.totalAmount }}</td>
      </tr>
      }
    </tbody>
    <tfoot hlmTFoot>
      <tr hlmTr>
        <td hlmTd [attr.colSpan]="3">Total</td>
        <td hlmTd class="text-right">$2,500.00</td>
      </tr>
    </tfoot>
  </table>
</div>
`;
