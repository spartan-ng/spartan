import { Directive, ElementRef, HostListener, inject, signal } from '@angular/core';
import { provideBrnCommandSearchInput } from './brn-command-search-input.token';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: 'input[brnSearchInput]',
	standalone: true,
	providers: [provideBrnCommandSearchInput(BrnCommandSearchInputDirective)],
})
export class BrnCommandSearchInputDirective {
	private readonly _command = injectBrnCommand();
	private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

	/** @internal Expose the current text value */
	public readonly value = signal<string>('');

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
