import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-textarea-button',
	imports: [HlmInputImports, HlmLabelImports, HlmButton],
	template: `
		<div class="w-fill grid gap-2">
			<textarea class="min-h-16 w-80" hlmInput placeholder="Type ypur message here."></textarea>
			<button hlmBtn>Send message</button>
		</div>
	`,
})
export class TextareaButtonPreview {}
