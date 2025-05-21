import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Renderer2,
	computed,
	effect,
	inject,
	input,
	signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { hlm, injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { BrnSheetCloseDirective } from '@spartan-ng/brain/sheet';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { HlmSheetCloseDirective } from './hlm-sheet-close.directive';

export const sheetVariants = cva(
	'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
	{
		variants: {
			side: {
				top: 'border-border inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
				bottom:
					'border-border inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
				left: 'border-border inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
				right:
					'border-border inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
			},
		},
		defaultVariants: {
			side: 'right',
		},
	},
);

@Component({
	selector: 'hlm-sheet-content',
	imports: [HlmSheetCloseDirective, BrnSheetCloseDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideX })],
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': 'state()',
	},
	template: `
		<ng-content />
		<button brnSheetClose hlm>
			<span class="sr-only">Close</span>
			<ng-icon hlm size="sm" name="lucideX" />
		</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmSheetContentComponent {
	private readonly _stateProvider = injectExposesStateProvider({ host: true });
	private readonly _sideProvider = injectExposedSideProvider({ host: true });
	public state = this._stateProvider.state ?? signal('closed');
	private readonly _renderer = inject(Renderer2);
	private readonly _element = inject(ElementRef);

	constructor() {
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
		});
	}

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(sheetVariants({ side: this._sideProvider.side() }), this.userClass()));
}
