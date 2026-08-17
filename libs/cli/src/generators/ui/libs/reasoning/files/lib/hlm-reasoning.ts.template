import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, effect, input, model, signal, untracked } from '@angular/core';
import { BrnCollapsible, injectBrnCollapsible } from '@spartan-ng/brain/collapsible';
import { provideHlmReasoning } from './hlm-reasoning-token';

/** Delay (ms) after streaming ends before the reasoning content auto-collapses. */
const AUTO_CLOSE_DELAY_MS = 1000;
const MS_IN_S = 1000;

/**
 * Displays AI reasoning content. Automatically opens while `isStreaming` is `true` and
 * auto-collapses shortly after streaming finishes, mirroring the AI Elements `Reasoning` component.
 *
 * Composes `BrnCollapsible` for the underlying expand/collapse mechanics.
 */
@Directive({
	selector: '[hlmReasoning],hlm-reasoning',
	providers: [provideHlmReasoning(HlmReasoning)],
	hostDirectives: [
		{
			directive: BrnCollapsible,
			inputs: ['expanded: open', 'disabled'],
			outputs: ['expandedChange: openChange'],
		},
	],
	host: {
		'data-slot': 'reasoning',
		'[attr.data-streaming]': 'isStreaming() ? true : undefined',
	},
})
export class HlmReasoning {
	private readonly _collapsible = injectBrnCollapsible();

	/** Whether the reasoning content is actively streaming in. */
	public readonly isStreaming = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Duration (in seconds) reasoning took. Computed automatically once streaming ends unless provided. */
	public readonly duration = model<number | undefined>(undefined);

	private readonly _hasEverStreamed = signal(false);
	private readonly _hasAutoClosed = signal(false);
	private _startTime: number | null = null;

	constructor() {
		if (!this._collapsible) {
			throw new Error('HlmReasoning requires its BrnCollapsible host directive to be present.');
		}

		// Track streaming start/end to compute duration once streaming stops.
		effect(() => {
			const streaming = this.isStreaming();
			if (streaming) {
				this._startTime ??= Date.now();
				// A new streaming cycle starting (e.g. a message being regenerated) should be able
				// to auto-close again once it finishes, rather than being blocked by a previous cycle.
				untracked(() => {
					this._hasEverStreamed.set(true);
					this._hasAutoClosed.set(false);
				});
			} else if (this._startTime !== null) {
				const elapsed = Math.ceil((Date.now() - this._startTime) / MS_IN_S);
				this._startTime = null;
				untracked(() => this.duration.set(elapsed));
			}
		});

		// Auto-open as soon as streaming starts.
		effect(() => {
			const streaming = this.isStreaming();
			const collapsible = this._collapsible;
			if (streaming && collapsible && !collapsible.expanded()) {
				untracked(() => collapsible.expanded.set(true));
			}
		});

		// Auto-close once, shortly after streaming ends. Deliberately does NOT read
		// `collapsible.expanded()` here: reading it would track the signal as a reactive
		// dependency, causing the effect to re-run whenever the user manually toggles the
		// panel — which would restart the timer and auto-close a user-initiated reopen.
		// We only need to react to streaming and the one-shot guard changing.
		effect((onCleanup) => {
			const streaming = this.isStreaming();
			const collapsible = this._collapsible;
			if (collapsible && this._hasEverStreamed() && !streaming && !this._hasAutoClosed()) {
				const timer = setTimeout(() => {
					untracked(() => {
						collapsible.expanded.set(false);
						this._hasAutoClosed.set(true);
					});
				}, AUTO_CLOSE_DELAY_MS);
				onCleanup(() => clearTimeout(timer));
			}
		});
	}
}
