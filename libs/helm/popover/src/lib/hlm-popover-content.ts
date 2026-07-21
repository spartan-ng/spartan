import { Directive, ElementRef, Renderer2, computed, effect, inject, signal } from '@angular/core';
import { injectExposesStateProvider } from '@spartan-ng/brain/core';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmPopoverContent],hlm-popover-content',
	host: {
		'data-slot': 'popover-content',
		'[style.--brn-popover-trigger-width.px]': '_triggerWidth()',
	},
})
export class HlmPopoverContent {
	private readonly _stateProvider = injectExposesStateProvider({ host: true });
	public state = this._stateProvider.state ?? signal('closed');
	private readonly _renderer = inject(Renderer2);
	private readonly _element = inject(ElementRef);
	private readonly _popover = inject(BrnPopover, { optional: true });

	protected readonly _triggerWidth = computed(() => this._popover?.triggerWidth() ?? null);

	constructor() {
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
		});

		classes(() => 'spartan-popover-content relative flex w-72 flex-col outline-none');
	}
}
