import {
	afterNextRender,
	booleanAttribute,
	computed,
	DestroyRef,
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	output,
	untracked,
} from '@angular/core';
import { injectBrnPromptInput } from './brn-prompt-input.token';

@Directive({
	selector: 'textarea[brnPromptInputTextarea],[brnPromptInputTextarea]',
	exportAs: 'brnPromptInputTextarea',
	host: {
		'data-slot': 'prompt-input-textarea',
		'[disabled]': 'effectiveDisabled()',
		'[rows]': 'effectiveMinRows()',
		'(input)': 'onInput()',
		'(keydown)': 'onKeydown($event)',
	},
})
export class BrnPromptInputTextarea {
	private readonly _elementRef = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly _parent = injectBrnPromptInput({ optional: true });

	/** Overrides the minimum rows. Defaults to parent prompt-input minRows (1). */
	public readonly minRows = input<number | undefined>(undefined);

	/** Overrides the maximum rows before scrolling. Defaults to parent prompt-input maxRows (6). */
	public readonly maxRows = input<number | undefined>(undefined);

	/** Explicit disabled override. Defaults to parent prompt-input disabled state. */
	public readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

	/** Whether to auto-resize the textarea height based on content. */
	public readonly autoResize = input(true, { transform: booleanAttribute });

	/** Whether pressing Enter (without Shift) triggers submit. */
	public readonly submitOnEnter = input(true, { transform: booleanAttribute });

	/** Emits when Enter is pressed without Shift if not handled by parent. */
	public readonly promptSubmit = output<string>();

	/** Effective disabled state. */
	public readonly effectiveDisabled = computed(() => {
		const explicit = this.disabled();
		if (explicit !== undefined) {
			return explicit;
		}
		return this._parent?.disabled() ?? false;
	});

	/** Effective min rows. */
	public readonly effectiveMinRows = computed(() => this.minRows() ?? this._parent?.minRows() ?? 1);

	/** Effective max rows. */
	public readonly effectiveMaxRows = computed(() => this.maxRows() ?? this._parent?.maxRows() ?? 6);

	constructor() {
		if (this._parent) {
			this._parent.registerTextarea(this);
			this._destroyRef.onDestroy(() => {
				this._parent?.unregisterTextarea(this);
			});
		}

		afterNextRender(() => {
			this.adjustHeight();
		});

		// Recalculate the height when the row limits or auto-resize change after the first render.
		effect(() => {
			this.effectiveMinRows();
			this.effectiveMaxRows();
			this.autoResize();
			if (typeof window !== 'undefined' && this._elementRef.nativeElement.isConnected) {
				untracked(() => this.adjustHeight());
			}
		});
	}

	public get element(): HTMLTextAreaElement {
		return this._elementRef.nativeElement;
	}

	public getValue(): string {
		return this.element.value;
	}

	public setValue(value: string): void {
		this.element.value = value;
		this.element.dispatchEvent(new Event('input', { bubbles: true }));
		this.adjustHeight();
	}

	public clear(): void {
		this.setValue('');
	}

	public focus(): void {
		this.element.focus();
	}

	public adjustHeight(): void {
		if (!this.autoResize()) {
			return;
		}

		const el = this.element;
		if (!el) {
			return;
		}

		// Reset height to measure accurate scrollHeight
		el.style.height = 'auto';

		const computedStyle = window.getComputedStyle(el);
		const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
		const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
		const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
		const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
		const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;

		const verticalPadding = paddingTop + paddingBottom + borderTop + borderBottom;
		const minHeight = this.effectiveMinRows() * lineHeight + verticalPadding;
		const maxHeight = this.effectiveMaxRows() * lineHeight + verticalPadding;

		const currentScrollHeight = el.scrollHeight;
		const targetHeight = Math.min(Math.max(currentScrollHeight, minHeight), maxHeight);

		el.style.height = `${targetHeight}px`;
		el.style.overflowY = currentScrollHeight > maxHeight ? 'auto' : 'hidden';
	}

	protected onInput(): void {
		this.adjustHeight();
	}

	protected onKeydown(event: KeyboardEvent): void {
		// Do not intercept if user is composing text with an IME
		if (event.isComposing) {
			return;
		}

		if (event.key === 'Enter') {
			if (event.shiftKey) {
				// Shift + Enter adds a new line (allow default)
				return;
			}

			if (this.submitOnEnter()) {
				event.preventDefault();

				if (this._parent) {
					this._parent.requestSubmit();
				} else {
					const trimmed = this.getValue().trim();
					if (trimmed) {
						this.promptSubmit.emit(trimmed);
						this.clear();
					}
				}
			}
		}
	}
}
