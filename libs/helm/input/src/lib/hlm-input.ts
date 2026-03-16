import { Directive, inject, input, linkedSignal } from '@angular/core';
import { BrnFieldControl } from '@spartan-ng/brain/field';
import { HlmFieldControlDescribedBy } from '@spartan-ng/helm/field';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva(
	'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
type InputVariants = VariantProps<typeof inputVariants>;

@Directive({
	selector: '[hlmInput]',
	hostDirectives: [HlmFieldControlDescribedBy, BrnFieldControl],
	host: {
		'[attr.aria-invalid]': '_ariaInvalid?.() ? "true" : null',
		'[attr.data-invalid]': '_ariaInvalid?.() ? "true" : null',
		'[attr.data-touched]': '_touched?.() ? "true" : null',
		'[attr.data-dirty]': '_dirty?.() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid?.() ? "true" : null',
	},
})
export class HlmInput {
	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });

	public readonly error = input<InputVariants['error']>('auto');

	protected readonly _state = linkedSignal(() => ({ error: this.error() }));

	protected readonly _ariaInvalid = this._fieldControl?.invalid;
	protected readonly _touched = this._fieldControl?.touched;
	protected readonly _dirty = this._fieldControl?.dirty;
	protected readonly _spartanInvalid = this._fieldControl?.spartanInvalid;

	constructor() {
		classes(() => inputVariants({ error: this._state().error }));
	}

	setError(error: InputVariants['error']) {
		this._state.set({ error });
	}
}
