import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-button',
	imports: [HlmTextareaImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<div class="grid w-full gap-2">
			<textarea hlmTextarea placeholder="Type your message here."></textarea>
			<button hlmBtn>Send message</button>
		</div>
	`,
})
export class TextareaButtonPreview {}
