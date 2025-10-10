import { computed, Directive, effect, forwardRef, inject, input, linkedSignal, untracked } from '@angular/core';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { BrnInput } from '@spartan-ng/brain/input';
import { hlm } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const inputVariants = cva(
	'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
	{
		variants: {
			error: {
				auto: '[&.ng-invalid.ng-touched]:text-destructive/20 dark:[&.ng-invalid.ng-touched]:text-destructive/40 [&.ng-invalid.ng-touched]:border-destructive [&.ng-invalid.ng-touched]:focus-visible:ring-destructive',
				true: 'text-destructive/20 dark:text-destructive/40 border-destructive focus-visible:ring-destructive',
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
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnInput],
	providers: [
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnInput),
		},
	],
})
export class HlmInput {
	private readonly _brnInput = inject(BrnInput);

	public readonly error = input<InputVariants['error']>('auto');

	protected readonly _state = linkedSignal(() => ({ error: this.error() }));

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(inputVariants({ error: this._state().error }), this.userClass()),
	);

	constructor() {
		// Watch the brain input's error state and update our visual state accordingly
		effect(() => {
			const hasError = this._brnInput.errorState();
			const currentError = this.error();

			// Only update if we're in 'auto' mode or if the error state has changed
			if (currentError === 'auto') {
				untracked(() => {
					this.setError(hasError ? true : 'auto');
				});
			}
		});
	}

	setError(error: InputVariants['error']) {
		this._state.set({ error });
	}
}
