import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-field-group',
	imports: [HlmInputImports, HlmFieldImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field-group>
			<hlm-field>
				<label hlmFieldLabel for="fieldgroup-name">Name</label>
				<input hlmInput id="fieldgroup-name" placeholder="Leonidas" />
			</hlm-field>
			<hlm-field>
				<label hlmFieldLabel for="fieldgroup-email">Email</label>
				<input hlmInput id="fieldgroup-email" type="email" placeholder="name@example.com" />
				<hlm-field-description>We'll send updates to this address.</hlm-field-description>
			</hlm-field>
			<hlm-field orientation="horizontal">
				<button hlmBtn variant="outline" type="reset">Reset</button>
				<button hlmBtn type="submit">Submit</button>
			</hlm-field>
		</hlm-field-group>
	`,
})
export class InputFieldGroup {}
