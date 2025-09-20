import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-radio-group-preview',
	imports: [FormsModule, HlmRadioGroupImports, HlmLabelImports],
	template: `
		<hlm-radio-group [(ngModel)]="spacing">
			<label class="flex items-center gap-3" hlmLabel>
				<hlm-radio value="default">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				Default
			</label>
			<label class="flex items-center gap-3" hlmLabel>
				<hlm-radio value="comfortable">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				Comfortable
			</label>
			<label class="flex items-center gap-3" hlmLabel>
				<hlm-radio value="compact">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				Compact
			</label>
		</hlm-radio-group>
	`,
})
export class RadioGroupPreview {
	public spacing = 'comfortable';
}

export const defaultImports = `
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
`;
export const defaultSkeleton = `
<hlm-radio-group>
  <label class="flex items-center" hlmLabel>
		<hlm-radio value="16.1.4">
			<hlm-radio-indicator indicator />
		</hlm-radio>
		v16.1.4
	</label>
</hlm-radio-group>
`;
