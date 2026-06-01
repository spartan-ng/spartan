import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';

@Component({
	selector: 'spartan-native-select-invalid-example',
	imports: [HlmNativeSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-native-select forceInvalid="true">
			<option hlmNativeSelectOption value="">Error state</option>
			<option hlmNativeSelectOption value="apple">Apple</option>
			<option hlmNativeSelectOption value="banana">Banana</option>
			<option hlmNativeSelectOption value="blueberry">Blueberry</option>
		</hlm-native-select>
	`,
})
export class NativeSelectInvalidExample {}
