import { booleanAttribute, computed, Directive, input, output, signal } from '@angular/core';
import type { BrnPromptInputTextarea } from './brn-prompt-input-textarea';
import { BRN_PROMPT_INPUT_TOKEN } from './brn-prompt-input.token';

@Directive({
	selector: '[brnPromptInput],brn-prompt-input',
	exportAs: 'brnPromptInput',
	providers: [
		{
			provide: BRN_PROMPT_INPUT_TOKEN,
			useExisting: BrnPromptInput,
		},
	],
	host: {
		'data-slot': 'prompt-input',
		'[attr.data-disabled]': 'disabled() ? "" : null',
		'[attr.data-streaming]': 'streaming() ? "" : null',
	},
})
export class BrnPromptInput {
	/** Whether the prompt input and child textarea are disabled. */
	public readonly disabled = input(false, { transform: booleanAttribute });

	/** Whether an active stream/generation is in progress. */
	public readonly streaming = input(false, { transform: booleanAttribute });

	/** Default minimum visible lines for the textarea. */
	public readonly minRows = input<number>(1);

	/** Default maximum visible lines before scrolling. */
	public readonly maxRows = input<number>(6);

	/** Emits the trimmed prompt string when submitted. */
	public readonly promptSubmit = output<string>();

	/** Emits when generation should be stopped or cancelled. */
	public readonly promptStop = output<void>();

	/** Registered textarea instance. */
	private readonly _textarea = signal<BrnPromptInputTextarea | null>(null);
	public readonly textarea = computed(() => this._textarea());

	public registerTextarea(textarea: BrnPromptInputTextarea): void {
		this._textarea.set(textarea);
	}

	public unregisterTextarea(textarea: BrnPromptInputTextarea): void {
		if (this._textarea() === textarea) {
			this._textarea.set(null);
		}
	}

	/** Requests submission of current textarea content. */
	public requestSubmit(): void {
		if (this.disabled()) {
			return;
		}

		const textarea = this._textarea();
		if (!textarea) {
			return;
		}

		const rawValue = textarea.getValue();
		const trimmed = rawValue.trim();

		if (!trimmed) {
			return;
		}

		this.promptSubmit.emit(trimmed);
		textarea.clear();
	}

	/** Requests generation to stop. */
	public requestStop(): void {
		this.promptStop.emit();
	}
}
