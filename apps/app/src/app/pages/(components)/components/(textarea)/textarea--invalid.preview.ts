import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-invalid',
	imports: [HlmTextareaImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field forceInvalid>
			<label hlmFieldLabel for="textarea-invalid">Message</label>
			<textarea hlmTextarea forceInvalid id="textarea-invalid" placeholder="Type your message here."></textarea>
			<hlm-field-description>Please enter a valid message.</hlm-field-description>
		</hlm-field>
	`,
})
export class TextareaInvalid {}
