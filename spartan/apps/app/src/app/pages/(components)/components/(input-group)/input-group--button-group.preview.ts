import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLink2 } from '@ng-icons/lucide';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-input-group-button-group-preview',
	imports: [HlmInputGroupImports, HlmButtonGroupImports, HlmLabelImports, HlmIconImports],
	providers: [
		provideIcons({
			lucideLink2,
		}),
	],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmButtonGroup>
			<div hlmButtonGroupText>
				<label hlmLabel for="url">https://</label>
			</div>
			<div hlmInputGroup>
				<input hlmInputGroupInput id="url" />
				<div hlmInputGroupAddon align="inline-end">
					<ng-icon name="lucideLink2" />
				</div>
			</div>
			<div hlmButtonGroupText>.com</div>
		</div>
	`,
})
export class InputGroupButtonGroupPreview {}
