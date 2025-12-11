import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-field-switch-preview',
	imports: [HlmFieldImports, HlmSwitchImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<div hlmField orientation="horizontal">
			<div hlmFieldContent>
				<label hlmFieldLabel for="field-2fa">Multi-factor authentication</label>
				<p hlmFieldDescription>
					Enable multi-factor authentication. If you do not have a two-factor device, you can use a one-time code sent
					to your email.
				</p>
			</div>
			<hlm-switch id="field-2fa" />
		</div>
	`,
})
export class FieldSwitchPreview {}
