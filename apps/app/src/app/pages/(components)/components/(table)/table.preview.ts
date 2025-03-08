import { Component } from '@angular/core';
import {
	HlmCaptionComponent,
	HlmTableComponent,
	HlmTdComponent,
	HlmThComponent,
	HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';

@Component({
	selector: 'spartan-table-preview',
	imports: [HlmTableComponent, HlmTrowComponent, HlmThComponent, HlmTdComponent, HlmCaptionComponent],
	host: {
		class: 'w-full overflow-x-auto',
	},
	template: `
		<hlm-table class="w-fit min-w-[400px]">
			<hlm-caption>A list of your recent invoices.</hlm-caption>
			<hlm-trow>
				<hlm-th class="w-52">Invoice</hlm-th>
				<hlm-th class="w-60">Status</hlm-th>
				<hlm-th class="flex-1 whitespace-nowrap">Method</hlm-th>
				<hlm-th class="w-40 justify-end">Amount</hlm-th>
			</hlm-trow>
			@for (invoice of _invoices; track invoice.invoice) {
				<hlm-trow>
					<hlm-td truncate class="w-52 font-medium">{{ invoice.invoice }}</hlm-td>
					<hlm-td class="w-60">{{ invoice.paymentStatus }}</hlm-td>
					<hlm-td class="flex-1 whitespace-nowrap">{{ invoice.paymentMethod }}</hlm-td>
					<hlm-td class="w-40 justify-end">{{ invoice.totalAmount }}</hlm-td>
				</hlm-trow>
			}
			<hlm-trow class="bg-muted/50 hover:bg-muted">
				<hlm-td truncate class="w-[100px] font-semibold">Total</hlm-td>
				<hlm-td class="w-40"></hlm-td>
				<hlm-td class="flex-1 whitespace-nowrap"></hlm-td>
				<hlm-td class="w-40 justify-end">$2,500.00</hlm-td>
			</hlm-trow>
		</hlm-table>
	`,
})
export class TablePreviewComponent {
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

export const defaultCode = `
import { Component } from '@angular/core';
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';

@Component({
  selector: 'spartan-table-preview',
  standalone: true,
  imports: [HlmTableComponent, HlmTrowComponent, HlmThComponent, HlmTdComponent, HlmCaptionComponent],
  host: {
    class: 'w-full overflow-x-auto',
  },
  template: \`
    <hlm-table class="w-full min-w-[400px]">
      <hlm-caption>A list of your recent invoices.</hlm-caption>
      <hlm-trow>
        <hlm-th class="w-52">Invoice</hlm-th>
        <hlm-th class="w-60">Status</hlm-th>
        <hlm-th class="flex-1">Method</hlm-th>
        <hlm-th class="justify-end w-40">Amount</hlm-th>
      </hlm-trow>
      @for (invoice of _invoices; track invoice.invoice) {
        <hlm-trow>
          <hlm-td truncate class="font-medium w-52">{{ invoice.invoice }}</hlm-td>
          <hlm-td class="w-60">{{ invoice.paymentStatus }}</hlm-td>
          <hlm-td class="flex-1">{{ invoice.paymentMethod }}</hlm-td>
          <hlm-td class="justify-end w-40">{{ invoice.totalAmount }}</hlm-td>
        </hlm-trow>
      }
      <hlm-trow class="bg-muted/50 hover:bg-muted">
        <hlm-td truncate class="w-[100px] font-semibold">Total</hlm-td>
        <hlm-td class="w-40"></hlm-td>
        <hlm-td class="flex-1"></hlm-td>
        <hlm-td class="justify-end w-40">$2,500.00</hlm-td>
      </hlm-trow>
    </hlm-table>
  \`,
})
export class TablePreviewComponent {
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
`;

export const defaultImports = `
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
`;
export const defaultSkeleton = `
<hlm-table>
  <hlm-caption>A list of your recent invoices.</hlm-caption>
  <hlm-trow>
    <hlm-th>Invoice</hlm-th>
    <hlm-th>Status</hlm-th>
    <hlm-th>Method</hlm-th>
    <hlm-th>Amount</hlm-th>
  </hlm-trow>
  <hlm-trow>
    <hlm-th>INV001</hlm-th>
    <hlm-th>Paid</hlm-th>
    <hlm-th>Credit Card</hlm-th>
    <hlm-th>$250.00</hlm-th>
  </hlm-trow>
</hlm-table>
`;
