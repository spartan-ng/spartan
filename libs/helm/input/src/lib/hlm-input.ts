import { computed, Directive, forwardRef, inject, Injector, input, linkedSignal, OnInit, signal } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BrnFieldControl } from '@spartan-ng/brain/field';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';
import { HlmFieldControlDescribedBy } from '@spartan-ng/helm/field';
import { classes } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

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
	providers: [
		{
			provide: BrnFieldControl,
			useExisting: forwardRef(() => HlmInput),
		},
	],
	hostDirectives: [HlmFieldControlDescribedBy],
	host: {
		'[attr.aria-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-invalid]': '_ariaInvalid() ? "true" : null',
		'[attr.data-touched]': '_touched() ? "true" : null',
		'[attr.data-dirty]': '_dirty() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
	},
})
export class HlmInput implements BrnFieldControl, OnInit {
	private readonly _injector = inject(Injector);
	private readonly _additionalClasses = signal<ClassValue>('');

	private readonly _errorStateTracker: ErrorStateTracker;

	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });

	public readonly error = input<InputVariants['error']>('auto');

	public readonly controlState = computed(() => this._errorStateTracker.controlState());
	public readonly errors = computed(() => this._errorStateTracker.errors());

	protected readonly _state = linkedSignal(() => ({ error: this.error() }));

	public ngControl: NgControl | null = null;

	protected readonly _ariaInvalid = computed(() => this._errorStateTracker.invalid());
	protected readonly _touched = computed(() => this._errorStateTracker.touched());
	protected readonly _dirty = computed(() => this._errorStateTracker.dirty());
	protected readonly _spartanInvalid = computed(() => this._errorStateTracker.spartanInvalid());

	constructor() {
		this._errorStateTracker = new ErrorStateTracker(
			this._defaultErrorStateMatcher,
			this._parentFormGroup,
			this._parentForm,
		);

		classes(() => [inputVariants({ error: this._state().error }), this._additionalClasses()]);
	}

	ngOnInit() {
		this.ngControl = this._injector.get(NgControl, null);
		if (this.ngControl) {
			this._errorStateTracker.setControl(this.ngControl);
		}
	}

	setError(error: InputVariants['error']) {
		this._state.set({ error });
	}
}
