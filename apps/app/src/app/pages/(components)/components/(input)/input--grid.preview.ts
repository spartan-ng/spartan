import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-grid',
	imports: [HlmInputImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field-group class="grid max-w-sm grid-cols-2">
			<hlm-field>
				<label hlmFieldLabel for="first-name">First Name</label>
				<input hlmInput id="first-name" placeholder="King" />
			</hlm-field>
			<hlm-field>
				<label hlmFieldLabel for="last-name">Last Name</label>
				<input hlmInput id="last-name" placeholder="Leonidas" />
			</hlm-field>
		</hlm-field-group>
	`,
})
export class InputGrid {}
