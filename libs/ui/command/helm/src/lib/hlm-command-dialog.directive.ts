import { Directive, ElementRef, Renderer2, computed, effect, inject, input, signal } from '@angular/core';
import { hlm, injectExposesStateProvider } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';
import { HlmCommandDirective } from './hlm-command.directive';

@Directive({
	selector: '[hlmCmdDialog]',
	standalone: true,
	hostDirectives: [HlmCommandDirective],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandDialogDirective {
	private readonly _stateProvider = injectExposesStateProvider({ host: true });
	public state = this._stateProvider.state ?? signal('closed').asReadonly();
	private readonly _renderer = inject(Renderer2);
	private readonly _element = inject(ElementRef);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%]  data-[state=open]:slide-in-from-top-[2%]',
			this.userClass(),
		),
	);

	constructor() {
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
		});
	}
}
