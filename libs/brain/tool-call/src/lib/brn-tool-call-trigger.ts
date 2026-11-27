import { computed, Directive } from '@angular/core';
import { injectBrnToolCall } from './brn-tool-call.token';

@Directive({
	selector: 'button[brnToolCallTrigger],[brnToolCallTrigger]',
	exportAs: 'brnToolCallTrigger',
	host: {
		type: 'button',
		'data-slot': 'tool-call-trigger',
		'[attr.aria-expanded]': 'ariaExpanded()',
		'[attr.aria-controls]': 'ariaControls()',
		'(click)': 'onClick()',
	},
})
export class BrnToolCallTrigger {
	private readonly _parent = injectBrnToolCall({ optional: true });

	public readonly ariaExpanded = computed(() => (this._parent?.expanded() ? 'true' : 'false'));

	public readonly ariaControls = computed(() => this._parent?.panelIds().join(' ') || null);

	protected onClick(): void {
		this._parent?.toggleExpanded();
	}
}
