# Migration from Spartan Table

We decided to migrate from Spartan Brain to Tanstack table.
The Spartan Table was built when Tanstack Table was not available. While the Spartan Table Brain tried to mimic the style of Tanstack Table, it still lacks features of Tanstack Table.
Addtionially shadcn ui, which also uses tanstack table under the hood, also uses Tanstack under the hood. So we decided to migrate to Tanstack Table.

This gives the user more Features and more similarity to shadcn ui.

## Simple Tables without Brain part

Replace `<hlm-table>` or `<brn-table hlm>` with `<table hlmTable>` and and check the corresponding closing tags.
Replace `<hlm-trow>` with `<tr hlmTr>` and and check the corresponding closing tags.
Replace `<hlm-th>` with `<th hlmTh>` and and check the corresponding closing tags.
Replace `<hlm-td>` with `<td hlmTd>` and and check the corresponding closing tags.

## Brain to Tanstack Table

The spartan approach was to define the Columns in the template, whereas the Tanstack approach is to define the Columns in the code, via `ColumnDef` and `createAngularTable`.
The easiest way to migrate is to search for the `brn-column-def` and create a corresponding `ColumnDef`.

```
<brn-column-def name="status" class="w-32 sm:w-40">
	<hlm-th truncate *brnHeaderDef>Status</hlm-th>
	<hlm-td truncate *brnCellDef="let element">
		{{ element.status }}
	</hlm-td>
</brn-column-def>
```

```
{
	accessorKey: 'status',
	id: 'status',
	header: () => 'Status',
}
```

After that you can replace the brnTable with the example from the data-table or from the tanstack documentation.
For additional features, you can check the documentation for Tanstack Table.
