import { Component } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-textarea-label',
	imports: [HlmInputImports, HlmLabelImports],
	template: `
		<div class="grid w-full max-w-sm items-center gap-3">
			<label hlmLabel for="message">Your message</label>
			<textarea class="min-h-16 w-80" hlmInput id="message" placeholder="Type ypur message here."></textarea>
		</div>
	`,
})
export class TextareaLabelPreview {}
