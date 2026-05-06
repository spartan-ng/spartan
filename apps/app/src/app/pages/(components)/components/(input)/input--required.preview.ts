import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-required',
	imports: [HlmInputImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field>
			<label hlmFieldLabel for="input-required">
				Required Field
				<span class="text-destructive">*</span>
			</label>
			<input hlmInput id="input-required" required placeholder="This field is required" />
			<hlm-field-description>This field must be filled out.</hlm-field-description>
		</hlm-field>
	`,
})
export class InputRequired {}
