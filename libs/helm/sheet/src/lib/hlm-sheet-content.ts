import type { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	effect,
	ElementRef,
	inject,
	input,
	Renderer2,
	signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { HlmButton } from '@spartan-ng/helm/button';

import { classes } from '@spartan-ng/helm/utils';
import { HlmSheetClose } from './hlm-sheet-close';

@Component({
	selector: 'hlm-sheet-content',
	imports: [HlmButton, HlmSheetClose, NgIcon],
	providers: [provideIcons({ lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'sheet-content',
		'[attr.data-side]': '_sideProvider.side()',
		'[attr.data-state]': 'state()',
	},
	template: `
		<ng-content />

		@if (showCloseButton()) {
			<button hlmBtn variant="ghost" size="icon-sm" class="spartan-sheet-close" hlmSheetClose>
				<span class="sr-only">Close</span>
				<ng-icon name="lucideX" />
			</button>
		}
	`,
})
export class HlmSheetContent {
	private readonly _stateProvider = injectExposesStateProvider({ host: true });
	protected readonly _sideProvider = injectExposedSideProvider({ host: true });
	public readonly state = this._stateProvider.state ?? signal('closed');
	private readonly _renderer = inject(Renderer2);
	private readonly _element = inject(ElementRef);

	public readonly showCloseButton = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	constructor() {
		classes(() => [
			'spartan-sheet-content',
			'data-open:animate-in data-closed:animate-out',
			'data-[side=top]:data-closed:slide-out-to-top data-[side=top]:data-open:slide-in-from-top',
			'data-[side=bottom]:data-closed:slide-out-to-bottom data-[side=bottom]:data-open:slide-in-from-bottom',
			'data-[side=left]:data-closed:slide-out-to-left data-[side=left]:data-open:slide-in-from-left',
			'data-[side=right]:data-closed:slide-out-to-right data-[side=right]:data-open:slide-in-from-right',
		]);
		effect(() => {
			this._renderer.setAttribute(this._element.nativeElement, 'data-state', this.state());
		});
	}
}
