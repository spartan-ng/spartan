import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { BrnInputGroupImports } from '@spartan-ng/brain/input-group';
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
			imports: [HlmInputGroupImports, BrnInputGroupImports, HlmInput, HlmIcon, NgIcon],
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
				<div brnPrefix><ng-icon hlm name="lucideSend" /></div>
				<input hlmInput />
				<div brnSuffix><ng-icon hlm name="lucideSend" /></div>
			</hlm-input-group>

			<hlm-input-group>
				<div brnPrefixAddon>
					<ng-icon hlm name="lucideSend" />
				</div>

				<input hlmInput />

				<div brnSuffixAddon>
					<ng-icon hlm name="lucideSend" />
				</div>
			</hlm-input-group>
		</div>
		`,
	}),
};
