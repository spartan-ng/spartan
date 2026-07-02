import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-disabled',
	imports: [HlmTextareaImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-xs sm:min-w-sm' },
	template: `
		<hlm-field data-disabled="true">
			<label hlmFieldLabel for="textarea-disabled">Message</label>
			<textarea hlmTextarea id="textarea-disabled" placeholder="Type your message here." disabled></textarea>
		</hlm-field>
	`,
})
export class TextareaDisabledPreview {}
