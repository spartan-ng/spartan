import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';

@Component({
	selector: 'spartan-native-select-disabled-example',
	imports: [HlmNativeSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-native-select disabled>
			<option hlmNativeSelectOption value="">Select a fruit</option>
			<option hlmNativeSelectOption value="apple">Apple</option>
			<option hlmNativeSelectOption value="banana">Banana</option>
			<option hlmNativeSelectOption value="blueberry">Blueberry</option>
		</hlm-native-select>
	`,
})
export class NativeSelectDisabledExample {}
