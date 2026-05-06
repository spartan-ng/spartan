import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-field',
	imports: [HlmTextareaImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field>
			<label hlmFieldLabel for="textarea-message">Message</label>
			<hlm-field-description>Enter your message below.</hlm-field-description>
			<textarea hlmTextarea id="textarea-message" placeholder="Type your message here."></textarea>
		</hlm-field>
	`,
})
export class TextareaField {}
