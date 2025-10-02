import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-input-form',
	imports: [HlmInputImports, HlmLabelImports, HlmButtonImports, HlmFormFieldImports],
	template: `
		<form class="space-y-6">
			<div class="grid w-full max-w-sm items-center gap-2">
				<label hlmLabel for="username">Username</label>
				<input hlmInput type="text" id="username" placeholder="spartan" />
				<hlm-hint>This is your public display name.</hlm-hint>
			</div>
			<button hlmBtn type="submit">Submit</button>
		</form>
	`,
})
export class InputFormPreview {}
