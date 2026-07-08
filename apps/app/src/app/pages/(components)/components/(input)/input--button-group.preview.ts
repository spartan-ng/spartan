import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-button-group',
	imports: [HlmInputImports, HlmFieldImports, HlmButtonGroupImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-xs sm:min-w-sm' },
	template: `
		<hlm-field>
			<label hlmFieldLabel for="input-button-group">Search</label>
			<hlm-button-group>
				<input hlmInput id="input-button-group" placeholder="Type to search..." />
				<button hlmBtn variant="outline">Search</button>
			</hlm-button-group>
		</hlm-field>
	`,
})
export class InputButtonGroup {}
