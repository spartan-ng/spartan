import { BooleanInput } from '@angular/cdk/coercion';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { booleanAttribute, computed, Directive, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnMenuAlign, BrnMenuSide, getBrnMenuPosition } from '@spartan-ng/brain/menu';
import { injectHlmContextMenuConfig } from './hlm-context-menu-token';

@Directive({
	selector: '[hlmContextMenuTrigger]',
	hostDirectives: [
		{
			directive: CdkContextMenuTrigger,
			inputs: [
				'cdkContextMenuTriggerFor: hlmContextMenuTrigger',
				'cdkContextMenuTriggerData: hlmContextMenuTriggerData',
				'cdkContextMenuDisabled: disabled',
			],
			outputs: ['cdkContextMenuOpened: hlmContextMenuOpened', 'cdkContextMenuClosed: hlmContextMenuClosed'],
		},
	],
	host: {
		'data-slot': 'context-menu-trigger',
		'[attr.data-disabled]': 'disabled() ? "" : null',
	},
})
export class HlmContextMenuTrigger {
	private readonly _cdkTrigger = inject(CdkContextMenuTrigger, { host: true });
	private readonly _config = injectHlmContextMenuConfig();

	public readonly disabled = input<boolean, BooleanInput>(this._cdkTrigger.disabled, { transform: booleanAttribute });

	public readonly align = input<BrnMenuAlign>(this._config.align);
	public readonly side = input<BrnMenuSide>(this._config.side);

	private readonly menuPosition = computed(() => getBrnMenuPosition(this.align(), this.side()));

	constructor() {
		// once the trigger opens we wait until the next tick and then grab the last position
		// used to position the menu. we store this in our trigger which the brnMenu directive has
		// access to through DI
		this._cdkTrigger.opened.pipe(takeUntilDestroyed()).subscribe(() =>
			setTimeout(
				() =>
					// eslint-disable-next-line
					((this._cdkTrigger as any)._spartanLastPosition = // eslint-disable-next-line
						(this._cdkTrigger as any).overlayRef._positionStrategy._lastPosition),
			),
		);

		effect(() => {
			this._cdkTrigger.menuPosition = this.menuPosition();
		});
	}
}
