import { Directive, inject, input, linkedSignal, signal } from '@angular/core';
import { BrnFieldControl } from '@spartan-ng/brain/field';
import { HlmFieldControlDescribedBy } from '@spartan-ng/helm/field';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

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
	hostDirectives: [HlmFieldControlDescribedBy, BrnFieldControl],
	host: {
		'data-slot': 'textarea',
		'[attr.aria-invalid]': '_ariaInvalid?.() ? "true" : null',
		'[attr.data-invalid]': '_ariaInvalid?.() ? "true" : null',
		'[attr.data-touched]': '_touched?.() ? "true" : null',
		'[attr.data-dirty]': '_dirty?.() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid?.() ? "true" : null',
	},
})
export class HlmTextarea {
	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });
	private readonly _additionalClasses = signal<ClassValue>('');

	public readonly error = input<TextareaVariants['error']>('auto');

	protected readonly _state = linkedSignal(() => ({ error: this.error() }));

	protected readonly _ariaInvalid = this._fieldControl?.invalid;
	protected readonly _touched = this._fieldControl?.touched;
	protected readonly _dirty = this._fieldControl?.dirty;
	protected readonly _spartanInvalid = this._fieldControl?.spartanInvalid;

	constructor() {
		classes(() => [textareaVariants({ error: this._state().error }), this._additionalClasses()]);
	}
}
