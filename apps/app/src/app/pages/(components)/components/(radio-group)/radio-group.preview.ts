import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-radio-group-preview',
	imports: [FormsModule, HlmRadioGroupImports, HlmLabelImports],
	template: `
		<hlm-radio-group [(ngModel)]="spacing">
			<div class="flex items-center gap-3">
				<hlm-radio value="default" id="r1" disabled>
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="r1">Default</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio value="comfortable" id="r2">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="r2">Comfortable</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio value="compact" id="r3">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="r3">Compact</label>
			</div>
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
  <div class="flex items-center gap-3">
    <hlm-radio value="option-one" id="option-one">
      <hlm-radio-indicator indicator />
    </hlm-radio>
    <label hlmLabel for="option-one"> option-one</label>
  </div>
  <div class="flex items-center gap-3">
    <hlm-radio value="option-two" id="option-two">
      <hlm-radio-indicator indicator />
    </hlm-radio>
    <label hlmLabel for="option-two"> option-two</label>
  </div>
</hlm-radio-group>
`;
