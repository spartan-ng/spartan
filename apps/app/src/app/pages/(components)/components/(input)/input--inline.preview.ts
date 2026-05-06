import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-inline',
	imports: [HlmInputImports, HlmFieldImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field orientation="horizontal">
			<input hlmInput type="search" placeholder="Search..." />
			<button hlmBtn>Search</button>
		</hlm-field>
	`,
})
export class InputInline {}
