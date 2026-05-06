import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-input-group',
	imports: [HlmInputImports, HlmFieldImports, HlmInputGroupImports, NgIcon],
	providers: [provideIcons({ lucideInfo })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field>
			<label hlmFieldLabel for="input-group-url">Website URL</label>
			<hlm-input-group>
				<input hlmInputGroupInput id="input-group-url" placeholder="example.com" />
				<hlm-input-group-addon>
					<hlm-input-group-text>https://</hlm-input-group-text>
				</hlm-input-group-addon>
				<hlm-input-group-addon align="inline-end">
					<ng-icon name="lucideInfo" />
				</hlm-input-group-addon>
			</hlm-input-group>
		</hlm-field>
	`,
})
export class InputInputGroup {}
