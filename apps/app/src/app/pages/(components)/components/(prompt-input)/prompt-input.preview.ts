import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmPromptInputImports } from '@spartan-ng/helm/prompt-input';

@Component({
	selector: 'spartan-prompt-input-preview',
	imports: [HlmPromptInputImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideArrowUp })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmPromptInput class="w-96 max-w-full">
			<textarea hlmPromptInputTextarea placeholder="Ask anything..."></textarea>
			<div hlmPromptInputActions class="justify-end">
				<button hlmBtn hlmPromptInputSubmit size="icon-sm" aria-label="Send prompt">
					<ng-icon name="lucideArrowUp" />
				</button>
			</div>
		</div>
	`,
})
export class PromptInputPreview {}

export const defaultImports = `
import { HlmPromptInputImports } from '@spartan-ng/helm/prompt-input';
import { HlmButtonImports } from '@spartan-ng/helm/button';
`;

export const defaultSkeleton = `
<div hlmPromptInput (promptSubmit)="onSubmit($event)" (promptStop)="onStop()">
  <textarea hlmPromptInputTextarea placeholder="Ask anything..."></textarea>

  <div hlmPromptInputActions class="justify-end">
    <button hlmBtn hlmPromptInputSubmit size="icon-sm">Send</button>
  </div>
</div>
`;
