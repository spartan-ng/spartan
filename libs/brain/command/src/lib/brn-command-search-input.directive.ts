import { computed, Directive, effect, ElementRef, Inject, input, Optional, Renderer2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { COMPOSITION_BUFFER_MODE, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { provideBrnCommandSearchInput } from './brn-command-search-input.token';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: 'input[brnCommandSearchInput]',
	standalone: true,
	providers: [
		provideBrnCommandSearchInput(BrnCommandSearchInputDirective),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: BrnCommandSearchInputDirective,
			multi: true,
		},
	],
	host: {
		role: 'combobox',
		'aria-autocomplete': 'list',
		'[attr.aria-activedescendant]': '_activeDescendant()',
		'(keydown)': 'onKeyDown($event)',
		'(input)': 'onInput()',
	},
})
export class BrnCommandSearchInputDirective extends DefaultValueAccessor {
	private readonly _command = injectBrnCommand();

	/** The initial value of the search input */
	public readonly value = input<string>('');

	/** @internal The mutable value of the search input */
	public readonly mutableValue = computed(() => signal(this.value()));

	/** @internal The "real" value of the search input */
	public readonly valueState = computed(() => this.mutableValue()());

	/** The id of the active option */
	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	constructor(
		renderer: Renderer2,
		private readonly elementRef: ElementRef,
		@Optional() @Inject(COMPOSITION_BUFFER_MODE) compositionMode: boolean,
	) {
		super(renderer, elementRef, compositionMode);
		this._command.keyManager.change
			.pipe(startWith(this._command.keyManager.activeItemIndex), takeUntilDestroyed())
			.subscribe(() => this._activeDescendant.set(this._command.keyManager.activeItem?.id()));
		effect(() => {
			this.elementRef.nativeElement.value = this.valueState();
		});
	}
	/** Listen for changes to the input value */
	protected onInput(): void {
		this.mutableValue().set(this.elementRef.nativeElement.value);
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		this._command.keyManager.onKeydown(event);
	}

	/** CONROL VALUE ACCESSOR */
	override writeValue(value: string | null): void {
		super.writeValue(value);
		if (value) {
			this.mutableValue().set(value);
		}
	}
}
