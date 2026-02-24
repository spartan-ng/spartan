import { HlmNativeSelect, HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Native Select',
	component: HlmNativeSelect,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmNativeSelectImports],
		}),
	],
} as Meta<HlmNativeSelect>;

type Story = StoryObj<HlmNativeSelect>;

export const Default: Story = {
	render: () => ({
		template: `
<hlm-native-select>
  <option hlmNativeSelectOption value="">Select a fruit</option>
  <option hlmNativeSelectOption value="apple">Apple</option>
  <option hlmNativeSelectOption value="banana">Banana</option>
  <option hlmNativeSelectOption value="blueberry">Blueberry</option>
  <option hlmNativeSelectOption value="pineapple">Pineapple</option>
</hlm-native-select>
		`,
	}),
};
