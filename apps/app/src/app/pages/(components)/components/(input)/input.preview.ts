import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-preview',
	imports: [HlmInputImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field>
			<label hlmFieldLabel for="input-demo-api-key">API Key</label>
			<input hlmInput id="input-demo-api-key" type="password" placeholder="sk-..." />
			<hlm-field-description>Your API key is encrypted and stored securely.</hlm-field-description>
		</hlm-field>
	`,
})
export class InputPreview {}

export const defaultImports = `
import { HlmInputImports } from '@spartan-ng/helm/input';
`;
export const defaultSkeleton = '<input hlmInput/>';
