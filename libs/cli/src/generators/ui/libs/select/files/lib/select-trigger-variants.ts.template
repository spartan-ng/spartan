import { cva } from 'class-variance-authority';

export const selectTriggerVariants = cva(
	`border-input [&>ng-icon:not([class*='text-'])]:text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&>ng-icon]:pointer-events-none [&>ng-icon]:size-4 [&>ng-icon]:shrink-0`,
	{
		variants: {
			error: {
				auto: '[&.ng-invalid.ng-touched]:text-destructive [&.ng-invalid.ng-touched]:border-destructive [&.ng-invalid.ng-touched]:focus-within:ring-destructive/20 dark:[&.ng-invalid.ng-touched]:focus-within:ring-destructive/40',
				true: 'text-destructive border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40',
			},
		},
		defaultVariants: {
			error: 'auto',
		},
	},
);
