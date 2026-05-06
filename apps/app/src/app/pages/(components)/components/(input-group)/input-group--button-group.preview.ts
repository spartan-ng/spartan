import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLink2 } from '@ng-icons/lucide';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-input-group-button-group-preview',
	imports: [HlmInputGroupImports, HlmButtonGroupImports, HlmLabelImports, HlmIconImports],
	providers: [provideIcons({ lucideLink2 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<hlm-button-group>
			<hlm-button-group-text>
				<label hlmLabel for="url">https://</label>
			</hlm-button-group-text>
			<hlm-input-group>
				<input hlmInputGroupInput id="url" />
				<hlm-input-group-addon align="inline-end">
					<ng-icon name="lucideLink2" />
				</hlm-input-group-addon>
			</hlm-input-group>
			<hlm-button-group-text>.com</hlm-button-group-text>
		</hlm-button-group>
	`,
})
export class InputGroupButtonGroupPreview {}
