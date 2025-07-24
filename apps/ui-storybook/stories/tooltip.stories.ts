import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { BrnTooltipContent, BrnTooltipContentTemplate } from '@spartan-ng/brain/tooltip';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmTooltip, HlmTooltipTrigger } from '@spartan-ng/helm/tooltip';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmTooltip> = {
	title: 'Tooltip',
	component: HlmTooltip,
	tags: ['autodocs'],
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [
				HlmButton,
				HlmTooltip,
				BrnTooltipContent,
				BrnTooltipContentTemplate,
				HlmTooltipTrigger,
				NgIcon,
				HlmIcon,
			],
			providers: [provideIcons({ lucidePlus })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmTooltip>;
export const Default: Story = {
	argTypes: {
		position: {
			control: { type: 'radio' },
			options: ['above', 'below', 'left', 'right'],
			defaultValue: 'above',
		},
	},
	render: ({ ...args }) => ({
		props: args,
		template: `
<div class='p-40'>
  <hlm-tooltip>
    <button hlmTooltipTrigger ${argsToTemplate(args)} aria-describedby='Hello world' hlmBtn variant='outline'>Test</button>
    <span *brnTooltipContent class='flex items-center'>
      Add to library <ng-icon hlm class='ml-2' size='sm' name='lucidePlus'/>
     </span>
  </hlm-tooltip>
</div>
`,
	}),
};

@Component({
	selector: 'simple-tooltip-story',
	imports: [HlmButton, HlmTooltip, BrnTooltipContent, BrnTooltipContentTemplate, HlmTooltipTrigger, NgIcon, HlmIcon],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div class="p-40">
			<button
				(click)="disabled.set(!disabled())"
				aria-describedby="Add to library"
				[hlmTooltipTrigger]="'Add to library'"
				[hlmTooltipDisabled]="disabled()"
				hlmBtn
				variant="icon"
			>
				<ng-icon hlm name="lucidePlus" size="sm" />
			</button>
		</div>
	`,
})
class SimpleTooltip {
	protected readonly disabled = signal(false);
}

export const Simple: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [SimpleTooltip],
		},
		template: '<simple-tooltip-story/>',
	}),
};

@Component({
	selector: 'disabled-tooltip-story',
	imports: [HlmButton, HlmTooltip, BrnTooltipContent, BrnTooltipContentTemplate, HlmTooltipTrigger, NgIcon, HlmIcon],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div class="p-40">
			<hlm-tooltip>
				<button
					(click)="disabled.set(!disabled())"
					hlmTooltipTrigger
					[hlmTooltipDisabled]="disabled()"
					aria-describedby="Hello world"
					hlmBtn
					variant="outline"
				>
					Test
				</button>
				<span *brnTooltipContent class="flex items-center">
					Add to library
					<ng-icon hlm class="ml-2" size="sm" name="lucidePlus" />
				</span>
			</hlm-tooltip>
			<p>{{ disabled() ? 'disabled' : 'enabled' }}</p>
		</div>
	`,
})
class DisabledTooltip {
	protected readonly disabled = signal(false);
}

export const Disabled: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [DisabledTooltip],
		},
		template: '<disabled-tooltip-story/>',
	}),
};
