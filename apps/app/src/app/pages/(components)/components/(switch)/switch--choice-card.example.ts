import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-choice-card',
	imports: [HlmFieldImports, HlmSwitch],
	host: { class: 'min-w-xs sm:min-w-sm' },
	template: `
		<hlm-field-group class="w-full max-w-sm">
			<label hlmFieldLabel for="switch-share">
				<hlm-field orientation="horizontal">
					<hlm-field-content>
						<hlm-field-title for="switch-focus-mode">Share across devices</hlm-field-title>
						<p hlmFieldDescription>Focus is shared across devices, and turns off when you leave the app.</p>
					</hlm-field-content>
					<hlm-switch inputId="switch-share" />
				</hlm-field>
			</label>
			<label hlmFieldLabel for="switch-notifications">
				<hlm-field orientation="horizontal">
					<hlm-field-content>
						<hlm-field-title for="switch-focus-mode">Enable notifications</hlm-field-title>
						<p hlmFieldDescription>Receive notifications when focus mode is enabled or disabled.</p>
					</hlm-field-content>
					<hlm-switch inputId="switch-notifications" />
				</hlm-field>
			</label>
		</hlm-field-group>
	`,
})
export class SwitchChoiceCard {}
