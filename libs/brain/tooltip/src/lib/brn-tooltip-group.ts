import { inject, Injectable, InjectionToken, type Provider } from '@angular/core';
import { injectSkipDelay } from '@spartan-ng/brain/core';

export interface BrnTooltipGroupOptions {
	/** Time (ms) after the last tooltip closes during which others open instantly. `0` disables it. */
	skipDelayDuration: number;
}

const defaultGroupOptions: BrnTooltipGroupOptions = { skipDelayDuration: 300 };

const BRN_TOOLTIP_GROUP_OPTIONS = new InjectionToken<BrnTooltipGroupOptions>('BrnTooltipGroupOptions');

/** Skip-delay coordinator for grouped tooltips; provide via `provideBrnTooltipGroup` on the wrapper. */
@Injectable()
export class BrnTooltipGroup {
	private readonly _options = inject(BRN_TOOLTIP_GROUP_OPTIONS);
	private readonly _skipDelay = injectSkipDelay(() => this._options.skipDelayDuration);

	/** Whether the next tooltip waits for its show delay, or opens instantly within the skip window. */
	public readonly isOpenDelayed = this._skipDelay.isOpenDelayed;

	public onOpen(): void {
		this._skipDelay.open();
	}

	public onClose(): void {
		this._skipDelay.close();
	}
}

export function provideBrnTooltipGroup(options?: Partial<BrnTooltipGroupOptions>): Provider[] {
	return [{ provide: BRN_TOOLTIP_GROUP_OPTIONS, useValue: { ...defaultGroupOptions, ...options } }, BrnTooltipGroup];
}
