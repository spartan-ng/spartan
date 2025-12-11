import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideCheck, lucideInfo, lucidePlus, lucideSearch, lucideSend } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroup, HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Input Group',
	component: HlmInputGroup,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmInputGroupImports, HlmIcon, NgIcon, HlmSeparatorImports, HlmTooltipImports, ReactiveFormsModule],
			providers: [provideIcons({ lucideSend, lucideSearch, lucideInfo, lucidePlus, lucideArrowUp, lucideCheck })],
		}),
	],
} as Meta<HlmInputGroup>;

type Story = StoryObj<HlmInputGroup>;

export const Default: Story = {
	render: () => ({
		template: `
<div class="grid w-full max-w-sm gap-6">
			<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Search..." />
			<div hlmInputGroupAddon>
				<ng-icon hlm name="lucideSearch" />
			</div>
			<div hlmInputGroupAddon align="inline-end">12 results</div>
		</div>
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="example.com" class="!pl-1" />
			<div hlmInputGroupAddon>
				<span hlmInputGroupText>https://</span>
			</div>
			<div hlmInputGroupAddon align="inline-end">
				<button
					hlmInputGroupButton
					class="rounded-full"
					size="icon-xs"
					[hlmTooltipTrigger]="'This is content in a tooltip.'"
				>
					<ng-icon hlm name="lucideInfo" />
				</button>
			</div>
		</div>
		<div hlmInputGroup>
			<textarea hlmInputGroupTextarea placeholder="Ask, Search or Chat..."></textarea>
			<div hlmInputGroupAddon align="block-end">
				<button hlmInputGroupButton variant="outline" class="rounded-full" size="icon-xs">
					<ng-icon hlm name="lucidePlus" />
				</button>
				<span hlmInputGroupText class="ml-auto">52% used</span>
				<hlm-separator orientation="vertical" class="!h-4" />
				<button hlmInputGroupButton variant="default" class="rounded-full" size="icon-xs" disabled>
					<ng-icon hlm name="lucideArrowUp" />
					<span class="sr-only">Send</span>
				</button>
			</div>
		</div>
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="@spartan" />
			<div hlmInputGroupAddon align="inline-end">
				<div class="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
					<ng-icon hlm name="lucideCheck" size="xs" />
				</div>
			</div>
		</div>
		</div>
		`,
	}),
};
