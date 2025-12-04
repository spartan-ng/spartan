import { Directive, ElementRef, Renderer2, computed, contentChild, effect, inject, input, signal } from '@angular/core';
import { BrnCommandSearchInputToken } from '@spartan-ng/brain/command';
import { injectExposesStateProvider } from '@spartan-ng/brain/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCommandDialog]',
	host: {
		'data-slot': 'command-dialog',
		'[class]': '_computedClass()',
	},
})
export class HlmCommandDialog {
	private readonly _stateProvider = injectExposesStateProvider({ host: true });
	public readonly state = this._stateProvider.state ?? signal('closed').asReadonly();
	private readonly _renderer = inject(Renderer2);
	private readonly _element = inject(ElementRef);

	/** Access the search field */
	private readonly _searchInput = contentChild(BrnCommandSearchInputToken, { read: ElementRef });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]',
			this.userClass(),
		),
	);

	constructor() {
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());

			const searchInput = this._searchInput();

			if (this.state() === 'open' && searchInput) {
				searchInput.nativeElement.focus();
			}
		});
	}
}
