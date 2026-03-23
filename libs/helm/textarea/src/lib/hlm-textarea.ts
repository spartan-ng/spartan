import { Directive, input } from '@angular/core';
import { BrnTextarea } from '@spartan-ng/brain/textarea';
import { HlmFieldControlDescribedBy } from '@spartan-ng/helm/field';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';

export const textareaVariants = cva(
	'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex [field-sizing:content] min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
	{
		variants: {
			error: {
				auto: 'data-[matches-spartan-invalid=true]:border-destructive data-[matches-spartan-invalid=true]:ring-destructive/20 dark:data-[matches-spartan-invalid=true]:ring-destructive/40',
				true: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
			},
		},
		defaultVariants: {
			error: 'auto',
		},
	},
);
type TextareaVariants = VariantProps<typeof textareaVariants>;

@Directive({
	selector: '[hlmTextarea]',
	hostDirectives: [{ directive: BrnTextarea, inputs: ['id'] }, HlmFieldControlDescribedBy],
	host: {
		'data-slot': 'textarea',
	},
})
export class HlmTextarea {
	public readonly error = input<TextareaVariants['error']>('auto');

	constructor() {
		classes(() => textareaVariants({ error: this.error() }));
	}
}
