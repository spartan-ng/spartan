import { Directive, effect, ElementRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { provideBrnCommandInput } from './brn-command-input.token';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: 'input[brnCommandInput]',
	providers: [provideBrnCommandInput(BrnCommandInput)],
	host: {
		'[id]': 'id()',
		role: 'combobox',
		'aria-autocomplete': 'list',
		'[attr.aria-activedescendant]': '_activeDescendant()',
		'[attr.disabled]': '_disabled() ? "" : null',
		'(keydown)': 'onKeyDown($event)',
		'(input)': 'onInput()',
		type: 'text',
		autocomplete: 'off',
		autocorrect: 'off',
		spellcheck: 'false',
	},
})
export class BrnCommandInput {
	private static _id = 0;

	private readonly _el = inject(ElementRef);
	private readonly _command = injectBrnCommand();

	private readonly _initialId = `brn-command-input-${++BrnCommandInput._id}`;

	/** The id of the command input */
	public readonly id = input<string, string | undefined>(this._initialId, {
		transform: (value) => value || this._initialId,
	});

	protected readonly _disabled = this._command.disabledState;

	/** The id of the active option */
	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	constructor() {
		this._command.keyManager.change
			.pipe(startWith(this._command.keyManager.activeItemIndex), takeUntilDestroyed())
			.subscribe(() => this._activeDescendant.set(this._command.keyManager.activeItem?.id()));

		effect(() => {
			const search = this._command.search();

			if (this._el.nativeElement.value !== search) {
				this._el.nativeElement.value = search;
			}
		});
	}
	/** Listen for changes to the input value */
	protected onInput(): void {
		this._command.search.set(this._el.nativeElement.value);
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		this._command.keyManager.onKeydown(event);
	}
}
