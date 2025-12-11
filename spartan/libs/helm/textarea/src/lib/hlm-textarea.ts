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

export const textareaVariants = cva(
	'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex [field-sizing:content] min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
type TextareaVariants = VariantProps<typeof textareaVariants>;

@Directive({
	selector: '[hlmTextarea]',
	providers: [
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => HlmTextarea),
		},
	],
	host: {
		'data-slot': 'textarea',
		'[class]': '_computedClass()',
	},
})
export class HlmTextarea implements BrnFormFieldControl, DoCheck {
	private readonly _injector = inject(Injector);
	private readonly _additionalClasses = signal<ClassValue>('');

	private readonly _errorStateTracker: ErrorStateTracker;

	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	private readonly _parentForm = inject(NgForm, { optional: true });
	private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(textareaVariants({ error: this._state().error }), this.userClass(), this._additionalClasses()),
	);

	public readonly error = input<TextareaVariants['error']>('auto');

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

	public setError(error: TextareaVariants['error']): void {
		this._state.set({ error });
	}

	public setClass(classes: string): void {
		this._additionalClasses.set(classes);
	}
}
