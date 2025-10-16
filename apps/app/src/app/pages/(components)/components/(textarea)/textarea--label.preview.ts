import { Component } from '@angular/core';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-label',
	imports: [HlmTextareaImports, HlmLabelImports],
	template: `
		<div class="grid w-full max-w-sm items-center gap-3">
			<label hlmLabel for="message">Your message</label>
			<textarea hlmTextarea class="w-80" id="message" placeholder="Type ypur message here."></textarea>
		</div>
	`,
})
export class TextareaLabelPreview {}
