import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmInputGroup, HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Input Group',
	component: HlmInputGroup,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmInputGroupImports, HlmInput, HlmIcon, NgIcon],
			providers: [provideIcons({ lucideSend })],
		}),
	],
} as Meta<HlmInputGroup>;

type Story = StoryObj<HlmInputGroup>;

export const Default: Story = {
	render: () => ({
		template: `
		<div class="flex flex-col gap-4">
			<hlm-input-group>
				<hlm-suffix><ng-icon hlm name="lucideSend" /></hlm-suffix>
				<input hlmInput />
				<hlm-prefix><ng-icon hlm name="lucideSend" /></hlm-prefix>
			</hlm-input-group>

			<hlm-input-group>
				<hlm-prefix-addon>
					<ng-icon hlm name="lucideSend" />
				</hlm-prefix-addon>
				<input hlmInput />

				<hlm-suffix-addon>
					<ng-icon hlm name="lucideSend" />
				</hlm-suffix-addon>
			</hlm-input-group>
		</div>
		`,
	}),
};
