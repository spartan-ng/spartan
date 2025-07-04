import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { HlmRadioComponent, HlmRadioGroupComponent, HlmRadioIndicatorComponent } from '@spartan-ng/helm/radio-group';
import { HlmSmallDirective } from '@spartan-ng/helm/typography';

@Component({
	selector: 'spartan-radio-group-preview',
	imports: [
		FormsModule,
		HlmRadioComponent,
		HlmRadioIndicatorComponent,
		HlmRadioGroupComponent,
		HlmSmallDirective,
		HlmLabelDirective,
	],
	template: `
		<small hlmSmall class="font-semibold">Choose a version</small>
		<hlm-radio-group class="font-mono text-sm font-medium" [(ngModel)]="version">
			<label class="flex items-center" hlmLabel>
				<hlm-radio value="16.1.4">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v16.1.4
			</label>
			<label class="flex items-center" hlmLabel>
				<hlm-radio value="16.0.0">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v16.0.0
			</label>
			<label class="flex items-center" hlmLabel>
				<hlm-radio value="15.8.0">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v15.8.0
			</label>
			<label class="flex items-center" hlmLabel>
				<hlm-radio disabled value="15.2.0">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v15.2.0
			</label>
		</hlm-radio-group>
	`,
})
export class RadioGroupPreviewComponent {
	public version: string | null = '16.1.4';
}

export const defaultImports = `
import {
  HlmRadioComponent,
  HlmRadioGroupComponent,
  HlmRadioIndicatorComponent,
} from '@spartan-ng/helm/radio-group';
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
