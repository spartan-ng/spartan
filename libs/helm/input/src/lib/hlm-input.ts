import {
	computed,
	Directive,
	type DoCheck,
	effect,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	signal,
	untracked,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';
import { hlm } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const inputVariants = cva(
	'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
	{
		variants: {
			error: {
				auto: '[&.ng-invalid.ng-touched]:border-destructive [&.ng-invalid.ng-touched]:ring-destructive/20 dark:[&.ng-invalid.ng-touched]:ring-destructive/40',
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
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => HlmInput),
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmInput implements BrnFormFieldControl, DoCheck {
	private readonly _injector = inject(Injector);
	private readonly _additionalClasses = signal<ClassValue>('');

	private readonly _errorStateTracker: ErrorStateTracker;

	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(inputVariants({ error: this._state().error }), this.userClass(), this._additionalClasses()),
	);

	public readonly error = input<InputVariants['error']>('auto');

	protected readonly _state = linkedSignal(() => ({ error: this.error() }));

	public readonly ngControl: NgControl | null = this._injector.get(NgControl, null);

	public readonly errorState = computed(() => this._errorStateTracker.errorState());

	constructor() {
		this._errorStateTracker = new ErrorStateTracker(
			this._defaultErrorStateMatcher,
			this.ngControl,
			this._parentFormGroup,
			this._parentForm,
		);

		effect(() => {
			const error = this._errorStateTracker.errorState();
			untracked(() => {
				if (this.ngControl) {
					const shouldShowError = error && this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty);
					this._errorStateTracker.errorState.set(shouldShowError ? true : false);
					this.setError(shouldShowError ? true : 'auto');
				}
			});
		});
	}

	ngDoCheck() {
		this._errorStateTracker.updateErrorState();
	}

	setError(error: InputVariants['error']) {
		this._state.set({ error });
	}

	setClass(classes: string): void {
		this._additionalClasses.set(classes);
	}
}
