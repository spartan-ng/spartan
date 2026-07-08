import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-file',
	imports: [HlmInputImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-xs sm:min-w-sm' },
	template: `
		<hlm-field>
			<label hlmFieldLabel for="picture">Picture</label>
			<input hlmInput id="picture" type="file" />
			<hlm-field-description>Select a picture to upload.</hlm-field-description>
		</hlm-field>
	`,
})
export class InputFilePreview {}
