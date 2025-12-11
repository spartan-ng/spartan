import {
	computed,
	DestroyRef,
	Directive,
	effect,
	ElementRef,
	forwardRef,
	inject,
	Injector,
	input,
	OnInit,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { provideBrnCommandSearchInput } from './brn-command-search-input.token';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: 'input[brnCommandSearchInput]',
	providers: [
		provideBrnCommandSearchInput(BrnCommandSearchInput),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BrnCommandSearchInput),
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
export class BrnCommandSearchInput extends DefaultValueAccessor implements OnInit {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _el = inject(ElementRef);
	private readonly _injector = inject(Injector);
	private readonly _command = injectBrnCommand();

	/** The initial value of the search input */
	public readonly value = input<string>('');

	/** @internal The mutable value of the search input */
	public readonly mutableValue = computed(() => signal(this.value()));

	/** @internal The "real" value of the search input */
	public readonly valueState = computed(() => this.mutableValue()());

	/** The id of the active option */
	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	ngOnInit() {
		this._command.keyManager.change
			.pipe(startWith(this._command.keyManager.activeItemIndex), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._activeDescendant.set(this._command.keyManager.activeItem?.id()));
		effect(
			() => {
				this._el.nativeElement.value = this.valueState();
			},
			{ injector: this._injector },
		);
	}
	/** Listen for changes to the input value */
	protected onInput(): void {
		this.mutableValue().set(this._el.nativeElement.value);
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
