import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-disabled',
	imports: [HlmInputImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-xs sm:min-w-sm' },
	template: `
		<hlm-field data-disabled="true">
			<label hlmFieldLabel for="input-disabled">Email</label>
			<input hlmInput id="input-demo-disabled" type="email" placeholder="Email" disabled />
			<hlm-field-description>This field is currently disabled.</hlm-field-description>
		</hlm-field>
	`,
})
export class InputDisabledPreview {}
