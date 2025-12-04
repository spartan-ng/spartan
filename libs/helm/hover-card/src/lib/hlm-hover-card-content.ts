import { Directive, ElementRef, Renderer2, computed, effect, inject, input, signal } from '@angular/core';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmHoverCardContent],hlm-hover-card-content',
	host: {
		'data-slot': 'hover-card-content',
		'[class]': '_computedClass()',
	},
})
export class HlmHoverCardContent {
	private readonly _renderer = inject(Renderer2);
	private readonly _element = inject(ElementRef);

	public readonly state = injectExposesStateProvider({ host: true }).state ?? signal('closed').asReadonly();
	public readonly side = injectExposedSideProvider({ host: true }).side ?? signal('bottom').asReadonly();

	constructor() {
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
			this._renderer.setAttribute(this._element.nativeElement, 'data-side', this.side());
		});
	}

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'border-border bg-popover text-popover-foreground z-50 w-64 rounded-md border p-4 shadow-md outline-none',
			'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			this.userClass(),
		),
	);
}
