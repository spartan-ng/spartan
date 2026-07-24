import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-input-group-spinner-preview',
	imports: [HlmInputGroupImports, NgIcon, HlmSpinnerImports],
	providers: [provideIcons({ lucideLoader })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Searching..." />
			<hlm-input-group-addon align="inline-end">
				<hlm-spinner />
			</hlm-input-group-addon>
		</hlm-input-group>

		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Processing..." />
			<hlm-input-group-addon>
				<hlm-spinner />
			</hlm-input-group-addon>
		</hlm-input-group>

		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Saving changes..." />
			<hlm-input-group-addon align="inline-end">
				<hlm-input-group-text>Saving...</hlm-input-group-text>
				<hlm-spinner />
			</hlm-input-group-addon>
		</hlm-input-group>

		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Refreshing data..." />
			<hlm-input-group-addon>
				<ng-icon name="lucideLoader" class="motion-safe:animate-spin" />
			</hlm-input-group-addon>

			<hlm-input-group-addon align="inline-end">
				<hlm-input-group-text>Please wait...</hlm-input-group-text>
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class InputGroupSpinnerPreview {}
