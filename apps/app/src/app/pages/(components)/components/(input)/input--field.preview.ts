import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-field',
	imports: [HlmInputImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field>
			<label hlmFieldLabel for="input-field-username">Username</label>
			<input hlmInput id="input-field-username" type="text" placeholder="Enter your username" />
			<hlm-field-description>Choose a unique username for your account.</hlm-field-description>
		</hlm-field>
	`,
})
export class InputField {}
