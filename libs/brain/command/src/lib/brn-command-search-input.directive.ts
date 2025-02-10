import { Directive, ElementRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { provideBrnCommandSearchInput } from './brn-command-search-input.token';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: 'input[brnCommandSearchInput]',
	standalone: true,
	providers: [provideBrnCommandSearchInput(BrnCommandSearchInputDirective)],
	host: {
		role: 'combobox',
		'aria-autocomplete': 'list',
		'[attr.aria-activedescendant]': '_activeDescendant()',
	},
})
export class BrnCommandSearchInputDirective {
	private readonly _command = injectBrnCommand();
	private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

	/** @internal Expose the current text value */
	public readonly value = signal<string>('');

	/** The id of the active option */
	protected readonly _activeDescendant = signal<string | undefined>(undefined);

	constructor() {
		this._command.keyManager.change
			.pipe(startWith(this._command.keyManager.activeItemIndex), takeUntilDestroyed())
			.subscribe(() => this._activeDescendant.set(this._command.keyManager.activeItem?.id()));
	}

	/** Listen for changes to the input value */
	@HostListener('input')
	protected onInput(): void {
		this.value.set(this._elementRef.nativeElement.value);
	}

	/** Listen for keydown events */
	@HostListener('keydown', ['$event'])
	protected onKeyDown(event: KeyboardEvent): void {
		this._command.keyManager.onKeydown(event);
	}
}
