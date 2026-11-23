import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { BrnPromptInput } from './brn-prompt-input';
import { BrnPromptInputStop } from './brn-prompt-input-stop';
import { BrnPromptInputSubmit } from './brn-prompt-input-submit';
import { BrnPromptInputTextarea } from './brn-prompt-input-textarea';

@Component({
	imports: [BrnPromptInput, BrnPromptInputTextarea, BrnPromptInputSubmit, BrnPromptInputStop],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnPromptInput
			[disabled]="disabled()"
			[streaming]="streaming()"
			(promptSubmit)="onSubmit($event)"
			(promptStop)="onStop()"
		>
			<textarea brnPromptInputTextarea placeholder="Type something..."></textarea>
			<button brnPromptInputSubmit data-testid="submit-btn">Send</button>
			<button brnPromptInputStop data-testid="stop-btn">Stop</button>
		</div>
	`,
})
class PromptInputSpecComponent {
	public readonly disabled = input(false);
	public readonly streaming = input(false);
	public readonly promptSubmit = output<string>();
	public readonly promptStop = output<void>();

	protected onSubmit(value: string): void {
		this.promptSubmit.emit(value);
	}

	protected onStop(): void {
		this.promptStop.emit();
	}
}

describe('BrnPromptInput', () => {
	it('should render the prompt input and textarea with proper ARIA attributes', async () => {
		const { getByRole, container } = await render(PromptInputSpecComponent);

		const root = container.querySelector('[data-slot="prompt-input"]');
		expect(root).not.toBeNull();

		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea).not.toBeNull();
		expect(textarea.rows).toBe(1);
	});

	it('should submit trimmed text on Enter and clear textarea', async () => {
		const submitSpy = vi.fn();
		const { getByRole } = await render(PromptInputSpecComponent, {
			on: { promptSubmit: submitSpy },
		});

		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		fireEvent.input(textarea, { target: { value: '  Hello AI Agent  ' } });

		fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

		expect(submitSpy).toHaveBeenCalledWith('Hello AI Agent');
		expect(textarea.value).toBe('');
	});

	it('should NOT submit on Shift + Enter (allowing multiline input)', async () => {
		const submitSpy = vi.fn();
		const { getByRole } = await render(PromptInputSpecComponent, {
			on: { promptSubmit: submitSpy },
		});

		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		fireEvent.input(textarea, { target: { value: 'Line 1' } });

		fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

		expect(submitSpy).not.toHaveBeenCalled();
	});

	it('should NOT submit empty or whitespace-only text', async () => {
		const submitSpy = vi.fn();
		const { getByRole } = await render(PromptInputSpecComponent, {
			on: { promptSubmit: submitSpy },
		});

		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		fireEvent.input(textarea, { target: { value: '   ' } });

		fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

		expect(submitSpy).not.toHaveBeenCalled();
	});

	it('should NOT submit when disabled', async () => {
		const submitSpy = vi.fn();
		const { getByRole } = await render(PromptInputSpecComponent, {
			componentInputs: { disabled: true },
			on: { promptSubmit: submitSpy },
		});

		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea.disabled).toBe(true);

		fireEvent.input(textarea, { target: { value: 'Test' } });
		fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

		expect(submitSpy).not.toHaveBeenCalled();
	});

	it('should submit when submit button is clicked', async () => {
		const submitSpy = vi.fn();
		const { getByRole, getByTestId } = await render(PromptInputSpecComponent, {
			on: { promptSubmit: submitSpy },
		});

		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		fireEvent.input(textarea, { target: { value: 'Run agent task' } });

		const submitBtn = getByTestId('submit-btn');
		fireEvent.click(submitBtn);

		expect(submitSpy).toHaveBeenCalledWith('Run agent task');
		expect(textarea.value).toBe('');
	});

	it('should emit stop event when stop button is clicked', async () => {
		const stopSpy = vi.fn();
		const { getByTestId } = await render(PromptInputSpecComponent, {
			componentInputs: { streaming: true },
			on: { promptStop: stopSpy },
		});

		const stopBtn = getByTestId('stop-btn');
		fireEvent.click(stopBtn);

		expect(stopSpy).toHaveBeenCalled();
	});

	it('should not submit while streaming', async () => {
		const submitSpy = vi.fn();
		const { getByRole } = await render(PromptInputSpecComponent, {
			componentInputs: { streaming: true },
			on: { promptSubmit: submitSpy },
		});

		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		fireEvent.input(textarea, { target: { value: 'Too soon' } });
		fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

		expect(submitSpy).not.toHaveBeenCalled();
	});

	it('should not emit stop when not streaming', async () => {
		const stopSpy = vi.fn();
		const { getByTestId } = await render(PromptInputSpecComponent, {
			on: { promptStop: stopSpy },
		});

		fireEvent.click(getByTestId('stop-btn'));

		expect(stopSpy).not.toHaveBeenCalled();
	});
});
