import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmTableImports } from '@spartan-ng/helm/table';

@Component({
	selector: 'spartan-table-actions',
	imports: [HlmTableImports, HlmButtonImports, HlmDropdownMenuImports, NgIcon],
	providers: [provideIcons({ lucideMoreHorizontal })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full',
	},
	template: `
		<div hlmTableContainer>
			<table hlmTable>
				<thead hlmTableHeader>
					<tr hlmTableRow>
						<th hlmTableHead>Product</th>
						<th hlmTableHead>Price</th>
						<th hlmTableHead class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody hlmTableBody>
					@for (product of _products; track product.name) {
						<tr hlmTableRow>
							<td hlmTableCell class="font-medium">{{ product.name }}</td>
							<td hlmTableCell>{{ product.price }}</td>
							<td hlmTableCell class="text-right">
								<button hlmBtn variant="ghost" size="icon-sm" [hlmDropdownMenuTrigger]="menu" align="end">
									<ng-icon name="lucideMoreHorizontal" />
									<span class="sr-only">Open menu</span>
								</button>
							</td>
						</tr>
					}
				</tbody>
			</table>
		</div>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<button hlmDropdownMenuItem>Edit</button>
				<button hlmDropdownMenuItem>Duplicate</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem variant="destructive">Delete</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class TableActions {
	protected _products = [
		{
			name: 'Wireless Mouse',
			price: '$29.99',
		},
		{
			name: 'Mechanical Keyboard',
			price: '$129.99',
		},
		{
			name: 'USB-C Hub',
			price: '$49.99',
		},
	];
}
