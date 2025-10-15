import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-button',
	imports: [HlmTextareaImports, HlmLabelImports, HlmButton],
	template: `
		<div class="w-fill grid gap-2">
			<textarea hlmTextarea class="w-80" placeholder="Type ypur message here."></textarea>
			<button hlmBtn>Send message</button>
		</div>
	`,
})
export class TextareaButtonPreview {}
