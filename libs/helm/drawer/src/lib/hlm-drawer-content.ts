import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { classes } from '@spartan-ng/helm/utils';
import { HlmDrawerHandle } from './hlm-drawer-handle';

@Component({
	selector: 'hlm-drawer-content',
	imports: [HlmDrawerHandle],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'drawer-content',
		'[attr.data-vaul-drawer-direction]': '_sideProvider.side()',
		'[attr.data-state]': 'state()',
	},
	template: `
		<div hlmDrawerHandle></div>
		<ng-content />
	`,
})
export class HlmDrawerContent {
	private readonly _stateProvider = injectExposesStateProvider({ host: true });
	protected readonly _sideProvider = injectExposedSideProvider({ host: true });
	public readonly state = this._stateProvider.state ?? signal('closed');

	constructor() {
		classes(() => [
			'spartan-drawer-content',
			'group/drawer-content',
			'data-open:animate-in data-closed:animate-out',
			'data-[vaul-drawer-direction=bottom]:data-closed:slide-out-to-bottom data-[vaul-drawer-direction=bottom]:data-open:slide-in-from-bottom',
			'data-[vaul-drawer-direction=top]:data-closed:slide-out-to-top data-[vaul-drawer-direction=top]:data-open:slide-in-from-top',
			'data-[vaul-drawer-direction=left]:data-closed:slide-out-to-left data-[vaul-drawer-direction=left]:data-open:slide-in-from-left',
			'data-[vaul-drawer-direction=right]:data-closed:slide-out-to-right data-[vaul-drawer-direction=right]:data-open:slide-in-from-right',
		]);
		effect(() => {
			const currentState = this.state();
			if (currentState === 'open') {
				document.body.style.pointerEvents = 'none';
			} else {
				setTimeout(() => {
					document.body.style.pointerEvents = '';
				}, 300);
			}
		});
	}
}
