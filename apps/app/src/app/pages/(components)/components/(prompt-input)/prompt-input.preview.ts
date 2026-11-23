import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideGlobe, lucidePaperclip, lucideSparkles, lucideSquare } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmPromptInputImports } from '@spartan-ng/helm/prompt-input';

@Component({
	selector: 'spartan-prompt-input-preview',
	imports: [HlmPromptInputImports, HlmButtonImports, NgIcon, FormsModule],
	providers: [provideIcons({ lucideArrowUp, lucidePaperclip, lucideGlobe, lucideSquare, lucideSparkles })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-xl flex-col gap-4 py-6',
	},
	template: `
		<div
			hlmPromptInput
			[streaming]="_isStreaming()"
			(promptSubmit)="onSubmit($event)"
			(promptStop)="onStop()"
			class="w-full"
		>
			<textarea
				hlmPromptInputTextarea
				[(ngModel)]="_prompt"
				placeholder="Ask anything or prompt the AI agent..."
				[maxRows]="6"
			></textarea>

			<div hlmPromptInputActions class="flex items-center justify-between">
				<div class="flex items-center gap-1">
					<button hlmBtn size="icon-sm" variant="ghost" aria-label="Add attachments">
						<ng-icon name="lucidePaperclip" />
					</button>
					<button hlmBtn size="icon-sm" variant="ghost" aria-label="Search web">
						<ng-icon name="lucideGlobe" />
					</button>
					<span class="text-muted-foreground ml-1 hidden items-center gap-1 text-xs sm:inline-flex">
						<ng-icon name="lucideSparkles" class="text-primary size-3" />
						Agent Mode
					</span>
				</div>

				<div class="flex items-center gap-2">
					@if (_isStreaming()) {
						<button hlmBtn hlmPromptInputStop size="icon-sm" variant="destructive" aria-label="Stop generation">
							<ng-icon name="lucideSquare" />
						</button>
					} @else {
						<button
							hlmBtn
							hlmPromptInputSubmit
							size="icon-sm"
							variant="default"
							[disabled]="!_prompt.trim()"
							aria-label="Send prompt"
						>
							<ng-icon name="lucideArrowUp" />
						</button>
					}
				</div>
			</div>
		</div>

		@if (_lastSubmitted()) {
			<div class="text-muted-foreground text-xs">
				<span class="text-foreground font-medium">Last submitted:</span>
				"{{ _lastSubmitted() }}"
			</div>
		}
	`,
})
export class PromptInputPreview {
	protected _prompt = '';
	protected readonly _isStreaming = signal(false);
	protected readonly _lastSubmitted = signal<string | null>(null);

	protected onSubmit(value: string): void {
		this._lastSubmitted.set(value);
		this._prompt = '';
		// Simulate active streaming
		this._isStreaming.set(true);
		setTimeout(() => {
			this._isStreaming.set(false);
		}, 3000);
	}

	protected onStop(): void {
		this._isStreaming.set(false);
	}
}

export const defaultImports = `
import { HlmPromptInputImports } from '@spartan-ng/helm/prompt-input';
import { HlmButtonImports } from '@spartan-ng/helm/button';
`;

export const defaultSkeleton = `
<div hlmPromptInput (promptSubmit)="onSend($event)">
  <textarea
    hlmPromptInputTextarea
    placeholder="Ask anything..."
  ></textarea>

  <div hlmPromptInputActions class="flex items-center justify-between">
    <button hlmBtn size="icon-sm" variant="ghost">
      <ng-icon name="lucidePaperclip" />
    </button>
    <button hlmBtn size="icon-sm" variant="default" hlmPromptInputSubmit>
      <ng-icon name="lucideArrowUp" />
    </button>
  </div>
</div>
`;
