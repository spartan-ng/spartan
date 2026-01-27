import { DestroyRef, Directive, effect, ElementRef, forwardRef, inject, Injector, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { provideBrnCommandInput } from './brn-command-input.token';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: 'input[brnCommandInput]',
	providers: [
		provideBrnCommandInput(BrnCommandInput),
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BrnCommandInput),
			multi: true,
		},
	],
	host: {
		role: 'combobox',
		'aria-autocomplete': 'list',
		'[attr.aria-activedescendant]': '_activeDescendant()',
		'(keydown)': 'onKeyDown($event)',
		'(input)': 'onInput()',
		type: 'text',
		autocomplete: 'off',
		autocorrect: 'off',
		spellcheck: 'false',
	},
})
export class BrnCommandInput extends DefaultValueAccessor implements OnInit {
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _el = inject(ElementRef);
	private readonly _injector = inject(Injector);
	private readonly _command = injectBrnCommand();

	/** The id of the active option */
	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	ngOnInit() {
		this._command.keyManager.change
			.pipe(startWith(this._command.keyManager.activeItemIndex), takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._activeDescendant.set(this._command.keyManager.activeItem?.id()));
		effect(
			() => {
				const search = this._command.search();

				if (this._el.nativeElement.value !== search) {
					this._el.nativeElement.value = search;
				}
			},
			{ injector: this._injector },
		);
	}
	/** Listen for changes to the input value */
	protected onInput(): void {
		this._command.search.set(this._el.nativeElement.value);
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		this._command.keyManager.onKeydown(event);
	}

	/** CONTROL VALUE ACCESSOR */
	override writeValue(value: string | null): void {
		super.writeValue(value);
		if (value) {
			this._command.search.set(value);
		}
	}
}
