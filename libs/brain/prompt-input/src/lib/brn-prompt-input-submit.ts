import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { injectBrnPromptInput } from './brn-prompt-input.token';

@Directive({
	selector: 'button[brnPromptInputSubmit],[brnPromptInputSubmit]',
	exportAs: 'brnPromptInputSubmit',
	host: {
		type: 'submit',
		'data-slot': 'prompt-input-submit',
		'[disabled]': 'effectiveDisabled()',
		'(click)': 'onClick($event)',
	},
})
export class BrnPromptInputSubmit {
	private readonly _parent = injectBrnPromptInput({ optional: true });

	/** Explicit disabled override. */
	public readonly disabled = input<boolean | undefined>(undefined, { transform: booleanAttribute });

	public readonly effectiveDisabled = computed(() => {
		const explicit = this.disabled();
		if (explicit !== undefined) {
			return explicit;
		}
		return this._parent?.disabled() ?? false;
	});

	protected onClick(event: MouseEvent): void {
		if (this.effectiveDisabled()) {
			return;
		}

		if (this._parent) {
			event.preventDefault();
			this._parent.requestSubmit();
		}
	}
}
