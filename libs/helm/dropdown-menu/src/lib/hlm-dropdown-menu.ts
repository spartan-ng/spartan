import { type NumberInput } from '@angular/cdk/coercion';
import { CdkMenu } from '@angular/cdk/menu';
import { computed, Directive, inject, input, numberAttribute, RendererFactory2, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { determineMenuSideAndTransformOriginWithDarkMagic, hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmDropdownMenu],hlm-dropdown-menu',
	hostDirectives: [CdkMenu],
	host: {
		'data-slot': 'dropdown-menu',
		'[attr.data-state]': '_state()',
		'[attr.data-side]': '_side()',
		'[class]': '_computedClass()',
		'[style.--side-offset]': 'sideOffset()',
	},
})
export class HlmDropdownMenu {
	private readonly _rendererFactory = inject(RendererFactory2);
	private readonly _renderer = this._rendererFactory.createRenderer(null, null);
	private readonly _host = inject(CdkMenu);

	protected readonly _state = signal('open');
	protected readonly _side = signal('top');

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 my-[--spacing(var(--side-offset))] min-w-[8rem] origin-[var(--brn-menu-transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
			this.userClass(),
		),
	);

	public readonly sideOffset = input<number, NumberInput>(1, { transform: numberAttribute });

	constructor() {
		determineMenuSideAndTransformOriginWithDarkMagic(this._host, this._renderer, (side: string) =>
			this._side.set(side),
		);
		// this is a best effort, but does not seem to work currently
		// TODO: figure out a way for us to know the host is about to be closed. might not be possible with CDK
		this._host.closed.pipe(takeUntilDestroyed()).subscribe(() => this._state.set('closed'));
	}
}
