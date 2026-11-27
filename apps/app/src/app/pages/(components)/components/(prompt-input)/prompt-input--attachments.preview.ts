import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideFileCode, lucideX } from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmPromptInputImports } from '@spartan-ng/helm/prompt-input';

@Component({
	selector: 'spartan-prompt-input-attachments',
	imports: [HlmPromptInputImports, HlmAttachmentImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideArrowUp, lucideFileCode, lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmPromptInput class="w-96 max-w-full">
			<div hlmPromptInputAttachments>
				<div hlmAttachment>
					<div hlmAttachmentMedia>
						<ng-icon name="lucideFileCode" />
					</div>
					<div hlmAttachmentContent>
						<span hlmAttachmentTitle>schema.sql</span>
						<span hlmAttachmentDescription>SQL · 4 KB</span>
					</div>
					<div hlmAttachmentActions>
						<button hlmAttachmentAction aria-label="Remove schema.sql">
							<ng-icon name="lucideX" />
						</button>
					</div>
				</div>
			</div>
			<textarea hlmPromptInputTextarea placeholder="Ask about the attached files..."></textarea>
			<div hlmPromptInputActions class="justify-end">
				<button hlmBtn hlmPromptInputSubmit size="icon-sm" aria-label="Send prompt">
					<ng-icon name="lucideArrowUp" />
				</button>
			</div>
		</div>
	`,
})
export class PromptInputAttachments {}
