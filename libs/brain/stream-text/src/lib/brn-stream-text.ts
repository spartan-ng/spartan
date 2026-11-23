import { isPlatformBrowser } from '@angular/common';
import {
	booleanAttribute,
	computed,
	DestroyRef,
	Directive,
	effect,
	inject,
	input,
	PLATFORM_ID,
	signal,
	untracked,
} from '@angular/core';
import { marked } from 'marked';
import { balanceMarkdown } from './balance-markdown';

function escapeHtml(text: string): string {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

@Directive({
	selector: '[brnStreamText],brn-stream-text',
	exportAs: 'brnStreamText',
	host: {
		'data-slot': 'stream-text',
		'[attr.data-streaming]': 'active() ? "" : null',
		'[attr.data-markdown]': 'markdown() ? "" : null',
		'[attr.aria-busy]': 'active() ? "true" : null',
		'[innerHTML]': '_renderedHtml()',
	},
})
export class BrnStreamText {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private _frame: number | null = null;

	/** Raw text stream content. */
	public readonly content = input.required<string>();

	/** Whether active token streaming is in progress. */
	public readonly streaming = input(false, { transform: booleanAttribute });

	/** Whether to automatically balance unclosed Markdown tokens during streaming. */
	public readonly autoBalance = input(true, { transform: booleanAttribute });

	/** Whether to render the content as Markdown. The resulting HTML is sanitized by Angular. */
	public readonly markdown = input(false, { transform: booleanAttribute });

	/** Whether to reveal content at a steady pace instead of in the bursts it arrives in. */
	public readonly smooth = input(false, { transform: booleanAttribute });

	private readonly _revealed = signal('');

	/** The portion of `content` currently shown. Equals `content` unless `smooth` is on and still catching up. */
	public readonly displayedContent = computed(() =>
		this.smooth() && this._isBrowser ? this._revealed() : this.content(),
	);

	/** True while `smooth` is still catching up with `content`. */
	public readonly revealing = computed(
		() => this.smooth() && this._isBrowser && this._revealed().length < this.content().length,
	);

	/** True while streaming, or while smooth reveal is still catching up. Drives the cursor and balancing. */
	public readonly active = computed(() => this.streaming() || this.revealing());

	/** Stabilized content with balanced tokens during streaming. */
	public readonly effectiveContent = computed(() => {
		const raw = this.displayedContent();
		if (!this.active() || !this.autoBalance()) {
			return raw;
		}
		return balanceMarkdown(raw);
	});

	/** Markdown rendered to HTML. */
	public readonly html = computed(() => marked.parse(this.effectiveContent(), { async: false, gfm: true }));

	/** What is bound to the host: rendered Markdown, or the escaped plain text. Angular sanitizes either. */
	protected readonly _renderedHtml = computed(() =>
		this.markdown() ? this.html() : escapeHtml(this.effectiveContent()),
	);

	constructor() {
		inject(DestroyRef).onDestroy(() => this._cancel());

		effect(() => {
			const target = this.content();
			const smooth = this.smooth();
			untracked(() => {
				if (!smooth || !this._isBrowser) {
					this._cancel();
					this._revealed.set(target);
					return;
				}
				// content was replaced rather than appended to: restart from what is shown if it still matches
				if (!target.startsWith(this._revealed())) {
					this._cancel();
					this._revealed.set('');
				}
				this._schedule();
			});
		});
	}

	private _schedule(): void {
		if (this._frame !== null) {
			return;
		}
		this._frame = requestAnimationFrame(() => {
			this._frame = null;
			const target = this.content();
			const shown = this._revealed();
			if (shown.length >= target.length) {
				return;
			}
			// reveal a fraction of the backlog per frame so large bursts catch up quickly but smoothly
			const step = Math.max(1, Math.ceil((target.length - shown.length) / 8));
			this._revealed.set(target.slice(0, shown.length + step));
			this._schedule();
		});
	}

	private _cancel(): void {
		if (this._frame !== null) {
			cancelAnimationFrame(this._frame);
			this._frame = null;
		}
	}
}
