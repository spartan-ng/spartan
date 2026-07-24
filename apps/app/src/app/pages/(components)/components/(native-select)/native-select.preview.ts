import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';

@Component({
	selector: 'spartan-native-select-preview',
	imports: [HlmNativeSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-native-select>
			<option hlmNativeSelectOption value="">Select status</option>
			<option hlmNativeSelectOption value="todo">Todo</option>
			<option hlmNativeSelectOption value="in-progress">In Progress</option>
			<option hlmNativeSelectOption value="done">Done</option>
			<option hlmNativeSelectOption value="cancelled">Cancelled</option>
		</hlm-native-select>
	`,
})
export class NativeSelectPreview {}

export const defaultImports = `
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
`;

export const defaultSkeleton = `
<hlm-native-select>
  <option hlmNativeSelectOption value="">Select a fruit</option>
  <option hlmNativeSelectOption value="apple">Apple</option>
  <option hlmNativeSelectOption value="banana">Banana</option>
  <option hlmNativeSelectOption value="blueberry">Blueberry</option>
  <option hlmNativeSelectOption value="pineapple">Pineapple</option>
</hlm-native-select>
`;
