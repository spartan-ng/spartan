import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';

@Component({
	selector: 'spartan-native-select-groups-example',
	imports: [HlmNativeSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-native-select>
			<option hlmNativeSelectOption value="">Select department</option>
			<optgroup hlmNativeSelectOptGroup label="Engineering">
				<option hlmNativeSelectOption value="frontend">Frontend</option>
				<option hlmNativeSelectOption value="backend">Backend</option>
				<option hlmNativeSelectOption value="devops">DevOps</option>
			</optgroup>
			<optgroup hlmNativeSelectOptGroup label="Sales">
				<option hlmNativeSelectOption value="sales-rep">Sales Rep</option>
				<option hlmNativeSelectOption value="account-manager">Account Manager</option>
				<option hlmNativeSelectOption value="sales-director">Sales Director</option>
			</optgroup>
			<optgroup hlmNativeSelectOptGroup label="Operations">
				<option hlmNativeSelectOption value="support">Support</option>
				<option hlmNativeSelectOption value="product-manager">Product Manager</option>
				<option hlmNativeSelectOption value="ops-manager">Ops Manager</option>
			</optgroup>
		</hlm-native-select>
	`,
})
export class NativeSelectGroupsExample {}
