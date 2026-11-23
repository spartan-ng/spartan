import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideSquare } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmPromptInputImports } from '@spartan-ng/helm/prompt-input';

@Component({
	selector: 'spartan-prompt-input-streaming',
	imports: [HlmPromptInputImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideArrowUp, lucideSquare })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			hlmPromptInput
			class="w-96 max-w-full"
			[streaming]="_isStreaming()"
			(promptSubmit)="_isStreaming.set(true)"
			(promptStop)="_isStreaming.set(false)"
		>
			<textarea hlmPromptInputTextarea placeholder="Submit to start streaming..."></textarea>
			<div hlmPromptInputActions class="justify-end">
				@if (_isStreaming()) {
					<button hlmBtn hlmPromptInputStop size="icon-sm" variant="outline" aria-label="Stop generation">
						<ng-icon name="lucideSquare" />
					</button>
				} @else {
					<button hlmBtn hlmPromptInputSubmit size="icon-sm" aria-label="Send prompt">
						<ng-icon name="lucideArrowUp" />
					</button>
				}
			</div>
		</div>
	`,
})
export class PromptInputStreaming {
	protected readonly _isStreaming = signal(false);
}
